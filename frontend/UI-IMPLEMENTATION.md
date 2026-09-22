# Apna Wallet UI refinement

## Files changed in this refinement

- `src/App.css`: consolidated zinc theme; Georgia editorial headings; compact header and responsive sidebar; bounded content width; card layout and interaction; wallet, form, history, and footer styling; smaller decorative scene.
- `src/pages/Home.tsx`: clearer feature titles and a dedicated responsive card grid. Existing data, search, navigation, and transaction handling are preserved.
- `src/components/WorkspaceCard.tsx`: isolated SVG viewports for the four existing portraits; cover composition; layered gradient; normal-flow captions; consistent category, heading, description, metadata, and arrow placement.
- `src/components/Web3Backdrop.tsx`: neutral globe and icon backgrounds.
- `UI-IMPLEMENTATION.md`: this report.

## Design

The page uses zinc-900 (`#18181b`), zinc-950 surfaces (`#09090b`), zinc borders, and white/zinc text. Color is limited to category details, network/status indicators, focus, and the primary CTA. Existing artwork is reused without modification. Its four 543-by-724 portrait viewports prevent adjacent characters from bleeding into the crop. The background covers each card; captions remain in document flow so text can grow without overlapping other content.

Cards use one column below 640px, two from 640px, and four from 1440px. Search and account controls wrap at narrower widths. Mobile form inputs use 16px text; controls have at least 44px targets. The decorative scene is 200px on desktop and 160px on mobile. Footer metadata shares the content gutters.

Hover-capable devices get a 2px card lift, a 1.015 image zoom, and restrained border/arrow transitions. No floating, reveal, or decorative looping animations are used. Existing functional loading indicators remain. Reduced-motion preferences disable animation and transforms.

## Verification

- `npm run lint`: passed with the existing `react(set-state-in-effect)` warning in untouched `useTransactions.ts`.
- `npx tsc -b --pretty false`: passed.
- `npm run build`: passed; Vite retains the approximately 512 kB main-chunk advisory.
- `npm test`: passed existing checks for actual transaction metadata, escaping, empty/search states, wallet/network states, send feedback, and feature actions.
- Responsive breakpoints, artwork dimensions/crop rules, neutral theme, reduced motion, and wrapping were reviewed in source. Rendered responsive layouts and image fit still require visual verification: the browser runtime reported no available browser connections. No live signed transfer was attempted.
- SHA-256 comparisons confirmed all 10 protected files were unchanged: Solidity source, frontend ABI/configuration, wallet context/provider/hooks, transaction hook, TransferForm, ConnectWallet, and NetworkBadge. No smart contract, ABI behavior, wallet connection, transaction execution, network configuration, or backend logic was changed. No data was fabricated.
