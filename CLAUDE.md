# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

LexiPlex is a daily word puzzle game (Gatsby/React static site) deployed at https://lexiplex.gatsbyjs.io/. Players solve compound word puzzles: given a clue, they figure out a word that splits into two meaningful subwords (e.g., "MUSTACHE = MUST + ACHE").

## Development Commands

```bash
npm run develop   # Start dev server with hot reload
npm run build     # Production build
npm run serve     # Serve production build locally
npm run clean     # Clear Gatsby cache and public/
```

No test or lint commands are configured.

## Architecture

**Single-page app** — all game logic lives in `src/pages/index.js` as one large React component. There is no routing or backend.

**Puzzle data** is hardcoded in `utils/puzzles.js`. Each puzzle has:
```js
{ word, subword1, subword2, clue, structure, answer }
// answer format: "mustache must ache" (space-separated: full word + the two parts)
```

The active puzzle is selected by array index (`puzzles[1]` hardcoded at top of `index.js`). There is no date-based rotation yet.

**Game flow:**
1. User reads the clue
2. Clicks letter buttons on the QWERTY keyboard to reveal hint tiles (3 hints max)
3. Types the full compound word into the text input and submits
4. Correct → congratulations modal; Wrong → 1-second red flash animation

**Components:**
- `src/components/modal.js` — "How To Play" instructions modal
- `src/components/congratulationsModal.js` — Victory modal

**Styling:** Tailwind CSS utility classes + inline styles for flex layouts. Animations use `<style>` JSX tags within the page component. Dark mode is configured in `tailwind.config.js` (class-based) but not implemented.

**`utils/test.js`** is a standalone dev utility (not imported anywhere) that reads `en-dictionary.js` (gitignored) and generates puzzle candidates. It's not part of the app.
