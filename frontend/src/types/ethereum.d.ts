import type { Eip1193Provider } from "ethers";

/**
 * MetaMask injects an EIP-1193 provider that also carries the event emitter
 * surface (`on`/`removeListener`) which is not part of ethers' base type.
 */
export interface InjectedProvider extends Eip1193Provider {
  isMetaMask?: boolean;
  on(event: "accountsChanged", handler: (accounts: string[]) => void): void;
  on(event: "chainChanged", handler: (chainId: string) => void): void;
  removeListener(event: "accountsChanged", handler: (accounts: string[]) => void): void;
  removeListener(event: "chainChanged", handler: (chainId: string) => void): void;
}

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }
}
