# purple-star — Application Guide

*🌐 Languages: **English** | [日本語](./README.ja.md)*

This document explains the structure of the `purple-star` application for developers seeing it for the first time.

## 📋 Overview

`purple-star` is a web application that calculates and displays the chart (board) of Purple Star Astrology (紫微斗数, a form of Chinese astrology). When a user enters their birth date, time, and place, it displays a detailed Purple Star chart.

**Tech stack**:

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sanity CMS** (blog)
- **React Hook Form** (form management)
- **Upstash Redis** (rate limiting)

**Port**: 3002

## 📁 Directory Structure

```
apps/purple-star/
├── app/                          # Next.js App Router
│   ├── (sanity)/                 # Route group for Sanity Studio
│   │   └── studio/               # Sanity Studio UI
│   ├── (website)/                # Route group for the public site
│   │   ├── board/                # Board creation page (main feature)
│   │   ├── b/                    # Board result page (URL-parameter version)
│   │   ├── blog/                 # Blog list
│   │   ├── post/                 # Blog post detail
│   │   ├── list/                 # Saved boards list
│   │   └── ...                   # Other pages
│   ├── api/                      # API Routes
│   │   ├── board/                # Board calculation API
│   │   ├── months/               # Monthly luck calculation API
│   │   ├── timezone/             # Timezone API
│   │   ├── PurpleStarData.ts     # Board calculation class
│   │   ├── PurpleStarPersonalInfo.ts  # Personal info class
│   │   ├── Palace.ts             # Palace class
│   │   └── constants.ts          # Constants
│   ├── layout.tsx                # Root layout
│   └── types.ts                  # App-specific type definitions
├── components/                   # Shared components
│   ├── blog/                     # Blog-related components
│   └── ui/                       # UI components
├── context/                      # React Context
│   └── boardContext.tsx          # Board state management
├── lib/                          # Libraries / utilities
│   └── sanity/                   # Sanity CMS config
├── public/                       # Static files
├── styles/                       # Global styles
└── utils/                        # Utility functions
```

## 🎯 Main Features

### 1. Board creation (calculation)

**Path**: `/board`

The main feature that calculates and displays a Purple Star board.

#### Frontend (`app/(website)/board/`)

- **`page.tsx`**: page component (Server Component)
- **`Board.tsx`**: main board component (Client Component)
  - form input management
  - API calls
  - result display control
- **`ResultView.tsx`**: results container
- **`ResultBoard.tsx`**: board visualization (12 palaces)
- **`PalaceView.tsx`**: detailed display of each palace
- **`PalaceDetail.tsx`**: palace detail info
- **`CentralView.tsx`**: central-area display
- **`Datetime.tsx`**: date/time input component
- **`BirthPlace.tsx`**: birthplace input component
- **`Gender.tsx`**: gender selection component
- **`SchoolSelect.tsx`**: school (tradition) selection component
- **`AdvancedSettings.tsx`**: advanced settings

#### Backend (`app/api/board/route.ts`)

```typescript
POST /api/board
```

**Processing flow**:

1. Request validation
2. Rate-limit check (Upstash Redis)
3. Initialize personal info with `PurpleStarPersonalInfo`
4. Calculate the board with `PurpleStarData`
5. Return the result as JSON

**Rate limit**: 10 requests / 10 seconds (per IP address)

### 2. Purple Star calculation details

#### `PurpleStarPersonalInfo` (`app/api/PurpleStarPersonalInfo.ts`)

A class that manages personal info and date/time adjustments.

**Main processing**:

- Local time difference calculation
- Equation of time retrieval
- Adjusted date/time calculation
- Solar ecliptic longitude retrieval
- Conversion to the Chinese (lunar) calendar
- Leap-month handling

#### `PurpleStarData` (`app/api/PurpleStarData.ts`)

The main class that calculates the Purple Star board.

**Main processing**:

1. **Chinese calendar retrieval**: convert the Gregorian date to the Chinese calendar (sexagenary year/month/day)
2. **Life Palace determination**: determine the Life Palace from birth month and hour
3. **Body Palace determination**: determine the Body Palace from birth month and hour
4. **Five-Element bureau determination**: determine the bureau (Water-2, Wood-3, etc.) from the year stem and the Life Palace
5. **Zi Wei star placement**: determine the position of the Zi Wei star from the day and the bureau
6. **Major star placement**: place the 14 major stars (Zi Wei, Tian Ji, Tai Yang, Wu Qu, Tian Tong, Lian Zhen, Tian Fu, Tai Yin, Tan Lang, Ju Men, Tian Xiang, Tian Liang, Qi Sha, Po Jun)
7. **Hour-based star placement**: place hour-based stars (Wen Chang, Wen Qu, Tian Kong, Di Jie, etc.)
8. **Month-based star placement**: place month-based stars (Zuo Fu, You Bi, Tian Xing, Tian Yao, etc.)
9. **Year-stem-based star placement**: place year-stem-based stars (Lu Cun, Qing Yang, Tuo Luo, etc.)
10. **Year-branch-based star placement**: place year-branch-based stars (Tian Ma, Hong Luan, Tian Xi, etc.)
11. **Four Transformations placement**: place Hua Lu, Hua Quan, Hua Ke, Hua Ji
12. **Palace creation**: create the 12 palaces (Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Fortune, Parents)
13. **Major limit calculation**: fortune in 10-year cycles (major limits)
14. **Yearly luck calculation**: fortune per year

#### `Palace` (`app/api/Palace.ts`)

A class representing one of the 12 palaces.

**Main properties**:

- `name`: palace name (Life Palace, Siblings Palace, etc.)
- `stem`: heavenly stem
- `branch`: earthly branch
- `majorStars`: array of major stars
- `minorStars`: array of minor stars
- `starPower`: star power (sum of major and minor star strengths)
- `yearlyLucks`: array of yearly luck

### 3. Blog

A blog powered by Sanity CMS.

**Main pages**:

- `/blog`: blog list
- `/post/[slug]`: post detail
- `/category/[category]`: list by category
- `/author/[author]`: list by author

**Sanity Studio**: accessible at `/studio`

### 4. Saved boards list

**Path**: `/list`

Displays the list of boards saved in LocalStorage.

### 5. Monthly / periodic luck display

**Components**:

- `MonthlyLucks.tsx`: monthly luck display
- `PeriodicLucks.tsx`: periodic luck display

## 🔄 Data Flow

### Board calculation flow

```
1. User input (Board.tsx)
   ↓
2. Form validation (React Hook Form)
   ↓
3. Send API request (POST /api/board)
   ↓
4. Server-side processing
   ├─ Request validation
   ├─ Rate-limit check
   ├─ PurpleStarPersonalInfo.init()
   │  ├─ Local time difference
   │  ├─ Equation of time
   │  ├─ Adjusted date/time
   │  └─ Chinese calendar conversion
   └─ PurpleStarData.init()
      ├─ Life/Body Palace determination
      ├─ Five-Element bureau determination
      ├─ Zi Wei star placement
      ├─ Major star placement
      ├─ Hour/month/year-stem/year-branch star placement
      ├─ Four Transformations placement
      ├─ 12 palaces creation
      └─ Major limit / yearly luck calculation
   ↓
5. Return JSON response
   ↓
6. Display results (ResultView.tsx)
   ├─ Board display (ResultBoard.tsx)
   │  ├─ 12 palaces display (PalaceView.tsx)
   │  ├─ Star placement display
   │  └─ Central area (CentralView.tsx)
   ├─ Detail display (ResultInfo.tsx)
   └─ Monthly/periodic luck display (MonthlyLucks.tsx, PeriodicLucks.tsx)
```

## 🧩 Main Components

### Board-related

- **`Board.tsx`**: main form component
  - form management with React Hook Form
  - API calls and error handling
  - result display control

- **`ResultView.tsx`**: results container
  - integrates multiple result components

- **`ResultBoard.tsx`**: board visualization
  - 12-palace grid display
  - star placement display for each palace
  - diagonal / triangle lines (DiagonalLine.tsx, TriangleLine.tsx)

- **`PalaceView.tsx`**: display of each palace
  - palace name, heavenly stem, earthly branch
  - major and minor stars
  - star strength / brightness

- **`PalaceDetail.tsx`**: palace detail info
  - star details
  - major-limit / yearly-luck info

- **`CentralView.tsx`**: central-area display
  - Life / Body Palace info
  - Five-Element bureau info

- **`ResultInfo.tsx`**: detailed info display
  - birth date/time info
  - timezone info
  - Chinese calendar info

- **`MonthlyLucks.tsx`**: monthly luck display
- **`PeriodicLucks.tsx`**: periodic luck display

### Input components

- **`Datetime.tsx`**: date/time input
- **`BirthPlace.tsx`**: birthplace input (uses Google Maps Autocomplete)
- **`Gender.tsx`**: gender selection
- **`SchoolSelect.tsx`**: school selection (San He, Fei Xing, etc.)
- **`AdvancedSettings.tsx`**: advanced settings (includes `SchoolSelect` for school selection)

### Shared components

- **`components/navbar.js`**: navigation bar
- **`components/footer.js`**: footer
- **`components/sidebar.js`**: sidebar (for blog)

## 🔌 API Endpoints

### `/api/board` (POST)

The main board-calculation API.

**Request body**:

```typescript
{
  isoDate: string; // ISO date/time
  longitude: number; // longitude
  latitude: number; // latitude
  timezoneOffset: number; // timezone offset
  gender: Gender; // gender
  languageCode: string; // language code
  utcOffset: number; // UTC offset
  dstOffset: number; // daylight saving offset
  school: string; // school (San He, Fei Xing, etc.)
  useSpaceMethod: boolean; // whether to use spatial division
}
```

**Response**:

```typescript
{
  status: 200;
  // All properties of PurpleStarData
  palaces: Palace[];
  division: string;
  selfPalacePosition: number;
  bodyPalace: PalaceName;
  // ... etc.
}
```

### `/api/months` (POST)

Monthly luck calculation API.

### `/api/timezone/google` (POST)

Timezone API using the Google Timezone API.

## 🎨 State Management

### React Context

**`context/boardContext.tsx`**:

- `isFormView`: form-view flag
- `isJapanese`: Japanese-display flag
- `currentMonth`: currently selected month
- `currentPalace`: currently selected palace
- `showChildStar`: minor-star display flag
- `showSelfChildStar`: self-palace minor-star display flag
- `showDiagonalChildStar`: diagonal minor-star display flag
- `showMainChildStar`: major-star minor-star display flag

### LocalStorage

Saved boards are stored in LocalStorage and listed on the `/list` page.

## 🔐 Security

### Rate limiting

Rate limiting is implemented using Upstash Redis.

- 10 requests / 10 seconds (sliding window)
- per IP address

### Validation

Requests are validated with the `validatePurpleStarRequest` function from the `utils` package.

## 🛠️ Development Commands

```bash
# Start dev server (port 3002)
pnpm run dev

# Build
pnpm run build

# Start production server
pnpm run start

# Launch Sanity Studio
pnpm run sanity

# Import Sanity data
pnpm run sanity-import

# Export Sanity data
pnpm run sanity-export

# Bundle size analysis
pnpm run analyze

# Lint
pnpm run lint
```

> **Note:** The Sanity dataset seed (`lib/sanity/data/production.tar.gz`) is **not** included in this repository. If you use `pnpm run sanity-import`, generate an export from your own Sanity project with `pnpm run sanity-export`.

## 📦 Dependencies

### Main packages

- **Next.js**: web framework
- **React Hook Form**: form management
- **Tailwind CSS**: styling
- **@heroui/react**: UI components
- **next-sanity**: Sanity CMS integration
- **@upstash/ratelimit**: rate limiting
- **@upstash/redis**: Redis connection
- **date-chinese**: Chinese calendar conversion
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

- `PurpleStarData`: board data type
- `PurpleStarSubmitData`: form submission data type
- `PurpleStarUrlData`: URL parameter type

### `packages/types`

Used from the shared type-definition package:

- `Palace`: palace type
- `PalaceName`: palace name type
- `Star`: star type
- `Gender`: gender
- `ChineseDate`: Chinese calendar type
- and other Purple Star types

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

## 📚 Reference

### Purple Star concepts

- **Board (命盤)**: a chart with stars placed across 12 palaces
- **12 palaces**: Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Fortune, Parents
- **14 major stars**: Zi Wei, Tian Ji, Tai Yang, Wu Qu, Tian Tong, Lian Zhen, Tian Fu, Tai Yin, Tan Lang, Ju Men, Tian Xiang, Tian Liang, Qi Sha, Po Jun
- **Minor stars**: stars other than the major stars (Wen Chang, Wen Qu, Zuo Fu, You Bi, etc.)
- **Four Transformations**: Hua Lu, Hua Quan, Hua Ke, Hua Ji
- **Five-Element bureau (五号局)**: Water-2, Wood-3, Metal-4, Earth-5, Fire-6
- **Major limit (大限)**: fortune in 10-year cycles
- **Yearly luck**: fortune per year
- **Life Palace (命宮)**: the palace at the time of birth
- **Body Palace (身宮)**: the palace representing acquired character

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
4. **Chinese calendar conversion error**: errors can occur when handling leap months

### Debugging

- In development you can inspect the calculation steps via console logs
- Bundle size analysis: `pnpm run analyze`

## 🔄 Future Enhancements

- Comparison of multiple boards
- PDF export of a board
- More detailed fortune analysis
- Additional per-school calculation methods
- Expanded multilingual support

## 🔍 Differences from four-pillars

`purple-star` and `four-pillars` share a similar structure, but differ in the following ways:

1. **Astrology system**: Purple Star Astrology vs Four Pillars of Destiny
2. **Calculation method**: board (12 palaces) vs chart (four pillars)
3. **Star concept**: Purple Star places stars, while Four Pillars uses heavenly stems and earthly branches
4. **Schools**: Purple Star lets you choose a school (San He, Fei Xing, etc.)
5. **Display**: 12-palace grid vs vertical four-pillar layout
