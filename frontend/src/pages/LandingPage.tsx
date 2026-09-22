import { useEffect, useState } from "react";
import { AppLink, LandingBrand, LandingIcon, type LandingIconName } from "../components/landing/Primitives";
import { EthereumVisual, GlobeVisual, HeroVisual } from "../components/landing/Visuals";
import { CONTRACT_ADDRESS, SEPOLIA_EXPLORER } from "../contracts/contract";
import { shortenAddress } from "../utils/address";

const navigation = [["home", "Home"], ["features", "Features"], ["how-it-works", "How it Works"], ["blockchain", "Blockchain"], ["faq", "FAQ"]];
const features: { title: string; description: string; icon: LandingIconName }[] = [
  { title: "Manage Assets", description: "See your connected account and Sepolia ETH balance in one place.", icon: "wallet" },
  { title: "Send ETH", description: "Send testnet ETH with a personal message recorded onchain.", icon: "send" },
  { title: "Explore Web3", description: "Discover how wallets, decentralized apps and smart contracts connect.", icon: "cube" },
  { title: "Stay in Control", description: "Your keys. Your wallet. You review and approve each transaction.", icon: "shield" },
];
const steps: { title: string; description: string; icon: LandingIconName }[] = [
  { title: "Connect Wallet", description: "Enter the app and connect your existing MetaMask wallet.", icon: "wallet" },
  { title: "Send & Receive", description: "Use Sepolia test ETH to try your first onchain transfer.", icon: "send" },
  { title: "Explore & Interact", description: "Read your transfer history and inspect the app’s smart contract.", icon: "cube" },
  { title: "Own More Together", description: "Build your understanding of the wider Web3 ecosystem.", icon: "activity" },
];
const transactionSteps = [
  ["Set the destination", "Enter the recipient, amount, message and keyword."],
  ["Review the request", "Your wallet shows the transaction and estimated network fee."],
  ["Approve & sign", "If you approve, MetaMask signs using your wallet’s key."],
  ["Send to the network", "The signed transaction is broadcast to Ethereum Sepolia."],
  ["Wait for inclusion", "The network checks the transaction and includes it in a block."],
  ["Follow the record", "See confirmation in the app and inspect the transaction in the explorer."],
];
const glossary = [
  ["Wallet", "Your interface for interacting with blockchain networks."],
  ["Public address", "An address others can use to send assets to your account."],
  ["Private key", "The secret that authorizes actions from your account. Never share it."],
  ["Gas", "The network fee for processing a transaction or running contract code."],
  ["Smart contract", "Code on the blockchain that runs when called, following its programmed rules."],
  ["dApp", "An application that uses a blockchain for part of its functionality."],
];
const faqs = [
  ["Do I need a wallet to explore?", "No. Read the guides here without connecting. To view your balance or send ETH, enter the app and connect MetaMask."],
  ["Is this real ETH?", "This application uses Ethereum’s Sepolia testnet. Use Sepolia test ETH, not mainnet ETH. Test tokens are for experimenting and have no intended monetary value."],
  ["Does Apna Wallet hold my private key?", "No. Apna Wallet does not ask for your private key or recovery phrase. MetaMask manages signing; you review and approve requests there."],
  ["Can I reverse a transfer?", "The app cannot undo a finalized blockchain transaction. Review the destination, network and amount carefully before approving."],
  ["Can I use every token or dApp here?", "The current dashboard supports Sepolia ETH transfers through its configured contract. DeFi, NFTs and other dApps are explained as part of the wider Ethereum ecosystem; they are not built-in trading features."],
];

function initialTheme(): "dark" | "light" {
  try { return localStorage.getItem("apna-landing-theme") === "light" ? "light" : "dark"; } catch { return "dark"; }
}

export function LandingPage() {
  const [theme, setTheme] = useState(initialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    try { localStorage.setItem("apna-landing-theme", theme); } catch { /* Theme still works without storage. */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    const original = meta?.getAttribute("content") ?? "#18181b";
    meta?.setAttribute("content", theme === "dark" ? "#18181b" : "#fafafa");
    return () => { meta?.setAttribute("content", original); };
  }, [theme]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px" });
    navigation.forEach(([id]) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  return <div className="landing" data-theme={theme}>
    <a className="skip-link" href="#landing-main">Skip to content</a>
    <header className="lp-header">
      <div className="lp-container lp-header-inner">
        <LandingBrand />
        <nav id="landing-navigation" className={`lp-nav${menuOpen ? " is-open" : ""}`} aria-label="Landing navigation" onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); document.getElementById("landing-menu-toggle")?.focus(); } }}>
          {navigation.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="lp-nav-app" href="/app">Launch App <span aria-hidden="true">?</span></a>
        </nav>
        <div className="lp-header-actions">
          <button className="lp-icon-button" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><LandingIcon name={theme === "dark" ? "moon" : "sun"} /></button>
          <AppLink />
          <button id="landing-menu-toggle" className="lp-icon-button lp-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="landing-navigation" onClick={() => setMenuOpen(!menuOpen)}><LandingIcon name={menuOpen ? "close" : "menu"} /></button>
        </div>
      </div>
    </header>
    <main id="landing-main" tabIndex={-1}>
      <section id="home" className="lp-container lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-pill">YOUR ONCHAIN WORLD</p>
          <h1>Simple. Secure.<br /><em>Truly Yours.</em></h1>
          <p className="lp-lead">Apna Wallet is your gateway to Web3. View your balance, send ETH and interact with a smart contract — all in one place.</p>
          <div className="lp-actions"><AppLink arrow /><a className="lp-button lp-button--outline" href="#how-it-works"><LandingIcon name="play" />Watch Demo</a></div>
          <p className="lp-caption">Start on Sepolia testnet. Connect with MetaMask inside the app.</p>
          <div className="lp-highlights"><div><strong>Your keys</strong><span>Your control</span></div><div><strong>Onchain</strong><span>Verifiable transfers</span></div><div><strong>Ethereum</strong><span>Powered</span></div></div>
        </div>
        <HeroVisual />
      </section>
      <section id="features" className="lp-container lp-feature-section" aria-label="Apna Wallet features">
        <div className="lp-four-grid">{features.map(item => <article className="lp-card" key={item.title}><span className="lp-feature-icon"><LandingIcon name={item.icon} /></span><h2>{item.title}</h2><p>{item.description}</p></article>)}</div>
      </section>
      <section id="how-it-works" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head"><div><h2>How Apna Wallet Works</h2><p>Get started in minutes and step into the world of Web3.</p></div><a className="lp-text-link" href="#transaction-flow">See the journey <span aria-hidden="true">→</span></a></div>
          <ol className="lp-four-grid lp-steps">{steps.map((step, index) => <li className="lp-card" key={step.title}><div className="lp-step-top"><span className="lp-step-number">{index + 1}</span><LandingIcon name={step.icon} /></div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </div>
      </section>
      <section id="ethereum-network" className="lp-section">
        <div className="lp-container lp-two-column">
          <div><p className="lp-eyebrow">POWERED BY BLOCKCHAIN</p><h2>Built on Ethereum.<br /><em>Open to a Bigger World.</em></h2><p className="lp-lead">A global network. A shared foundation. Ethereum brings programmable transactions to a world of decentralized finance, digital collectibles and Web3 applications.</p><p className="lp-caption">Apna Wallet is your place to start, using Sepolia test ETH.</p><div className="lp-actions"><a className="lp-button lp-button--gold" href="https://ethereum.org/en/" target="_blank" rel="noreferrer noopener">Explore Ethereum<LandingIcon name="external" /></a><a className="lp-button lp-button--outline" href="https://ethereum.org/en/developers/docs/intro-to-ethereum/" target="_blank" rel="noreferrer noopener"><LandingIcon name="book" />Read Docs</a></div></div>
          <EthereumVisual />
          <div className="lp-principles"><div><LandingIcon name="layers" /><h3>Decentralized</h3><p>No single company controls the network.</p></div><div><LandingIcon name="shield" /><h3>Transparent</h3><p>Verify transactions directly onchain.</p></div><div><LandingIcon name="cube" /><h3>Smart contracts</h3><p>Shared code executes its rules when called.</p></div></div>
        </div>
      </section>
      <section id="blockchain" className="lp-section lp-education">
        <div className="lp-container lp-two-column">
          <div><p className="lp-eyebrow">THE BIG PICTURE</p><h2>What is Blockchain?</h2><p className="lp-lead">Think of a shared digital record, maintained by a network of computers instead of one central server.</p><p className="lp-body">Transactions are collected into blocks, each linked to the one before it. As the network agrees on and finalizes those blocks, they form a lasting history that anyone can check.</p><a className="lp-text-link" href="https://ethereum.org/en/developers/docs/intro-to-ethereum/" target="_blank" rel="noreferrer noopener">Learn the fundamentals <span aria-hidden="true">↗</span></a></div>
          <ol className="lp-chain" aria-label="From a user to the blockchain">{["You", "Transaction", "Network verification", "Block", "Blockchain"].map((label, index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><LandingIcon name={index === 0 ? "wallet" : index < 3 ? "send" : "cube"} /></li>)}</ol>
        </div>
      </section>
      <section id="transaction-flow" className="lp-section">
        <div className="lp-container"><div className="lp-section-head"><div><p className="lp-eyebrow">FROM YOUR WALLET TO THE WORLD</p><h2>What happens when you send ETH?</h2><p>You approve the transfer. The network keeps the record.</p></div></div><ol className="lp-timeline">{transactionSteps.map(([title, text], index) => <li key={title}><span className="lp-step-number">{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><a className="lp-text-link" href="https://ethereum.org/en/developers/docs/transactions/" target="_blank" rel="noreferrer noopener">More about Ethereum transactions <span aria-hidden="true">↗</span></a></div>
      </section>
      <section className="lp-section lp-education" aria-labelledby="glossary-heading"><div className="lp-container"><div className="lp-section-head"><div><p className="lp-eyebrow">A LITTLE KNOWLEDGE. MORE CONFIDENCE.</p><h2 id="glossary-heading">Web3, in plain words.</h2></div></div><dl className="lp-glossary">{glossary.map(([term, text], index) => <div key={term}><span aria-hidden="true">0{index + 1}</span><dt>{term}</dt><dd>{text}</dd></div>)}</dl></div></section>
      <section id="security" className="lp-section"><div className="lp-container lp-two-column"><div><p className="lp-eyebrow">YOUR WALLET. YOUR DECISIONS.</p><h2>Built Around Your Control</h2><p className="lp-lead">Apna Wallet never asks for your private key or recovery phrase. Signing is handled by your connected MetaMask wallet.</p><a className="lp-text-link" href="/app#transactions">Explore onchain activity <span aria-hidden="true">→</span></a></div><ul className="lp-security-list">{["Your wallet remains user-controlled", "Transactions require your approval", "Transfer records can be verified onchain", "Inspect the configured contract in the explorer"].map(text => <li key={text}><LandingIcon name="shield" /><span>{text}</span></li>)}</ul></div></section>
      <section id="faq" className="lp-section lp-faq"><div className="lp-container lp-two-column"><div><p className="lp-eyebrow">BEFORE YOU BEGIN</p><h2>A few good questions.</h2><p className="lp-lead">A clearer starting point for your onchain journey.</p></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="lp-container lp-final-wrap"><div className="lp-final"><GlobeVisual /><div className="lp-final-copy"><p className="lp-pill">JOIN THE ONCHAIN MOVEMENT</p><h2>Ready to take control?</h2><p className="lp-lead">Connect your wallet and start exploring Web3 with Apna Wallet.</p><div className="lp-actions"><AppLink arrow /><a className="lp-button lp-button--outline" href="#blockchain"><LandingIcon name="book" />Learn More</a></div><p className="lp-final-note">A MORE OPEN FINANCIAL FUTURE. TOGETHER.</p></div></div></section>
    </main>
    <footer className="lp-footer"><div className="lp-container"><div className="lp-footer-top"><LandingBrand /><nav aria-label="Footer navigation"><a href="#home">Home</a><a href="#how-it-works">How it Works</a><a href="#blockchain">Blockchain</a><a href="#security">Security</a></nav></div><div className="lp-footer-bottom"><p>Ethereum · Sepolia Testnet<br />Testnet only. Signing is handled by your connected wallet.</p>{CONTRACT_ADDRESS && <a href={`${SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`} title={CONTRACT_ADDRESS} target="_blank" rel="noreferrer noopener">Contract {shortenAddress(CONTRACT_ADDRESS)} ↗</a>}</div></div></footer>
  </div>;
}
