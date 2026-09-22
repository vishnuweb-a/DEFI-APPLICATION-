# Krypt — Frontend

React + TypeScript + Vite + ethers v6 frontend for the `Transactions.sol` contract
already deployed to the Ethereum Sepolia testnet.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment

The app needs exactly one variable, in `frontend/.env`:

```
VITE_CONTRACT_ADDRESS=0x8617f983Fd1b5F8e0378Aa8358FE2Ad292A1c0EB
```

Copy `.env.example` to `.env` to get started.

### Why a separate frontend env file

The root `.ENV` is the Foundry environment. It is **not** used by the frontend, for
two reasons:

1. Vite only exposes variables prefixed with `VITE_` to the browser, and it resolves
   env files relative to the Vite project root (`frontend/`), not the repo root.
2. The root `.ENV` contains deployment secrets (a private key and an RPC API key).
   Pointing Vite at it via `envDir` would risk bundling those into client code.

Duplicating the **contract address alone** into `frontend/.env` is the least invasive
safe option: the address is public on-chain data, and no secret is copied. The root
`.ENV` was left completely untouched.

> **Never** put a private key, mnemonic, or RPC secret in this directory. Anything in a
> `VITE_`-prefixed variable is compiled into the JavaScript that ships to every visitor.
> MetaMask performs all signing; this app never handles key material.

## Contract ABI

`src/contracts/TransactionsABI.json` is the `abi` array extracted verbatim from the
Foundry build artifact at `out/Transactions.sol/Transactions.json`. It was not written
by hand. Re-extract it after any recompile:

```bash
node -e "const a=require('../out/Transactions.sol/Transactions.json');require('fs').writeFileSync('src/contracts/TransactionsABI.json',JSON.stringify(a.abi,null,2)+'\n')"
```

## Network

Sepolia only — chain ID `11155111` (`0xaa36a7`). Wrong-network state is detected and
surfaced with a **Switch to Sepolia** button that calls `wallet_switchEthereumChain`,
falling back to `wallet_addEthereumChain` if the chain is not in the wallet.

Reads fall back to a public Sepolia RPC so history and the transaction counter render
before a wallet is connected. Writes always go through the MetaMask signer.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Typecheck (`tsc -b`) + production build |
| `npm run lint` | oxlint |
| `npm run preview` | Serve the production build |

## Landing page and dashboard routes

`/` opens the educational landing page. `/app` opens the existing wallet dashboard; `/app#send`, `/app#wallet`, and `/app#transactions` open individual views. Previously shared root dashboard hash links are preserved. Landing-page Connect Wallet buttons enter the dashboard, where the existing MetaMask flow runs.

The landing page has its own saved light/dark preference. Its illustrations use local SVG assets; no image service or new dependency is required.

For production deployment, configure an SPA fallback: `/app` and `/app/` must serve `index.html`. Vite dev and preview already provide that behavior. Run `npm test` for presentation and landing-route checks. See `LANDING-IMPLEMENTATION.md` for the implementation and verification report.
