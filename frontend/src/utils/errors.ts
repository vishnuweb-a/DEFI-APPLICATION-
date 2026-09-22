/**
 * MetaMask and the RPC layer throw richly nested objects. The UI only ever shows
 * the distilled sentence; the raw error stays in the console for debugging.
 */

interface RpcLikeError {
  code?: number | string;
  reason?: string;
  shortMessage?: string;
  message?: string;
  data?: { message?: string };
  error?: { message?: string };
  info?: { error?: { code?: number; message?: string } };
}

const USER_REJECTED = new Set([4001, "ACTION_REJECTED"]);

function asRpcError(error: unknown): RpcLikeError {
  return typeof error === "object" && error !== null ? (error as RpcLikeError) : {};
}

export function isUserRejection(error: unknown): boolean {
  const e = asRpcError(error);
  return USER_REJECTED.has(e.code as number | string) || e.info?.error?.code === 4001;
}

export function parseError(error: unknown): string {
  console.error("[krypt]", error);
  const e = asRpcError(error);

  if (isUserRejection(error)) return "Transaction cancelled.";

  if (e.code === "INSUFFICIENT_FUNDS" || /insufficient funds/i.test(e.message ?? "")) {
    return "Insufficient Sepolia ETH to cover the amount plus gas.";
  }

  if (e.code === "NETWORK_ERROR" || e.code === -32603) {
    return "Network error talking to Sepolia. Check your connection and try again.";
  }

  if (e.code === "CALL_EXCEPTION") {
    return e.reason
      ? `Contract reverted: ${e.reason}`
      : "The contract rejected this transaction.";
  }

  // `reason` carries the Solidity require() string when one is available.
  const candidate =
    e.reason ??
    e.data?.message ??
    e.error?.message ??
    e.info?.error?.message ??
    e.shortMessage ??
    e.message;

  if (!candidate) return "Something went wrong. Please try again.";

  // Strip the trailing RPC payload that ethers appends after the human sentence.
  return candidate.split(" (action=")[0].split("\n")[0].slice(0, 180);
}
