import { useEffect, useState } from "react";
import { AppSidebar, type DashboardView } from "../components/AppSidebar";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Stats } from "../components/Stats";
import { TransactionHistory } from "../components/TransactionHistory";
import { TransferForm } from "../components/TransferForm";
import { WalletCard } from "../components/WalletCard";
import { WorkspaceCard, type WorkspaceItem } from "../components/WorkspaceCard";
import { Web3Backdrop } from "../components/Web3Backdrop";
import { Icon } from "../components/Icon";
import { CONTRACT_ADDRESS, SEPOLIA_EXPLORER } from "../contracts/contract";
import { useTransactions } from "../hooks/useTransactions";
import { useWallet } from "../hooks/useWallet";
import { shortenAddress } from "../utils/address";

function currentView(): DashboardView {
  const hash = window.location.hash.slice(1);
  return hash === "wallet" || hash === "send" || hash === "transactions" ? hash : "overview";
}

export function Home() {
  const { error, clearError, account } = useWallet();
  const { transactions, transactionCount, isLoadingHistory, historyError, refreshHistory, status, txHash, sendError, send, resetSendState, isSending } = useTransactions();
  const [view, setView] = useState<DashboardView>(currentView);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const navigate = () => {
      if (["", "#top", "#overview", "#wallet", "#send", "#transactions"].includes(window.location.hash)) {
        setView(currentView());
        setQuery("");
      }
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  const items: WorkspaceItem[] = [
    { title: "My wallet", tag: account ? "Connected" : "Get started", meta: account ? shortenAddress(account) : "Your account", description: "Your ETH. Your keys.\nEverything in one place.", href: "#wallet", icon: "layers", accent: "#42ded1", character: 0 },
    { title: "Send ETH", tag: "ETH transfers", meta: "Sepolia", description: "Send across the world.\nLeave a message onchain.", href: "#send", icon: "send", accent: "#61b9f5", character: 1 },
    { title: "Activity", tag: "Activity", meta: transactionCount === null ? "Transfer history" : `${transactionCount} transfers`, description: "Every transfer, recorded.\nFollow the journey.", href: "#transactions", icon: "activity", accent: "#b796ec", character: 2 },
    { title: "Smart contract", tag: "Smart contract", meta: "Sepolia", description: CONTRACT_ADDRESS ? "Explore the contract.\nVerify it for yourself." : "Contract not configured.\nExplorer unavailable.", href: CONTRACT_ADDRESS ? `${SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}` : undefined, icon: "cube", accent: "#e4bd6d", character: 3 },
  ];
  const normalized = query.trim().toLowerCase();
  const filteredItems = items.filter(item => `${item.title} ${item.tag} ${item.meta} ${item.description}`.toLowerCase().includes(normalized));
  const filteredTransactions = transactions.filter(tx => `${tx.sender} ${tx.receiver} ${tx.message} ${tx.keyword} ETH`.toLowerCase().includes(normalized));
  const searching = normalized.length > 0;
  return <div className="app bg-zinc-900 text-zinc-100" id="top" onClick={(event) => { if (event.target instanceof Element && event.target.closest('a[href^="#"]')) setQuery(""); }}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <AppSidebar view={view} />
    <div className="main-shell">
      <Navbar query={query} onSearch={setQuery} />
      <main id="main-content" className="dashboard-main" tabIndex={-1}>
        <p className="sr-only" role="status" aria-live="polite">{status === "awaiting-wallet" ? "Confirm the transaction in MetaMask" : status === "pending" ? "Transaction pending" : status === "confirmed" ? "Transaction confirmed" : status === "failed" ? sendError : ""}</p>
        {error && <div className="notice notice--error notice--banner" role="alert"><span>{error}</span><button type="button" className="notice__close" onClick={clearError} aria-label="Dismiss error">×</button></div>}
        <section className="page-heading flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow">{searching ? "FIND YOUR WAY" : view === "overview" ? "YOUR ONCHAIN WORLD" : "YOUR WALLET SPACE"}</p>
            <h1>{searching ? <>Search <span>your space</span></> : view === "overview" ? <>Apna <span>Wallet</span></> : view === "wallet" ? <>Your wallet. <span>Your world.</span></> : view === "send" ? <>Send something <span>meaningful.</span></> : <>Your onchain <span>activity.</span></>}</h1>
            <p className="page-subtitle">{view === "overview" ? "Access your wallet, move ETH, and make your mark onchain — all in one place." : view === "send" ? "A simple transfer. A personal message. Permanently onchain." : view === "wallet" ? "Your connected account and balance, at a glance." : "Explore every transfer recorded by the contract on Sepolia."}</p>
          </div>
          {view !== "send" && <div className="heading-action"><a className="btn btn--primary" href="#send"><Icon name="plus" />New transfer</a><p>A little ETH. A new connection.</p></div>}
        </section>
        {(view === "overview" || searching) && <><div className="workspace-grid">{filteredItems.map(item => <WorkspaceCard key={item.title} item={item} />)}</div>{searching && filteredItems.length === 0 && <p className="search-note">No wallet features match “{query}”.</p>}</>}
        {view === "overview" && !searching && <Web3Backdrop />}
        <div hidden={view !== "wallet" || searching} className="wallet-view"><div><p className="eyebrow">CONNECTED ACCOUNT</p><WalletCard /></div><div className="wallet-explainer"><Icon name="cube" /><h2>Built on Ethereum.<br />Owned by you.</h2><p>Connect MetaMask to view your balance and send ETH on the Sepolia testnet.</p></div><Stats transactionCount={transactionCount} isLoading={isLoadingHistory} /></div>
        <div hidden={view !== "send" || searching} className="send-view"><div className="transfer-intro"><span className="eyebrow">A MORE CONNECTED WORLD</span><h2>Value moves.<br />Stories stay.</h2><p>Send Sepolia ETH with a message and keyword. Your wallet handles the signing; the blockchain keeps the record.</p><WalletCard /></div><TransferForm status={status} txHash={txHash} sendError={sendError} isSending={isSending} send={send} resetSendState={resetSendState} /></div>
        {(view === "transactions" || searching) && <TransactionHistory transactions={filteredTransactions} isLoading={isLoadingHistory} error={historyError} onRefresh={() => void refreshHistory()} searchQuery={normalized} />}
      </main><Footer />
    </div>
  </div>;
}


