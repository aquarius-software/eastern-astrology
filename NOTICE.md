# NOTICE

This repository contains code under **two different licenses**. Please read
this notice before using, copying, or redistributing any part of it.

---

## 1. Original application code — MIT License

Copyright (c) 2026 Aquarius Software

The original application code in this repository — principally the
**Four Pillars of Destiny (四柱推命)** and **Purple Star Astrology (紫微斗数)**
calculation engines and the surrounding domain logic and features — is licensed
under the **MIT License**. See [`LICENSE`](./LICENSE) at the repository root.

This includes, but is not limited to:

- **Astrology calculation logic, domain types and utilities**, e.g.:
  - `apps/four-pillars/app/api/FourPillarsData.ts`, `FourPillarsPersonalInfo.ts`,
    `luck.ts`, `pillars.ts`
  - `apps/purple-star/app/api/PurpleStarData.ts` and related files
  - `packages/types` (Four Pillars / Purple Star domain types)
  - `packages/utils` (astrology calculations)
- **Application features built on top of that logic**, e.g.:
  - the chart, calendar, quiz, and saved-list features
    (`apps/*/app/(website)/{chart,c,calendar,quiz,list}`)
  - the image-generation proxy (`apps/four-pillars/app/api/image`)
  - geocode / timezone integrations
- **Shared original packages and configuration**, e.g.:
  - `packages/ui` (shared UI components)
  - `packages/tsconfig` (shared TypeScript configuration)

---

## 2. Stablo template code — Web3Templates License (NOT MIT)

Portions of this repository are derived from the **"Stablo" template by
Web3Templates** (https://web3templates.com). These portions are governed by the
**Web3Templates license, NOT by the MIT License**, and are used here with
permission as part of a larger original application.

See [`apps/four-pillars/LICENSE.md`](./apps/four-pillars/LICENSE.md) and
[`apps/purple-star/LICENSE.md`](./apps/purple-star/LICENSE.md) for the
applicable Web3Templates license terms.

The Stablo-derived portions include, but are not limited to, the blog / CMS
presentation layer and related scaffolding, e.g.:

- **Blog and CMS UI components** — `apps/*/components`
  (e.g. `navbar`, `navbaralt`, `footer`, `sidebar`, `postlist`, `postalt`,
  `container`, theme switchers, `ogimage`, `blog/*`)
- **Sanity CMS integration and Studio** — `apps/*/lib/sanity`, the Sanity Studio route
- **Blog-related routes** —
  `apps/*/app/(website)/{blog,post,[slug],category,author,search,contact}`

These portions may **not** be redistributed separately from this application,
and may **not** be used to create a competing template, theme, or starter kit.
If the origin of a particular file is unclear, any portion derived from the
Stablo template remains governed by the Web3Templates license regardless of its
location in this repository.

---

## 3. Third-party dependencies

Third-party libraries referenced in the various `package.json` files are the
property of their respective owners and are governed by their own licenses.

---

Questions about the Web3Templates license: hello@web3templates.com
