# Repository Overview

*🌐 Languages: **English** | [日本語](./README.ja.md)*

This repository is a **Turborepo monorepo** that manages a set of web applications for Four Pillars of Destiny (四柱推命) and Purple Star Astrology (紫微斗数).

> The horoscope (Western astrology) app and the astrology calculation API have been split into separate repositories. This repository contains two apps: `four-pillars` and `purple-star`.

## 📄 License

The original code in this repository (the Four Pillars / Purple Star calculation engines and their features) is released under the [MIT License](./LICENSE). However, some portions — such as the blog / CMS layer — are derived from the [Stablo template (Web3Templates)](https://web3templates.com) and are governed by the **Web3Templates license, not MIT**. See [NOTICE.md](./NOTICE.md) for details on the license boundary.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start all apps in development mode
npm run dev

# Or start an app individually
cd apps/four-pillars && npm run dev   # port 3001
cd apps/purple-star && npm run dev    # port 3002
```

## 📁 Overall Structure

```
eastern-astrology/
├── apps/                    # Applications (frontend + their own API routes)
│   ├── four-pillars/        # Four Pillars website (port 3001)
│   └── purple-star/         # Purple Star website (port 3002)
├── packages/                # Shared packages
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── ui/                  # Shared UI components
│   └── tsconfig/            # Shared TypeScript config
├── package.json             # Root dependency management (npm workspaces)
├── turbo.json               # Turborepo configuration
├── eslint.config.mjs        # ESLint config (Flat Config)
└── README.md
```

## 🏗️ Architecture Overview

Each app is a **self-contained Next.js app** that owns both its frontend pages and its own API routes (`app/api/`) responsible for calculations. Shared types, utilities, and UI live in `packages/`.

```
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  four-pillars (port 3001)    │   │  purple-star (port 3002)     │
│  ├─ app/(website)/  UI       │   │  ├─ app/(website)/  UI       │
│  ├─ app/api/        Calc API │   │  ├─ app/api/        Calc API │
│  └─ app/(sanity)/   Studio   │   │  └─ app/(sanity)/   Studio   │
│  ← Sanity CMS                │   │  ← Sanity CMS                │
└───────────────┬──────────────┘   └───────────────┬──────────────┘
                │                                   │
                └─────────────────┬─────────────────┘
                                  │ uses shared packages
                                  ▼
                    ┌───────────────────────────┐
                    │  packages/                │
                    │  - types  (type defs)     │
                    │  - utils  (utilities)     │
                    │  - ui     (UI components) │
                    └───────────────────────────┘
```

## 🏗️ Monorepo Setup

This project uses a **Turborepo** monorepo setup, which lets multiple apps and shared packages be managed efficiently together.

### Key Characteristics

- **Workspace management**: dependencies are centrally managed with npm workspaces
- **Build optimization**: parallel builds and caching via Turborepo
- **Type safety**: TypeScript across all projects
- **Code sharing**: shared type definitions, utilities, and UI components

### Dependency Flow

```
apps/four-pillars
  ├─ types (type definitions)
  ├─ utils (utilities)
  └─ ui    (UI components)

apps/purple-star
  ├─ types (type definitions)
  ├─ utils (utilities)
  └─ ui    (UI components)
```

## 📱 Applications (apps/)

### 1. `four-pillars` — Four Pillars of Destiny website

**Port**: 3001
**Tech stack**: Next.js (App Router), Sanity CMS, Tailwind CSS
**Directory**: `apps/four-pillars/`

A website that performs Four Pillars of Destiny (Chinese astrology) calculations and manages content. Calculation API routes are built in.

**Main features**:

- Calculation and display of Four Pillars charts (heavenly stems / earthly branches, decade luck, yearly luck, etc.)
- Blog (Sanity CMS)
- Calendar
- Chart image generation
- Quiz

**API (`app/api/`)**:

- `app/api/chart/` — Four Pillars chart calculation
- `app/api/calendar/` — calendar
- `app/api/image/` — chart image generation
- `app/api/timezone/`, `app/api/geocode/` — timezone / geocoding

**Details**:

- Sanity Studio integration (accessible at `/studio`, launched with `npm run sanity`) — `app/(sanity)/studio/`
- Rate limiting (Upstash Redis) — `app/api/chart/route.ts`
- Types: uses `packages/types` (`four-pillars/` subtree)
- Utilities: uses `packages/utils`
- UI components: uses `packages/ui`

**Important directories**:

- `app/(website)/chart/` — chart display page
- `app/(website)/blog/`, `post/`, `category/` — blog-related
- `app/(sanity)/studio/` — Sanity Studio config
- `lib/sanity/` — Sanity client config

### 2. `purple-star` — Purple Star Astrology website

**Port**: 3002
**Tech stack**: Next.js (App Router), Sanity CMS, Tailwind CSS
**Directory**: `apps/purple-star/`

A website for Purple Star Astrology (a form of Chinese astrology). It follows the same structure as `four-pillars`, with built-in calculation API routes.

**Main features**:

- Calculation and display of the Purple Star chart (board)
- Blog (Sanity CMS)
- Content management

**API (`app/api/`)**:

- `app/api/board/` — board calculation
- `app/api/months/` — monthly luck
- `app/api/timezone/` — timezone

**Details**:

- Same structure as `four-pillars`
- Sanity Studio integration (accessible at `/studio`, launched with `npm run sanity`)
- Rate limiting (Upstash Redis) — `app/api/board/route.ts`
- Types: uses `packages/types` (`purple-star/` subtree)
- Utilities: uses `packages/utils`
- UI components: uses `packages/ui`

## 📦 Shared Packages (packages/)

### 1. `types` — Type definitions

**Directory**: `packages/types/`
Shared TypeScript type definitions used across all apps. The entry point is `packages/types/index.ts` (which re-exports each `src/*`).

**Main type definitions**:

- `src/four-pillars/` — Four Pillars types
  - `HeavenlyStem.ts` — heavenly stem types
  - `EarthlyBranch.ts` — earthly branch types
  - `types.ts` — main Four Pillars types
  - `constants.ts` — constants
- `src/purple-star/` — Purple Star types
  - `types.ts` — main Purple Star types
  - `constants.ts` — constants
- `src/PersonalInfo.ts` — personal info types (birth date, location, etc.)
- `src/types.ts` — shared types
- `src/constants.ts` — shared constants

**Usage**:

```typescript
import { PersonalInfo, HEAVENLY_STEMS, EARTHLY_BRANCHES } from 'types';
```

### 2. `utils` — Utility functions

**Directory**: `packages/utils/`
Shared utility functions used across all apps. The entry point is `packages/utils/index.ts`.

**Main modules**:

- `src/astro.ts` — astronomical calculations (ecliptic longitude, equation of time, etc.; uses `astronomia`)
- `src/calendar.ts` — calendar / lunar-calendar processing
- `src/time.ts` — time / timezone processing (age calculation, DST detection, etc.)
- `src/number.ts` — numeric processing (range generation, rounding, DMS conversion, etc.)
- `src/array.ts` — array operations (cyclic access, pair generation, etc.)
- `src/validate.ts` — request validation (for four-pillars / purple-star)

**Usage**:

```typescript
import { range, roundDecimal, getItemsFromArrayCycle } from 'utils';
```

### 3. `ui` — UI components

**Directory**: `packages/ui/`
A shared UI component library used by `four-pillars` and `purple-star`. The entry point is `packages/ui/index.tsx`.

**Main components**:

- `Breadcrumbs.tsx` — breadcrumbs
- `ErrorView.tsx` — error display component
- `TableOfContents.tsx` — table of contents component
- `icons/` — icon components
  - `StemIcon.tsx` — heavenly stem icon
  - `BranchIcon.tsx` — earthly branch icon
  - `ChevronDownIcon.tsx`, `LoadingIcon.tsx`, `SpinnerIcon.tsx` — generic icons

**Usage**:

```typescript
import { Breadcrumbs, ErrorView, StemIcon, BranchIcon } from 'ui';
```

### 4. `tsconfig` — TypeScript config

**Directory**: `packages/tsconfig/`
The base TypeScript configuration shared across the whole project.

## 🛠️ Development Commands

### Root level

```bash
# Start all apps in development mode
npm run dev

# Build all apps
npm run build

# Lint
npm run lint

# Test (unit / visual regression)
npm run test
npm run test:visual

# Format code
npm run format
```

### Individual apps

```bash
# Four Pillars app
cd apps/four-pillars
npm run dev      # start on port 3001
npm run sanity   # launch Sanity Studio

# Purple Star app
cd apps/purple-star
npm run dev      # start on port 3002
npm run sanity   # launch Sanity Studio
```

## 🔧 Tech Stack

### Frontend

- **Next.js 14+** — React framework (App Router)
- **React 18** — UI library
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first CSS
- **HeroUI** — UI components

### Backend (each app's API routes)

- **Next.js API Routes** — API endpoints built into each app
- **astronomia** — astronomical calculations (`packages/utils/src/astro.ts`)
- **Upstash Redis** — rate limiting

### CMS

- **Sanity** — headless CMS (four-pillars, purple-star)

### Other

- **Turborepo** — monorepo management
- **Luxon / date-fns** — date/time handling

## 📊 Data Flow

### Calculation flow

1. The **frontend** (`app/(website)/`) receives user input
2. It sends a request to the **API route** (`app/api/`) in the same app
3. The API route runs the Four Pillars / Purple Star calculation
4. The result is returned as JSON
5. The frontend displays the result

### Rate limiting

Each app's API routes limit request volume using **Upstash Redis**.

- four-pillars: `apps/four-pillars/app/api/chart/route.ts`
- purple-star: `apps/purple-star/app/api/board/route.ts`

## 🔐 Environment Variables

Key environment variables (see `turbo.json` for the complete list):

- `NEXT_PUBLIC_ROUTE_HANDLER_URL` — base URL for API routes
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `GOOGLE_TIMEZONE_API_KEY` — Google Maps / Timezone
- `MAPBOX_GEOCODING_API_KEY` — Mapbox geocoding
- `IMAGE_SERVICE_URL` / `SERVICE_SHARED_SECRET` — chart image generation (for the proxy to the private image-generation service)

## 📝 Development Notes

### Port numbers

Each app runs on a different port:

- **four-pillars**: 3001
- **purple-star**: 3002

### Dependency management

1. **Install**: running `npm install` at the root installs dependencies for all workspaces
2. **Changing shared packages**: after editing files under `packages/`, restart the apps that depend on them
3. **Changing type definitions**: changes to `packages/types` are reflected in type checking immediately, though a build may be required in some cases

### Sanity configuration

`four-pillars` and `purple-star` use Sanity CMS. You can review the configuration in `sanity.config.ts`.

> **Note**: The seed data referenced by each app's `npm run sanity-import` (`lib/sanity/data/production.tar.gz`) is **not** included in this repository, for size and distribution reasons. If you need a seed, generate one from your own Sanity dataset with `npm run sanity-export`.

### Development workflow

1. **Adding a new feature**
   - Add shared functionality to `packages/`
   - Add app-specific functionality to each `apps/`
2. **Adding type definitions**
   - Define app-specific types within each app
   - Add types used by multiple apps to `packages/types`
3. **Build and test**
   - Running `npm run build` at the root builds all apps

## 🚀 Deployment

Each app can be deployed independently, e.g. individually on platforms such as Vercel. Using Turborepo's remote caching can shorten build times in CI/CD pipelines.

## 👋 Guide for New Developers

### What to understand first

1. **Monorepo structure**: multiple apps and shared packages are managed in a single repository
2. **Turborepo**: a tool that optimizes build and task execution
3. **npm workspaces**: a mechanism for centrally managing dependencies

### Getting started

1. **Clone and set up the repository**

   ```bash
   git clone <repository-url>
   cd eastern-astrology
   npm install
   ```

2. **Configure environment variables**
   - Create a `.env.local` file in each app's directory
   - See `turbo.json` for the required environment variables

3. **Start the development server**

   ```bash
   # Start all apps
   npm run dev

   # Or start one individually
   cd apps/four-pillars && npm run dev
   ```

4. **Explore the code**
   - First, review the type definitions in `packages/types`
   - Next, review the calculation logic in each app's `app/api/`
   - Finally, review the frontend in `app/(website)/`

### FAQ

**Q: What happens when I change a shared package?**
A: Changes are reflected immediately, but if TypeScript type errors appear, a rebuild may be required.

**Q: How do I add a new app?**
A: Create a new Next.js app under the `apps/` directory and add it to the `workspaces` field in the root `package.json`.

## 📚 Related Documentation

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
