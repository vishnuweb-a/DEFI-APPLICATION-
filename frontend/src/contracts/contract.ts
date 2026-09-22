import abi from "./TransactionsABI.json";

/**
 * Address of the already-deployed `Transactions.sol` on Sepolia.
 *
 * Sourced from `VITE_CONTRACT_ADDRESS` in `frontend/.env`. The address is public
 * blockchain data, so exposing it to the browser is safe. No key material of any
 * kind is read here — MetaMask owns signing.
 */
export const CONTRACT_ADDRESS: string | undefined = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CONTRACT_ABI = abi;

export const SEPOLIA_CHAIN_ID = 11155111n;
export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";
export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

/** Throws a user-readable error when the deployment address was never configured. */
export function requireContractAddress(): string {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      "Missing contract address. Set VITE_CONTRACT_ADDRESS in frontend/.env and restart the dev server.",
    );
  }
  return CONTRACT_ADDRESS;
}
