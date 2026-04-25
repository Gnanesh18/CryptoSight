<div align="center">

<img src="./public/favicon.svg" width="80" height="80" alt="CryptoSight Logo" />

<h1>CryptoSight</h1>

<h3>Real-Time Cryptocurrency Market Intelligence</h3>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

<p><strong>Track prices · Analyze trends · Build your watchlist</strong></p>

<br/>

<a href="https://crypto-sight-five.vercel.app/">
  <img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-Visit%20CryptoSight-6366f1?style=for-the-badge&logoColor=white" alt="Live Demo" height="48" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/Gnanesh18/CryptoSight/issues">
  <img src="https://img.shields.io/badge/🐛%20Report%20Bug-GitHub%20Issues-ef4444?style=for-the-badge" alt="Report a Bug" height="48" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/Gnanesh18/CryptoSight/issues">
  <img src="https://img.shields.io/badge/✨%20Request%20Feature-GitHub%20Issues-22c55e?style=for-the-badge" alt="Request a Feature" height="48" />
</a>

<br/><br/>

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/f28758b9-8931-47d8-a8b9-31a15e0e2e4b" alt="Dashboard View" width="100%" />
      <br/><sub><b>Dashboard — Market Overview</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/5dc073c9-6c34-4993-8e3b-bdb13d6ab543" alt="Chart View" width="100%" />
      <br/><sub><b>Interactive Price Charts</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/b553c5e6-879c-455f-8989-90105c91c9c3" alt="Coin Detail" width="100%" />
      <br/><sub><b>Coin Detail Page</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/f8542353-f5d5-4bb3-b866-62a042dde013" alt="Watchlist" width="100%" />
      <br/><sub><b>Watchlist & Trending</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="https://github.com/user-attachments/assets/6112dff8-dd0f-4e86-9e88-0364ca887f3f" alt="Dark Mode" width="50%" />
      <br/><sub><b>Light Mode Support</b></sub>
    </td>
  </tr>
</table>

### 📱 Mobile Experience

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/a3bc4b69-f916-4f0e-8066-8203e9784e6d" alt="Mobile View 1" width="320" />
      <br/><sub><b>Mobile — Market List</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/dec1c34b-d0ae-4505-88cd-06f5a070681f" alt="Mobile View 2" width="320" />
      <br/><sub><b>Mobile — Coin Detail</b></sub>
    </td>
  </tr>
</table>

---

## ✨ Overview

CryptoSight is a production-ready cryptocurrency market dashboard that delivers live price data, interactive charts, and global market analytics — all in a blazing-fast, mobile-first interface. Built with a strict **Atomic Design** architecture and powered by the [CoinGecko API](https://www.coingecko.com/en/api/documentation).

---

## 🌟 Features

| Feature | Description |
|---|---|
| 📡 **Live Market Data** | Real-time prices, market caps, and 24h volumes with 60-second auto-refresh |
| 📈 **Interactive Charts** | SVG price charts with crosshair tooltips, volume bars, and multiple timeframes (24H → Max) |
| 🌍 **Global Market Stats** | Total market cap, BTC/ETH dominance, 24h volume, and active coin count at a glance |
| 🔍 **Coin Detail Pages** | Full-page routes with market stats, ATH/ATL records, supply data, exchange tickers, and sentiment |
| 🚀 **Top Gainers & Trending** | Dedicated panels surfacing top 24h performers and CoinGecko's trending coins |
| 🔎 **Smart Search** | Debounced live search with instant dropdown results — navigate to any coin in milliseconds |
| ⭐ **Watchlist** | Star coins and persist your favourites across sessions via `localStorage` |
| 🌗 **Dark / Light Mode** | First-class theme support with smooth transitions and OS preference detection |
| ⚡ **Sparkline Charts** | Inline 7-day mini-charts on every row for rapid trend scanning |
| 🟢 **Price Flash Animations** | Green/red row flash on live price updates for instant visual feedback |
| 📱 **Mobile First** | Native-feel layouts from 375px upward — no functionality locked behind desktop |

---

## 🛠 Tech Stack

```
Frontend  →  React 19 · TypeScript 6 · React Router v7
Styling   →  Tailwind CSS v4 · CSS custom properties · OKLCH color space
Data      →  TanStack Query v5 · CoinGecko Public API v3
State     →  Zustand v5 (with persist middleware)
Build     →  Vite 8 · Rolldown · Gzip + Brotli compression
Icons     →  Lucide React
```

---

## 🏗 Architecture

CryptoSight follows the **Atomic Design** methodology end-to-end:

```
src/
├── components/
│   ├── atoms/          # Button, Badge, Skeleton, Toast, ErrorBoundary
│   ├── molecules/      # SearchBar, SparklineChart, Pagination, SortableHeader
│   ├── organisms/      # MarketTable, PriceChart, Header, GlobalStatsBar
│   └── templates/      # CoinDetailPage
├── hooks/              # useMarketData, useCoinDetail, useTheme, useDebounce …
├── pages/              # Dashboard (lazy-loaded routes)
├── services/           # coingecko.ts — typed API client with deduplication
├── store/              # useWatchlistStore (Zustand + persist)
├── types/              # Shared TypeScript interfaces
└── utils/              # cn(), formatters
```

### Key Design Decisions

**React Query for all server state** — automatic background refetching, 30s stale time, built-in retry logic, and `isLoading` / `isFetching` states drive skeleton loaders with zero boilerplate.

**Request deduplication** — the API client tracks in-flight requests by URL. Identical concurrent calls share a single network request, eliminating redundant CoinGecko hits during rapid navigation.

**Zero CLS skeletons** — every skeleton placeholder precisely matches the final content's dimensions, keeping Cumulative Layout Shift at zero.

**Code splitting** — `CoinDetailPage` is `lazy()`-loaded. The initial JS bundle stays small; detail assets are fetched only when a user navigates to a coin.

**OKLCH color space** — all design tokens use OKLCH for perceptually uniform color, making dark/light mode transitions visually consistent across the full palette.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.19 (required by Vite 8 / ESLint 10)
- **npm** ≥ 10

### Installation

```bash
# 1. Clone
git clone https://github.com/Gnanesh18/CryptoSight.git
cd cryptosight

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# The default public CoinGecko endpoint works without a key (rate-limited)
# Add VITE_COINGECKO_API_KEY for higher limits

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — hot module replacement is enabled out of the box.

### Environment Variables

```env
# .env
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3   # optional override
VITE_COINGECKO_API_KEY=your_demo_key_here                   # optional, raises rate limit
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR enabled |
| `npm run build` | TypeScript check + optimised production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all TS/TSX files |

---

## 🔌 API Reference

Powered by the **[CoinGecko Public API v3](https://www.coingecko.com/en/api/documentation)** — no authentication required for standard use.

| Endpoint | Used For |
|---|---|
| `GET /coins/markets` | Dashboard coin list (price, market cap, sparklines, % changes) |
| `GET /coins/{id}` | Coin detail page (metadata, market data, tickers) |
| `GET /coins/{id}/market_chart` | Historical price / volume chart data |
| `GET /global` | Global market stats bar |
| `GET /search/trending` | Trending coins panel |
| `GET /search?query=` | Live search dropdown |

> **Rate limits:** The free public API allows ~30 req/min. Add a Demo API key to increase this. The app handles 429 responses gracefully with a user-visible retry countdown.

---

## ⚡ Performance

| Metric | Strategy |
|---|---|
| **Bundle size** | Manual chunk splitting for React, Router, and TanStack Query vendors |
| **Compression** | Gzip + Brotli via `vite-plugin-compression` |
| **Images** | Native lazy loading on all coin icons |
| **Re-renders** | `React.memo` on `CoinRow`; localised state for chart interactions |
| **Network** | In-flight request deduplication; React Query cache with 30s stale time |
| **CLS** | Skeleton loaders match exact final content dimensions |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| `< 640px` | Card-based coin list, condensed stats bar, icon-only tab labels |
| `640px – 1024px` | Table view with key columns, two-panel sidebar |
| `> 1024px` | Full table with 1h %, volume, sparkline columns visible |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork → clone → branch
git checkout -b feat/your-feature

# Make changes, then
npm run lint && npm run build

# Open a pull request
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with ☕ and [CoinGecko](https://www.coingecko.com) data

<sub>Market data is for informational purposes only · Not financial advice</sub>

<br/><br/>

⭐ **If you find this useful, consider starring the repo!** ⭐

</div>