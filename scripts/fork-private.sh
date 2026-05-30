#!/usr/bin/env bash
#
# Create your OWN PRIVATE copy of the Classroom Portal template on GitHub.
#
# Why a script instead of GitHub's "Fork" button? A fork of a public repo is
# itself public and stays linked to the original. To get a *private* copy you
# create a brand-new repository FROM the template — which is exactly what this
# does, using GitHub's official command-line tool (`gh`).
#
# Prefer no terminal at all? See the README section "Make it yours (a private
# copy)" for the point-and-click version: "Use this template -> choose Private".
#
# Usage:
#   bash scripts/fork-private.sh [new-repo-name]
#
# Override the source template (e.g. your own fork) with:
#   TEMPLATE_REPO=owner/repo bash scripts/fork-private.sh
#
set -euo pipefail

TEMPLATE_REPO="${TEMPLATE_REPO:-enderpipwiggins/classroom-portal-template}"
DEFAULT_NAME="classroom-portal"

# 1. The GitHub CLI must be installed.
if ! command -v gh >/dev/null 2>&1; then
  echo "✗ GitHub CLI (gh) isn't installed."
  echo "  Install it from https://cli.github.com/ and run this again."
  exit 1
fi

# 2. You must be signed in. If not, gh walks you through it interactively.
if ! gh auth status >/dev/null 2>&1; then
  echo "You're not signed in to GitHub yet — let's do that first."
  gh auth login
fi

# 3. Pick a name for the new repository (accept the default by pressing Enter).
NEW_NAME="${1:-}"
if [ -z "$NEW_NAME" ]; then
  read -r -p "Name for your new private repo [${DEFAULT_NAME}]: " NEW_NAME
  NEW_NAME="${NEW_NAME:-$DEFAULT_NAME}"
fi

# 4. Create the private repo from the template and clone it locally.
echo "Creating private repo \"${NEW_NAME}\" from ${TEMPLATE_REPO}…"
gh repo create "${NEW_NAME}" \
  --private \
  --template "${TEMPLATE_REPO}" \
  --clone

echo
echo "✓ Done! Your private copy is in ./${NEW_NAME}"
echo "  Next steps:"
echo "    cd ${NEW_NAME}"
echo "    npm install"
echo "    npm run setup     # personalize your site, then deploy on Vercel"
