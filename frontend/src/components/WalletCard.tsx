import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { copyToClipboard, shortenAddress, trimEther } from "../utils/address";

export function WalletCard() {
  const {
    account,
    isConnected,
    balance,
    isLoadingBalance,
    isCorrectNetwork,
    isConnecting,
    hasMetaMask,
    connect,
    switchToSepolia,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!account) return;
    setCopied(await copyToClipboard(account));
  };

  if (!isConnected || !account) {
    return (
      <div className="wallet-card wallet-card--empty">
        <p className="wallet-card__prompt">
          Connect a wallet to send ETH and see your balance.
        </p>
        {hasMetaMask ? (
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => void connect()}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <a
            className="btn btn--primary btn--block"
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Install MetaMask
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="wallet-card">
      <div className="wallet-card__chain">
        <span className="wallet-card__network">Ethereum</span>
        <span className={`badge ${isCorrectNetwork ? "badge--ok" : "badge--warn"}`}>
          <span className="badge__dot" aria-hidden="true" />
          {isCorrectNetwork ? "Sepolia" : "Wrong network"}
        </span>
      </div>

      <button
        type="button"
        className="wallet-card__address"
        onClick={() => void handleCopy()}
        title={account}
        aria-label={`Copy full address ${account}`}
      >
        <span className="wallet-card__mono">{shortenAddress(account)}</span>
        <span className="wallet-card__copy">{copied ? "Copied" : "Copy"}</span>
      </button>

      <div className="wallet-card__balance">
        <span className="label">Balance</span>
        {isLoadingBalance || balance === null ? (
          <span className="skeleton skeleton--text" aria-label="Loading balance" />
        ) : (
          <span className="wallet-card__amount">
            {trimEther(Number(formatEther(balance)).toFixed(4))} ETH
          </span>
        )}
      </div>

      {!isCorrectNetwork && (
        <button
          type="button"
          className="btn btn--warn btn--block"
          onClick={() => void switchToSepolia()}
        >
          Switch to Sepolia
        </button>
      )}
    </div>
  );
}
