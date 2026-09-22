# Landing page implementation

## Added

- `src/pages/LandingPage.tsx`: home, feature grid, four-step walkthrough, Ethereum overview, blockchain flow, transaction timeline, glossary, security copy, FAQ, final CTA, and footer.
- `src/components/landing/Primitives.tsx`: reusable brand, app CTA, and icons.
- `src/components/landing/Visuals.tsx`: hero pedestal and mascot composition, Ethereum network graphic, and decorative wireframe globe. Uses the existing local logo and SVG/CSS only.
- `src/landing.css`: scoped zinc/gold styling, editorial headings, light/dark tokens, tablet/mobile layouts, keyboard focus, and reduced-motion support.
- `src/utils/routes.ts`: route selection preserving legacy dashboard links.
- `tests/landing.test.mjs`: route/render checks, landing anchors and CTA destinations, theme restoration/fallback, and HTTP route checks.

## Changed

- `src/App.tsx`: renders the landing page at `/` and the original dashboard at `/app` (including `/app/`). Existing root hash links `#overview`, `#wallet`, `#send`, `#transactions`, and `#top` still open the dashboard.
- `package.json`: includes landing checks in `npm test`; no new dependencies.
- `README.md`: route and hosting notes.

## Behavior and design

Connect Wallet and Launch App links enter `/app`. The original dashboard handles connecting or installing MetaMask. There is no new wallet or transaction implementation. Watch Demo opens the How it Works section; Learn More opens the blockchain section. Footer explorer links use the existing configured contract address.

The landing page defaults to dark zinc with warm gold accents. Its theme toggle persists only the landing-page preference and does not alter the existing dashboard. Light mode uses off-white backgrounds and darker gold text for readable contrast. The mobile menu has an expanded-state announcement and closes after section navigation; Escape from the menu returns focus to its button. FAQ uses native keyboard-accessible disclosure elements.

Desktop uses a two-column hero and four-column feature/walkthrough grids; tablet uses two-column cards; mobile stacks the hero, cards, education, and process. Decorative visuals are contained. Motion is limited to small hover translations, borders, disclosure indicators, and smooth scrolling, with reduced-motion overrides. There are no decorative looping animations.

Copy describes the actual Sepolia ETH/MetaMask application. Wider Ethereum capabilities are educational, not advertised as implemented trading features. There are no invented users, balances, transfer counts, or addresses. Educational links point to Ethereum.org's introductory and transaction documentation.

## Validation

- Lint: passed with the existing warning in untouched `useTransactions.ts`.
- TypeScript: passed.
- Production build: passed with Vite's main-chunk size advisory.
- Presentation tests: passed existing wallet/network/send-state and transaction-content checks.
- Landing tests: passed route rendering, legacy links, all section destinations, app CTAs, missing-wallet state, stored light theme, unavailable-storage fallback, and HTTP 200 responses for `/`, `/app`, `/app/`.
- Protected-file SHA-256 comparisons: Solidity, ABI/configuration, wallet provider/context/hooks, transaction hook, network component, wallet-connect component, and transfer form remain unchanged.
- Browser runtime has no available connections. Actual mobile screenshots, interactive theme/menu behavior, and live MetaMask connection/signing remain unverified. Automated render checks are not an end-to-end browser or wallet test.

## Hosting

Production hosting must serve `index.html` for `/app` and `/app/` (SPA fallback). Vite dev/preview supplies this automatically. No hosting provider configuration existed to update.
