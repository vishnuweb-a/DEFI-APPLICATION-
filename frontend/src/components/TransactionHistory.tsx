import type { TransferRecord } from "../types";
import { TransactionCard } from "./TransactionCard";

interface TransactionHistoryProps {
  transactions: TransferRecord[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  searchQuery?: string;
}

export function TransactionHistory({
  transactions,
  isLoading,
  error,
  onRefresh,
  searchQuery,
}: TransactionHistoryProps) {
  return (
    <section className="section" id="transactions">
      <div className="section__head">
        <div>
          <h2>Transaction history</h2>
          <p>Every transfer recorded by the contract on Sepolia.</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="notice notice--error">{error}</div>}

      {isLoading && transactions.length === 0 && (
        <div className="tx-grid">
          {[0, 1, 2].map((key) => (
            <div key={key} className="tx-card tx-card--skeleton">
              <span className="skeleton skeleton--line" />
              <span className="skeleton skeleton--line skeleton--short" />
              <span className="skeleton skeleton--line" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && transactions.length === 0 && (
        <div className="empty">
          <p className="empty__title">{searchQuery ? "No matching transactions" : "No transactions yet"}</p>
          <p className="empty__text">{searchQuery ? "Try an address, message or keyword." : "Send the first transfer to see it appear here."}</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="tx-grid">
          {transactions.map((tx, index) => (
            <TransactionCard
              key={`${tx.sender}-${tx.timestamp.toString()}-${index}`}
              tx={tx}
            />
          ))}
        </div>
      )}
    </section>
  );
}
