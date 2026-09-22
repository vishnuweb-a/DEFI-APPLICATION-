import { formatEther } from "ethers";
import { SEPOLIA_EXPLORER } from "../contracts/contract";
import type { TransferRecord } from "../types";
import { formatTimestamp, shortenAddress, trimEther } from "../utils/address";

export function TransactionCard({ tx }: { tx: TransferRecord }) {
  return (
    <article className="tx-card">
      <div className="tx-card__header"><span className="transaction-avatar" style={{ backgroundPosition: `${parseInt(tx.sender.slice(-2), 16) % 4 * 100 / 3}% top` }} aria-hidden="true" /><div><h3>ETH transfer</h3><span className="label">Sepolia · Onchain record</span></div></div>
      <div className="tx-card__parties">
        <div className="tx-card__party">
          <span className="label">From</span>
          <a
            className="tx-card__mono"
            href={`${SEPOLIA_EXPLORER}/address/${tx.sender}`}
            target="_blank"
            rel="noreferrer noopener"
            title={tx.sender}
          >
            {shortenAddress(tx.sender)}
          </a>
        </div>

        <span className="tx-card__arrow" aria-hidden="true">
          →
        </span>

        <div className="tx-card__party">
          <span className="label">To</span>
          <a
            className="tx-card__mono"
            href={`${SEPOLIA_EXPLORER}/address/${tx.receiver}`}
            target="_blank"
            rel="noreferrer noopener"
            title={tx.receiver}
          >
            {shortenAddress(tx.receiver)}
          </a>
        </div>
      </div>

      <p className="tx-card__amount">{trimEther(formatEther(tx.amount))} ETH</p>

      {tx.message.trim() && <p className="tx-card__message">&ldquo;{tx.message}&rdquo;</p>}

      <div className="tx-card__foot">
        {tx.keyword.trim() && <span className="chip">{tx.keyword}</span>}
        <time className="tx-card__time">{formatTimestamp(tx.timestamp)}</time>
      </div>
    </article>
  );
}
