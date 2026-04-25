# CryptoSight — Advanced Market Intelligence Dashboard

A production-ready, high-performance cryptocurrency market dashboard built with React 18, TypeScript, Tailwind CSS v4, and Vite. Designed with an emphasis on **Atomic Design**, **Performance**, and **Mobile Responsiveness**.

![CryptoSight Dashboard](./public/preview.png)

---

## 🌟 Key Features

- **Real-Time Market Data**: Live tracking of cryptocurrency prices, market caps, and volumes.
- **Detailed Asset Views**: Full-page dedicated routes for individual coins showing historical price charts, market statistics, supply metrics, and developer data.
- **Advanced Data Visualization**: Interactive, responsive charts for visualizing market trends over various timeframes (24h, 7d, 30d, 1y).
- **Global Market Overview**: At-a-glance metrics for total market cap, 24h volume, BTC dominance, and active cryptocurrencies.
- **Top Gainers & Trending**: Dedicated panels for discovering trending assets and top market performers.
- **Smart Search & Filtering**: Debounced, intelligent search functionality to quickly find specific assets.
- **Dark/Light Mode**: First-class theme support with smooth transitions, persisting user preference.
- **Watchlist Persistence**: Save favorite coins to a local watchlist using Zustand's persist middleware.
- **Mobile First**: Highly optimized layouts ensuring a native-like feel across all device sizes.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | React 18 | Functional components with Hooks |
| **Language** | TypeScript | Strict mode enabled for end-to-end type safety |
| **Routing** | React Router v7 | Client-side routing with lazy-loaded routes |
| **Data Fetching** | React Query v5 | Advanced caching, automatic background refetching, and stale-time management |
| **State Management**| Zustand v5 | Lightweight, unopinionated client state management (Watchlist, Theme) |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework with custom design tokens |
| **Build Tool** | Vite | Ultra-fast development server and optimized production builds |
| **Icons** | Lucide React | Clean, scalable vector icons |

---

## 🏗 Architecture Decisions

### 1. Atomic Design System
The UI component architecture strictly follows the **Atomic Design** methodology to ensure maximum reusability and scalability:
- **Atoms (`src/components/atoms`)**: Basic building blocks (Buttons, Badges, Skeletons, Inputs).
- **Molecules (`src/components/molecules`)**: Simple combinations of atoms (Search Bars, Stat Cards).
- **Organisms (`src/components/organisms`)**: Complex UI sections (Market Tables, Navigation Headers, Charts).
- **Templates (`src/components/templates`)**: Page-level layout structures (Dashboard Layout, Coin Detail Layout).

### 2. Data Fetching Strategy: React Query
Instead of native `fetch` or `useEffect` polling, we leverage **@tanstack/react-query**:
- **Caching & Stale Time**: Prevents redundant API calls by caching responses (30s stale time).
- **Window Focus Refetching**: Automatically updates stale data when the user returns to the tab.
- **Retry Logic**: Built-in fault tolerance for network fluctuations.
- **Optimized UI States**: Seamlessly exposes `isLoading`, `isError`, and `isFetching` states to drive skeleton loaders and refresh indicators.

### 3. State Management: Zustand
Zustand is used for global client state (e.g., Theme preference, Watchlist).
- **Zero Boilerplate**: No providers needed.
- **Persistence**: Built-in middleware securely syncs the user's watchlist to `localStorage`.

### 4. Performance Optimizations
- **Code Splitting**: Routes (like `CoinDetailPage`) are `lazy()` loaded to minimize the initial JS bundle size.
- **Zero Cumulative Layout Shift (CLS)**: Skeleton loaders precisely match the dimensions of the final loaded content.
- **Asset Compression**: Vite is configured with `vite-plugin-compression` to serve Gzip/Brotli assets in production.
- **Render Optimization**: Heavy components like data tables and charts utilize `React.memo` and localized state to prevent unnecessary re-renders.

---

## 🚀 Setup & Running Locally

### 1. Clone the repository
```bash
git clone <your-repo-url> crypto-dashboard
cd crypto-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
*(The default public CoinGecko API endpoint works without an API key, subject to rate limits).*

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Scripts

- `npm run dev` — Starts the Vite development server.
- `npm run build` — Compiles TypeScript and creates an optimized production build.
- `npm run preview` — Locally previews the production build.
- `npm run lint` — Runs ESLint for code quality checks.

---

## 🔌 API Integration

Powered by the [CoinGecko Public API v3](https://www.coingecko.com/en/api/documentation).

**Primary Endpoints Used:**
- `GET /coins/markets` (Dashboard asset lists)
- `GET /coins/{id}` (Asset details & developer data)
- `GET /coins/{id}/market_chart` (Historical price data for visualizations)
- `GET /global` (Global market metrics)
- `GET /search/trending` (Trending assets)
