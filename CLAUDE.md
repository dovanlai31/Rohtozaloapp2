# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Zalo Mini App for Rohto, used by **customers (pharmacies / stores)**: ordering (cart, promotions), loyalty points and rewards (tích lũy, đổi quà, phiếu trả thưởng), POSM checks, surveys, notifications. Built on the legacy **zmp-framework v1** (Framework7-style) with React 18, Vite 2, Tailwind 3 + SCSS. The UI text and most identifiers are Vietnamese.

## Commands

- `npm start` — compile Tailwind once (`watch:css`), then `zmp start` (dev server via zmp-cli)
- `npm run build` — `zmp build` (output in `www/`)
- `npm run deploy` — `zmp deploy` to Zalo
- `npm run build:css` — Tailwind in watch mode (regenerates `src/styles/output.css`)

There is no test suite. The `test` script (react-scripts) and the `@playwright/test` dependency are not set up. The README's `npm run dev` does not exist.

## Architecture

- **Entry:** [src/app.js](src/app.js) loads zmp-framework, global CSS (zmp bundle → `app.scss` → Tailwind → `zaui.css` → `FixZmp-framework.css` → `dialog.scss`; order matters for overrides), and wraps `App` in zmp-ui's `SnackbarProvider`.
- **Shell / tabs:** [src/components/app.jsx](src/components/app.jsx) handles Zalo login and the exit-confirm dialog, and declares one `<View>` per bottom tab (`view-main` `/`, `view-search` `/khuyenMaiList/`, `view-giohang` `/giohang/`, `view-menu` `/home_ListDH/`, `/khachhang/`, `view-account` `/taikhoan/`). Each tab has its own router history.
- **Pages / routing:** each file in `src/pages/` is a route. A new page must also be listed in `pages` in [app-config.json](app-config.json). [src/routes.js](src/routes.js) is only a partial legacy list.
- **Navigation gotcha:** the zmp router refuses to navigate during an animation. Do not chain `back` + `navigate` calls. Use helpers like `goToCartTab` in [src/utils/navigation.js](src/utils/navigation.js), which does a single forced back and then `zmp.tab.show(...)`.
- **State:** a single global store in [src/store.js](src/store.js) (`createStore` from zmp-core). Read through `store.getters.X.value`, write through `store.dispatch("action", payload)`. It holds the customer (`CusInfo`: `KHACHHANG_fk`, `xu`, `diem`, …), the cart (`ListGiohang`), promotion/loyalty lists, and `dhDangSua` (the order being edited in the cart; `""` means a new order).
- **API:** all calls go to the GESO DMS backend. The base URL is **hard-coded** in [src/utils/networking.js](src/utils/networking.js) (production is `dms.rohto.com.vn:9113`; test and other-client URLs are commented out). `config.BASE_URL` from `.env` is mostly unused. Use `request(method, api, body, params)` (returns a `fetch` Response) or `getAPI` (resolves `{ data, error }`). Backend responses usually look like `{ result, message }`, where `message` is a **JSON string** that must be `JSON.parse`d (see `parseList` in [src/services/rewardService.js](src/services/rewardService.js)).
- **Services:** [src/services/](src/services/) has the domain API wrappers (`services.js` general/customer/promotions, `cartService.js` promotion application, `rewardService.js` loyalty/rewards on orders, `posmService.js` POSM + reward slips, `zalo.js` Zalo SDK). Business rules for the cart and promotions live in `src/utils/` (`cartHelper.js`, `kmRules.js`, `promoTime.js`) and hooks (`useCart.js`, `useCartRewards.js`).
- **Zalo SDK:** use `zmp-sdk/apis` (login, access token, phone number, follow OA, camera). zmp-ui is used for `useSnackbar` and some components alongside zmp-framework.
- **Path aliases** (vite + jsconfig): `@components`, `@pages`, `@static`, `@hooks`, `@utils`.

## UI conventions

[DESIGN.md](DESIGN.md) is the UI standard and must be followed for any screen work. Key points:
- Build screens from `@components/ui` (`Card`, `SectionTitle`, `PillTabs`, `StatusBadge`, `InfoRow`, `QtyStepper`, `Button`, `EmptyState`, `Grid`, `TextInput`) plus `AppHeader` from `@components/Header/AppHeader`. Match the already-standardized screens (POSM check, promotions, promotion detail, search, product detail).
- Colors come from Tailwind classes only: page `bg-slate-50`, accent `primary` (#005DAA), price/add-to-cart red `#e5232a`, and text `slate-700/600/500/400`. Do not use black text, `style={{ color }}` or `Color.*`. Avoid heavy gradients and shadows.
- zmp CSS traps: global `button { width: 100% }` (add `w-auto`); `.grid` is overridden in `giohang.scss` (use `<Grid>`, not Tailwind's `grid`); zmp adds input borders (use `<TextInput>`); fixed headers need `slot="fixed"` as a direct child of `<Page>`.

## Code style

Prettier: no semicolons, 2 spaces, `printWidth` 85, `arrowParens: always`. ESLint uses the react + prettier recommended configs. Code mixes `.jsx` and some `.tsx`.
