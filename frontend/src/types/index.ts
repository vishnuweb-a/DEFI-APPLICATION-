export type TxStatus = "idle" | "awaiting-wallet" | "pending" | "confirmed" | "failed";

/** A transaction as returned by `getAllTransactions()`, normalised for the UI. */
export interface TransferRecord {
  sender: string;
  receiver: string;
  amount: bigint;
  message: string;
  keyword: string;
  timestamp: bigint;
}

export interface TransferFormValues {
  receiver: string;
  amount: string;
  keyword: string;
  message: string;
}
