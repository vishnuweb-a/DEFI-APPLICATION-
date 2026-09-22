import { createContext } from "react";
import type { BrowserProvider, JsonRpcSigner } from "ethers";

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  balance: bigint | null;
  chainId: bigint | null;
  isCorrectNetwork: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  hasMetaMask: boolean;
  isConnecting: boolean;
  isLoadingBalance: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
}

export const WalletContext = createContext<WalletState | null>(null);
