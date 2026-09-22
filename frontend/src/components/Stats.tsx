import { formatEther } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { trimEther } from "../utils/address";

interface StatsProps {
  transactionCount: bigint | null;
  isLoading: boolean;
}

export function Stats({ transactionCount, isLoading }: StatsProps) {
  const { balance, isConnected, isCorrectNetwork, isLoadingBalance } = useWallet();

  return (
    <section className="stats" aria-label="Network statistics">
      <div className="stat">
        <span className="label">Network</span>
        <span className="stat__value">
          {!isConnected ? "Sepolia" : isCorrectNetwork ? "Sepolia" : "Unsupported"}
        </span>
      </div>

      <div className="stat">
        <span className="label">Wallet balance</span>
        {!isConnected ? (
          <span className="stat__value stat__value--muted">Not connected</span>
        ) : isLoadingBalance || balance === null ? (
          <span className="skeleton skeleton--text" aria-label="Loading balance" />
        ) : (
          <span className="stat__value">
            {trimEther(Number(formatEther(balance)).toFixed(4))} ETH
          </span>
        )}
      </div>

      <div className="stat">
        <span className="label">Total transactions</span>
        {isLoading && transactionCount === null ? (
          <span className="skeleton skeleton--text" aria-label="Loading count" />
        ) : (
          <span className="stat__value">{transactionCount?.toString() ?? "—"}</span>
        )}
      </div>
    </section>
  );
}
