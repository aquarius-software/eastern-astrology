# four-pillars — Application Guide

*🌐 Languages: **English** | [日本語](./README.ja.md)*

This document explains the structure of the `four-pillars` application for developers seeing it for the first time.

## 📋 Overview

`four-pillars` is a web application that calculates and displays a Four Pillars of Destiny (四柱推命, Chinese astrology) chart. When a user enters their birth date, time, and place, it displays a detailed Four Pillars analysis.

**Tech stack**:
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sanity CMS** (blog)
- **React Hook Form** (form management)
- **Upstash Redis** (rate limiting)

**Port**: 3001

## 📁 Directory Structure

```
apps/four-pillars/
├── app/                          # Next.js App Router
│   ├── (sanity)/                 # Route group for Sanity Studio
│   │   └── studio/               # Sanity Studio UI
│   ├── (website)/                # Route group for the public site
│   │   ├── chart/                # Chart creation page (main feature)
│   │   ├── blog/                 # Blog list
│   │   ├── post/                 # Blog post detail
│   │   ├── calendar/             # Calendar feature
│   │   ├── list/                 # Saved charts list
│   │   ├── quiz/                 # Quiz feature
│   │   └── ...                   # Other pages
│   ├── api/                      # API Routes
│   │   ├── chart/                # Chart calculation API
│   │   ├── calendar/             # Calendar API
│   │   ├── geocode/              # Geocoding API
│   │   ├── timezone/             # Timezone API
│   │   └── image/                # Image generation API (proxy to a private image service)
│   ├── layout.tsx                # Root layout
│   └── types.ts                  # App-specific type definitions
├── components/                   # Shared components
│   ├── blog/                     # Blog-related components
│   └── ui/                       # UI components
├── context/                      # React Context
│   └── chartContext.tsx          # Chart state management
├── lib/                          # Libraries / utilities
│   └── sanity/                   # Sanity CMS config
├── public/                       # Static files
├── styles/                       # Global styles
└── utils/                        # Utility functions
```

## 🎯 Main Features

### 1. Chart creation (calculation)

**Path**: `/chart`

The main feature that calculates and displays a Four Pillars chart.

#### Frontend (`app/(website)/chart/`)

- **`page.tsx`**: page component (Server Component)
- **`Chart.tsx`**: main chart component (Client Component)
  - form input management
  - API calls
  - result display control
- **`ResultView.tsx`**: displays the calculation results
- **`ResultChart.tsx`**: visualizes the chart
- **`Datetime.tsx`**: date/time input component
- **`BirthPlace.tsx`**: birthplace input component
- **`Gender.tsx`**: gender selection component
- **`AdvancedSettings.tsx`**: advanced settings (division method, day-stem change method, etc.)

#### Backend (`app/api/chart/route.ts`)

```typescript
POST /api/chart
```

**Processing flow**:
1. Request validation
2. Rate-limit check (Upstash Redis)
3. Initialize personal info with `FourPillarsPersonalInfo`
4. Calculate the chart with `FourPillarsData`
5. Return the result as JSON

**Rate limit**: 10 requests / 10 seconds (per IP address)

### 2. Four Pillars calculation details

#### `FourPillarsPersonalInfo` (`app/api/FourPillarsPersonalInfo.ts`)

A class that manages personal info and date/time adjustments.

**Main processing**:
- Local time difference calculation
- Equation of time retrieval
- Adjusted date/time calculation
- Solar ecliptic longitude retrieval
- Determination of the 24 solar terms
- Determination of the "doyō" periods

#### `FourPillarsData` (`app/api/FourPillarsData.ts`)

The main class that calculates the Four Pillars chart.

**Main processing**:
1. **Pillar generation**: calculate the year, month, day, and hour pillars
2. **Stem/branch extraction**: obtain the heavenly stems (10) and earthly branches (12)
3. **Stem combination calculation**: combinations between heavenly stems
4. **Branch relationship calculation**:
   - Three Harmony (三合会局)
   - Directional Combination (方合)
   - Six Harmony (支合)
   - Clash (冲)
   - Destruction (破)
   - Harm (害)
   - Punishment (刑)
5. **Decade luck (大運) calculation**: fortune in 10-year cycles
6. **Yearly luck calculation**: fortune per year
7. **Five Elements composition**: balance of the Five Elements (Wood, Fire, Earth, Metal, Water)
8. **Temperature / humidity calculation**: seasonal indicators

### 3. Blog

A blog powered by Sanity CMS.

**Main pages**:
- `/blog`: blog list
- `/post/[slug]`: post detail
- `/category/[category]`: list by category
- `/author/[author]`: list by author

**Sanity Studio**: accessible at `/studio`

### 4. Calendar

**Path**: `/calendar`

Displays a Four Pillars calendar.

### 5. Saved charts list

**Path**: `/list`

Displays the list of charts saved in LocalStorage.

## 🔄 Data Flow

### Chart calculation flow

```
1. User input (Chart.tsx)
   ↓
2. Form validation (React Hook Form)
   ↓
3. Send API request (POST /api/chart)
   ↓
4. Server-side processing
   ├─ Request validation
   ├─ Rate-limit check
   ├─ FourPillarsPersonalInfo.init()
   │  ├─ Local time difference
   │  ├─ Equation of time
   │  ├─ Adjusted date/time
   │  └─ 24 solar terms
   └─ FourPillarsData.init()
      ├─ Pillar generation
      ├─ Stem/branch extraction
      ├─ Combination/harmony calculation
      ├─ Decade luck calculation
      └─ Five Elements composition
   ↓
5. Return JSON response
   ↓
6. Display results (ResultView.tsx)
   ├─ Chart display (ResultChart.tsx)
   ├─ Detail display (ResultInfo.tsx)
   └─ Decade/yearly luck display (DecadeLuck.tsx, YearlyLucks.tsx)
```

## 🧩 Main Components

### Chart-related

- **`Chart.tsx`**: main form component
  - form management with React Hook Form
  - API calls and error handling
  - result display control

- **`ResultView.tsx`**: results container
  - integrates multiple result components

- **`ResultChart.tsx`**: chart visualization
  - displays stems and branches
  - displays relationships such as combinations and harmonies

- **`ResultInfo.tsx`**: detailed info display
  - birth date/time info
  - timezone info
  - 24-solar-term info

- **`DecadeLuck.tsx`**: decade luck display
- **`YearlyLucks.tsx`**: yearly luck display

### Input components

- **`Datetime.tsx`**: date/time input
- **`BirthPlace.tsx`**: birthplace input (uses Google Maps Autocomplete)
- **`Gender.tsx`**: gender selection
- **`AdvancedSettings.tsx`**: advanced settings
  - division method (solar-term cut / spatial division)
  - day-stem change method
  - image-generation option

### Shared components

- **`components/navbar.js`**: navigation bar
- **`components/footer.js`**: footer
- **`components/sidebar.js`**: sidebar (for blog)

## 🔌 API Endpoints

### `/api/chart` (POST)

The main chart-calculation API.

**Request body**:
```typescript
{
  isoDate: string;           // ISO date/time
  longitude: number;          // longitude
  latitude: number;           // latitude
  timezoneOffset: number;     // timezone offset
  gender: Gender;             // gender
  languageCode: string;       // language code
  utcOffset: number;          // UTC offset
  dstOffset: number;          // daylight saving offset
  useSpaceMethod: boolean;    // whether to use spatial division
  createImage: boolean;       // whether to generate an image
  isHourUnknown: boolean;     // whether the birth hour is unknown
  changeDayStem: boolean;     // day-stem change method
  yearlyLucks?: boolean;      // whether to fetch yearly luck
  yearlyLuckStart?: number;   // yearly luck start year
  yearlyLuckEnd?: number;     // yearly luck end year
}
```

**Response**:
```typescript
{
  status: 200;
  // All properties of FourPillarsData
  heavenlyStems: HeavenlyStem[];
  earthlyBranches: EarthlyBranch[];
  decadeLucks: DecadeLuck[];
  // ... etc.
}
```

### `/api/calendar` (POST)

API that returns calendar information.

### `/api/geocode/mapbox` (POST)

Geocoding API using Mapbox.

### `/api/timezone/google` (POST)

Timezone API using the Google Timezone API.

### `/api/image` (POST)

Chart image-generation API. The actual image generation (prompt assembly and generation-model calls) is isolated in a private external service; this endpoint is a thin proxy that forwards the request with an authentication token.

## 🎨 State Management

### React Context

**`context/chartContext.tsx`**:
- `isFormView`: form-view flag
- `isJapanese`: Japanese-display flag

### LocalStorage

Saved charts are stored in LocalStorage and listed on the `/list` page.

## 🔐 Security

### Rate limiting

Rate limiting is implemented using Upstash Redis.
- 10 requests / 10 seconds (sliding window)
- per IP address

### Validation

Requests are validated with the `validateFourPillarsRequest` function from the `utils` package.

## 🛠️ Development Commands

```bash
# Start dev server (port 3001)
npm run dev

# Build
npm run build

# Start production server
npm run start

# Launch Sanity Studio
npm run sanity

# Import Sanity data
npm run sanity-import

# Export Sanity data
npm run sanity-export

# Bundle size analysis
npm run analyze

# Lint
npm run lint
```

> **Note:** The Sanity dataset seed (`lib/sanity/data/production.tar.gz`) is **not** included in this repository. If you use `npm run sanity-import`, generate an export from your own Sanity project with `npm run sanity-export`.

## 📦 Dependencies

### Main packages

- **Next.js**: web framework
- **React Hook Form**: form management
- **Tailwind CSS**: styling
- **@heroui/react**: UI components
- **next-sanity**: Sanity CMS integration
- **@upstash/ratelimit**: rate limiting
- **@upstash/redis**: Redis connection
- **types**: shared type-definition package
- **utils**: shared utility package

## 🔧 Configuration Files

### `next.config.js`

- image optimization settings
- ignore TypeScript/ESLint errors (production)
- bundle analyzer integration
- external package transpilation

### `sanity.config.ts`

Sanity Studio configuration:
- project ID / dataset
- plugin settings
- schema definitions

### `tailwind.config.js`

Tailwind CSS configuration:
- custom colors
- font settings
- plugin settings

## 📝 Type Definitions

### `app/types.ts`

App-specific type definitions:
- `FourPillarsData`: chart data type
- `SubmitData`: form submission data type
- `OptionData`: display option type
- `FourPillarsUrlData`: URL parameter type

### `packages/types`

Used from the shared type-definition package:
- `HeavenlyStem`: heavenly stem
- `EarthlyBranch`: earthly branch
- `Gender`: gender
- and other Four Pillars types

## 🚀 Deployment

Deployable on platforms such as Vercel.

**Required environment variables**:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset name
- `NEXT_PUBLIC_SANITY_API_VERSION`: Sanity API version
- `UPSTASH_REDIS_REST_URL`: Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis token
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key (address autocomplete)
- `GOOGLE_TIMEZONE_API_KEY`: Google Time Zone API key (server)
- `MAPBOX_GEOCODING_API_KEY`: Mapbox Geocoding API key (server)
- `IMAGE_SERVICE_URL`: base URL of the private image-generation service (server only)
- `SERVICE_SHARED_SECRET`: shared auth token for the image-generation service (server only)

## 📚 Reference

### Four Pillars concepts

- **Four Pillars**: the four pillars — year, month, day, and hour
- **Heavenly stems**: 甲・乙・丙・丁・戊・己・庚・辛・壬・癸 (10)
- **Earthly branches**: 子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥 (12)
- **Decade luck**: fortune in 10-year cycles
- **Yearly luck**: fortune per year
- **Stem combination (干合)**: combinations between heavenly stems
- **Branch harmony (支合)**: combinations between earthly branches

### Technical documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Common issues

1. **Rate-limit error**: sending more than 10 requests within 10 seconds returns a 429 error
2. **Timezone error**: accurate timezone information is required
3. **Geocoding error**: a Google Maps API key is required

### Debugging

- In development you can set `config.optimization.minimize` to `false` in `next.config.js`
- Bundle size analysis: `npm run analyze`

## 🔄 Future Enhancements

- Comparison of multiple charts
- PDF export of a chart
- More detailed fortune analysis
- Expanded multilingual support
