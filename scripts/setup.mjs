/**
 * Interactive setup helper. Asks the "fill-in-the-blanks" questions and writes a
 * `.env` file you can use for local development (`npm start`) or copy into your
 * Vercel project's Environment Variables screen.
 *
 * Run it with:  npm run setup
 *
 * It only writes `.env` (which is gitignored). It never touches the secret PAAPI
 * keys — those should be set directly in Vercel, not saved to a local file. Every
 * answer has a default; press Enter to accept it. Re-run any time to change
 * things; it asks before overwriting an existing `.env`.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

// Defaults mirror scripts/generate-config.mjs and .env.example.
const DEFAULTS = {
  SITE_TITLE: 'Our Classroom Portal',
  SITE_TAGLINE: 'A little help goes a long way',
  SITE_DESCRIPTION:
    'Our classroom supply wish list. Donations through these links help stock our room at no extra cost to you.',
  SITE_URL: '',
  DONATIONS_TITLE: 'Our Classroom Wish List',
  DONATIONS_INTRO:
    'These are the supplies our class is hoping for this year. Each link goes straight to the item on Amazon.',
  CONTACT_EMAIL: 'teacher@example.com',
  SHIPPING_ADDRESS: '',
  THEME_INDEX: '0',
  STORAGE_PROVIDER: 'static-json',
  GOOGLE_SHEET_CSV_URL: '',
  AMAZON_ASSOCIATE_TAG: '',
};

const THEMES = ['Custom (your own)', 'Garden', 'Press', 'Dusk (dark)', 'Sunrise'];

const rl = createInterface({ input: stdin, output: stdout });

/** Ask a question, showing the default in brackets; empty input keeps the default. */
async function ask(question, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const answer = (await rl.question(`${question}${suffix}\n> `)).trim();
  return answer || fallback;
}

/** Ask a yes/no question. `defaultYes` controls which answer Enter selects. */
async function confirm(question, defaultYes = false) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await rl.question(`${question} (${hint}) `)).trim().toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

try {
  if (existsSync(envPath)) {
    const overwrite = await confirm('A .env file already exists. Overwrite it?', false);
    if (!overwrite) {
      console.log('Left your existing .env untouched. Nothing changed.');
      rl.close();
      process.exit(0);
    }
  }

  console.log('\nLet’s personalize your classroom portal. Press Enter to accept any default.\n');

  const values = { ...DEFAULTS };

  console.log('── Site identity ──');
  values.SITE_TITLE = await ask('Site title (header and browser tab)', DEFAULTS.SITE_TITLE);
  values.SITE_TAGLINE = await ask('Tagline (under the title)', DEFAULTS.SITE_TAGLINE);
  values.SITE_DESCRIPTION = await ask('Description (for search/social previews)', DEFAULTS.SITE_DESCRIPTION);
  values.SITE_URL = await ask(
    'Live site address — optional; leave blank to let Vercel fill it in automatically',
    DEFAULTS.SITE_URL,
  );

  console.log('\n── Donations page ──');
  values.DONATIONS_TITLE = await ask('Donations page heading', DEFAULTS.DONATIONS_TITLE);
  values.DONATIONS_INTRO = await ask('Donations page intro paragraph', DEFAULTS.DONATIONS_INTRO);

  console.log('\n── Contact ──');
  values.CONTACT_EMAIL = await ask('Contact email shown on the site', DEFAULTS.CONTACT_EMAIL);
  values.SHIPPING_ADDRESS = await ask(
    'Shipping address for donations — optional; leave blank to hide. Use a SCHOOL address, never a home one (it is public)',
    DEFAULTS.SHIPPING_ADDRESS,
  );

  console.log('\n── Theme ──');
  THEMES.forEach((name, i) => console.log(`  ${i} = ${name}`));
  let themeChoice = await ask('Theme number (0–4)', DEFAULTS.THEME_INDEX);
  const themeNum = Number.parseInt(themeChoice, 10);
  values.THEME_INDEX = String(Number.isInteger(themeNum) && themeNum >= 0 && themeNum <= 4 ? themeNum : 0);

  console.log('\n── Amazon Associates ──');
  values.AMAZON_ASSOCIATE_TAG = await ask('Your Associates tag, e.g. myclassroom-20 (blank for now is fine)', '');

  console.log('\n── Where your wish list lives ──');
  const useSheets = await confirm('Read your list from a Google Sheet? (No = edit the bundled JSON file)', false);
  if (useSheets) {
    values.STORAGE_PROVIDER = 'google-sheets';
    values.GOOGLE_SHEET_CSV_URL = await ask(
      'Published-CSV link from Google Sheets (File → Share → Publish to web → CSV)',
      '',
    );
  } else {
    values.STORAGE_PROVIDER = 'static-json';
  }

  console.log('\n── Footer social links (optional) ──');
  const socialLinks = [];
  if (await confirm('Add footer social links?', false)) {
    while (true) {
      const label = await ask('  Label (e.g. Instagram), or blank to finish', '');
      if (!label) break;
      const href = await ask(`  URL for "${label}"`, '');
      if (href) socialLinks.push({ label, href });
    }
  }

  writeFileSync(envPath, renderEnv(values, socialLinks), 'utf-8');

  console.log(`\n✓ Wrote ${envPath}`);
  console.log('  Next: run "npm start" to preview, or paste these values into Vercel.');
  if (!values.AMAZON_ASSOCIATE_TAG) {
    console.log('  Reminder: add your Amazon Associates tag once you have one.');
  }
  console.log(
    '  PAAPI keys (product images/prices) are secrets — set them in Vercel only, not in .env. See docs/teacher-guide.md.',
  );
} finally {
  rl.close();
}

/** Wraps a value in double quotes, escaping any embedded quotes. */
function quote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

/** Builds the .env file contents, mirroring the layout of .env.example. */
function renderEnv(values, socialLinks) {
  // Single-quote the JSON: it contains double quotes, and Node's --env-file
  // parser reads single-quoted values literally, so the JSON survives intact.
  const socialLine =
    socialLinks.length > 0
      ? `SOCIAL_LINKS_JSON='${JSON.stringify(socialLinks)}'`
      : `# SOCIAL_LINKS_JSON='[{"label":"Instagram","href":"https://instagram.com/you"}]'`;

  // Leave SITE_URL commented when blank, so Vercel's production domain (which it
  // supplies automatically) isn't overridden by an empty/placeholder value.
  const siteUrlLine = values.SITE_URL
    ? `SITE_URL=${quote(values.SITE_URL)}`
    : `# SITE_URL is optional on Vercel — left unset so Vercel fills it in.\n# SITE_URL="https://example.com"`;

  // Leave the shipping address commented when blank so the section stays hidden.
  const shippingLine = values.SHIPPING_ADDRESS
    ? `SHIPPING_ADDRESS=${quote(values.SHIPPING_ADDRESS)}`
    : `# SHIPPING_ADDRESS is optional and public — use a school address, never a home one.\n# SHIPPING_ADDRESS="Ms. Smith — Room 12\\nLincoln Elementary\\n123 Main St\\nSpringfield, IL 62701"`;

  return `# Generated by "npm run setup". Safe to edit by hand. This file is gitignored.
# Re-run "npm run setup" to regenerate it, or see .env.example for all options.

# -- Site identity --
SITE_TITLE=${quote(values.SITE_TITLE)}
SITE_TAGLINE=${quote(values.SITE_TAGLINE)}
SITE_DESCRIPTION=${quote(values.SITE_DESCRIPTION)}
${siteUrlLine}

# -- Donations page --
DONATIONS_TITLE=${quote(values.DONATIONS_TITLE)}
DONATIONS_INTRO=${quote(values.DONATIONS_INTRO)}

# -- Contact --
CONTACT_EMAIL=${quote(values.CONTACT_EMAIL)}
${shippingLine}
${socialLine}

# -- Theme (0 = Custom, 1 = Garden, 2 = Press, 3 = Dusk, 4 = Sunrise) --
THEME_INDEX=${values.THEME_INDEX}

# -- Where your wish list lives --
STORAGE_PROVIDER=${quote(values.STORAGE_PROVIDER)}
GOOGLE_SHEET_CSV_URL=${quote(values.GOOGLE_SHEET_CSV_URL)}

# -- Amazon Associates --
AMAZON_ASSOCIATE_TAG=${quote(values.AMAZON_ASSOCIATE_TAG)}

# -- Amazon PAAPI (optional, advanced) --
# These are SECRETS. Leave blank here and set them in Vercel only.
PAAPI_ACCESS_KEY=""
PAAPI_SECRET_KEY=""
PAAPI_PARTNER_TAG=""
`;
}
