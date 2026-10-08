# vietgara-web-ui

> **Purpose:** This repo is the **web design system library (`@vietgara/web-ui`) shared by the two VietGara web apps**: tokens, themes and React components. It is a library, not an app.

| | |
| --- | --- |
| **Type** | TypeScript/React component library (source-only), consumed by git tag |
| **Used by** | `vietgara-owner-web` and `vietgara-admin-web` |
| **Does** | Design tokens (light and dark), Tailwind v4 theme, accessible components, app shell, a component gallery and a token contrast test |
| **Built with** | React, TypeScript, Tailwind CSS v4, Radix UI, Lucide, Motion, cmdk, sonner |
| **Delivered as** | A release tag `vX.Y.Z` that each web app pins in `package.json` over HTTPS |
| **Related** | The mobile counterpart of the theme is `vietgara-flutter-core`; the specification is in `vietgara-docs` (`docs/02-Design/v2`) |

The VietGara web design system: design tokens (light and dark), the Tailwind v4 theme and the React components shared by
[`vietgara-owner-web`](https://github.com/viettechno/vietgara-owner-web) and [`vietgara-admin-web`](https://github.com/viettechno/vietgara-admin-web).

The specification is in vietgara-docs: [`docs/02-Design/v2/03_Design_System.md`](https://github.com/viettechno/vietgara-docs/blob/master/docs/02-Design/v2/03_Design_System.md).
This repository ships **TypeScript source**; the consuming app's Vite build compiles it, like `vietgara_core` for the Flutter apps.

| Layer | What |
| --- | --- |
| `src/styles/tokens.css` | Semantic color tokens, light on `:root`, dark on `[data-theme='dark']` |
| `src/styles/base.css` | Tailwind `@theme` (type scale, radius, shadows, motion), base layer, responsive table rule |
| `src/components` | Buttons, form controls, dialogs and sheets (Radix), table, badges, layout, feedback, shell, theme |

## Use it in an app

```json
"dependencies": { "@vietgara/web-ui": "github:viettechno/vietgara-web-ui#v0.1.0" }
```

```css
/* src/app/styles.css */
@import 'tailwindcss';
@import '@vietgara/web-ui/styles.css';
@source '../../node_modules/@vietgara/web-ui/src';
```

```ts
// vite.config.ts: compile the kit's source with the app
optimizeDeps: { exclude: ['@vietgara/web-ui'] }
```

```tsx
// main.tsx
<UIProvider closeLabel="Close"> … </UIProvider>
```

and in `index.html` `<head>` the no-flash theme script (`themeInitScript` in `src/components/Theme.tsx`).

Docker builds that run `npm ci` need `git` in the image (`apk add --no-cache git` on Alpine) to fetch this dependency.

## Develop

```bash
npm install
npm run dev          # component gallery on http://localhost:5180 (light, dark, phone width)
npm run typecheck && npm run lint && npm test
```

`npm test` includes the **token contrast test**: every text and surface pair must reach 4.5 : 1 and every control boundary and focus ring 3 : 1, in light and dark.

To try a change in an app before tagging, sync the source into the app's `node_modules` (or `npm install --install-links ../vietgara-web-ui`).

## Change flow

Change the kit → add or update the gallery entry for every state → `npm test` → tag `vX.Y.Z` (semver: MAJOR token or identity change, MINOR new component, PATCH fix) → bump the tag in the apps. See `CHANGELOG.md`.
