import { useWallet } from "../hooks/useWallet";
import { shortenAddress } from "../utils/address";

export function ConnectWallet() {
  const { account, isConnected, isConnecting, hasMetaMask, connect, disconnect } = useWallet();

  if (!hasMetaMask) {
    return (
      <a
        className="btn btn--primary"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Install MetaMask
      </a>
    );
  }

  if (isConnected && account) {
    return (
      <button type="button" className="btn btn--ghost" onClick={disconnect}>
        <span className="btn__mono">{shortenAddress(account)}</span>
        <span className="btn__hint">Disconnect</span>
      </button>
    );
  }

  return (
    <button type="button" className="btn btn--primary" onClick={() => void connect()} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
