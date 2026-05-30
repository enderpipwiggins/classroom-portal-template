# Customizing the Look

Your site comes with **five looks ("themes")** to choose from, and you can also
design your own. Switching themes is a one-line setting; designing your own means
editing a few colors and fonts. None of it requires real coding.

---

## Part 1: Pick a built-in theme

Themes are chosen by a single setting, `THEME_INDEX`, which you set in Vercel
(see [Procedure 4 in the Teacher's Guide](teacher-guide.md#procedure-4-add-or-update-environment-variables-in-vercel)).

| `THEME_INDEX` | Name | The vibe |
| --- | --- | --- |
| `0` | **Custom** (default) | Clean and neutral — *and yours to edit* (Part 2). |
| `1` | **Garden** | Fresh, leafy greens; soft, rounded, calm. |
| `2` | **Press** | Bold editorial/newspaper; big serif headlines, sharp edges. |
| `3` | **Dusk** | Dark mode; deep indigo with a glowing teal accent. |
| `4` | **Sunrise** | Warm coral and cream; friendly and playful. |

To try one: set `THEME_INDEX` to the number, save, and **redeploy** (themes are
baked in when the site builds, so a redeploy is required — editing your wish list
does *not* need one).

> The four named themes are **original designs inspired by** classic
> [CSS Zen Garden](https://www.csszengarden.com/) entries. They're our own
> recreations of those moods, free to use and modify under this project's
> license.

---

## Part 2: Design your own (theme 0)

Theme `0` — "Custom" — exists for exactly this. It starts as tidy, neutral
defaults, and you make it your own by editing one file:

```
src/themes/_theme-custom.scss
```

You can edit this **entirely on the GitHub website** — no software to install.

### How to edit a file on GitHub

1. Open your repository on **github.com**.
2. Click through the folders: `src` → `themes` → `_theme-custom.scss`.
3. Click the **pencil icon** (✏️ "Edit this file") in the top-right.
4. Make your changes (see below).
5. Scroll down, type a short note like "update colors," and click
   **Commit changes**.
6. Vercel automatically rebuilds and publishes — usually within a minute.

### What you can change

The file is full of friendly comments. The two things most people change:

**Colors** — lines that look like this:

```scss
--color-accent:    #2563eb;  // links and buttons (your brand color)
--color-bg:        #ffffff;  // page background
--color-text:      #1e293b;  // body text
```

Each value is a "hex code." Pick new ones at a tool like
[coolors.co](https://coolors.co) or [Google's color picker](https://g.co/kgs/colorpicker)
and paste them in, keeping the leading `#`.

**Fonts** — lines that look like this:

```scss
--font-display: 'Nunito', system-ui, sans-serif;  // headings
--font-body:    'Inter', system-ui, sans-serif;   // paragraphs
```

To use a different Google Font, change the name here **and** update the
`@import url(...)` line at the very top of the file to load that font. Browse
fonts at [fonts.google.com](https://fonts.google.com).

> Make sure `THEME_INDEX` is `0` (the default) so your custom theme is the one
> being shown.

### Don't worry about breaking it

Because GitHub keeps a history of every change, you can always undo. If a build
fails, your *previous* live site stays up untouched — Vercel only swaps to a new
version once it builds successfully.

---

## A note for the curious

Every theme works by defining a small set of "design tokens" (colors, fonts,
corner roundness, shadows). The rest of the site reads those tokens, so changing
a handful of values restyles the whole site at once — no need to hunt through
page after page.
