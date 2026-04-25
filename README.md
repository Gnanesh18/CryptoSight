# CryptoSight — Real-Time Market Intelligence Dashboard

A production-grade cryptocurrency market dashboard built with React 18, TypeScript (strict), Tailwind CSS v4, and Vite.

![CryptoSight Dashboard](./public/preview.png)

---

## Setup & Running Locally

```bash
# 1. Clone the repo
git clone <your-repo-url> crypto-dashboard
cd crypto-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_COINGECKO_BASE_URL` | CoinGecko API base URL | `https://api.coingecko.com/api/v3` |

Copy `.env.example` to `.env` and modify as needed (the public endpoint works out of the box).

---

## Architecture Decisions

### State Management: Zustand over Context API

Zustand was chosen because:
- **Zero boilerplate** — no providers, reducers, or action types
- **Selective subscriptions** — components only re-render when their specific slice changes
- **Built-in persistence** — `zustand/middleware` `persist` makes localStorage integration trivial (watchlist)
- **TypeScript-first** — excellent inference without extra setup

Context API was considered but rejected because it causes all consumers to re-render on any state update, requiring `useMemo`/`useCallback` everywhere — Zustand handles this automatically.

### Data Fetching: Custom `useMarketData` Hook (no react-query)

A custom hook was implemented instead of react-query/SWR to:
- Demonstrate custom hook architecture proficiency
- Keep the dependency tree minimal
- Show explicit handling of `isLoading` vs `isRefreshing` distinction
- Implement the Page Visibility API integration directly

### Polling Strategy

- Data refreshes on a **60-second interval** (respecting CoinGecko's rate limits)
- The `Page Visibility API` pauses polling when the tab is backgrounded, resuming immediately when the user returns
- A **countdown progress bar** in the header shows seconds until next refresh
- A **spinning indicator** appears during background refreshes (distinct from skeleton loading on first load)

### Styling: Tailwind CSS v4 (with `@tailwindcss/vite` plugin)

- CSS variables defined via `@theme {}` in `index.css` for the full design token system
- `cn()` utility (clsx + tailwind-merge) prevents class conflicts and enables conditional styling
- **No inline `style` props** for layout — all spacing is Tailwind utility classes
- Exception: `style={{ fontFamily: '...' }}` for font pairing (display vs body) — not available as a Tailwind utility without extending config

### Component Architecture

Feature-based structure under `src/`:
- `components/ui/` — generic, reusable primitives (Skeleton, Button, Badge)
- `components/market/` — domain-specific components (CoinRow, CoinDrawer, SearchBar, etc.)
- `hooks/` — custom hooks abstracting all logic from components
- `services/` — centralized API layer (never inline `fetch` in components)
- `store/` — Zustand slices
- `types/` — shared TypeScript interfaces
- `utils/` — pure helper functions

### Performance Choices

- `CoinRow` wrapped in `React.memo` — prevents re-renders for unchanged coins during polling updates
- `useMemo` on filtered/sorted coin lists — recalculates only when coins, query, or sort state changes
- `useCallback` on stable handler functions passed as props
- Coin images use `loading="lazy"` — defers off-screen logo requests
- Search debounced at 300ms — prevents excessive filtering on rapid keystrokes

---

## Bonus Features Implemented

- [x] **Dark/Light Mode** — OS preference detection + localStorage persistence + smooth CSS transitions
- [x] **Auto-Polling** — 60-second interval + countdown progress bar + green/red flash animation on price change + Page Visibility API pause
- [x] **Asset Detail Drawer** — slide-in panel with 24h high/low range bar, ATH/ATL, supply metrics, FDV; Escape/backdrop dismiss; focus trap; `aria-modal`
- [x] **Sortable Columns** — all columns (rank, name, price, 24h%, market cap, volume); asc/desc toggle; active sort indicator with Lucide icons
- [x] **Pagination** — client-side page-based pagination with ellipsis for large datasets
- [x] **Watchlist** — star toggle per coin; localStorage persistence via Zustand; dedicated tab; empty state with hint

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |
| State Management | Zustand |
| Data Fetching | Native `fetch` |
| Icons | Lucide React |
| Utilities | clsx + tailwind-merge |

---

## API

Powered by the [CoinGecko Public API](https://www.coingecko.com/en/api/documentation) — no paid tier required.

**Endpoint used:** `GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20`
