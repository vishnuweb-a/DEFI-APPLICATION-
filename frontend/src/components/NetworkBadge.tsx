import { useWallet } from "../hooks/useWallet";

export function NetworkBadge() {
  const { isConnected, isCorrectNetwork, chainId, switchToSepolia } = useWallet();
  if (isConnected && !isCorrectNetwork) return <button className="btn btn--warn" type="button" onClick={() => void switchToSepolia()}>Switch to Sepolia</button>;

  return (
    <span className="network-display" title={isConnected ? `Connected to chain ${chainId}` : "Supported network: Ethereum Sepolia testnet"}>
      <svg width="18" height="28" viewBox="0 0 18 28" aria-hidden="true"><path fill="#b4a0ed" d="M9 0 0 15l9 5 9-5L9 0Z" /><path fill="#7960b2" d="M9 22 0 17l9 11 9-11-9 5Z" /></svg>
      <span>Ethereum <small>Sepolia testnet</small></span>
    </span>
  );
}
