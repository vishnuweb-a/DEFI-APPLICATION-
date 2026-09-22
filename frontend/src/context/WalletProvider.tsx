import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrowserProvider, type JsonRpcSigner } from "ethers";
import { SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID_HEX } from "../contracts/contract";
import { isUserRejection, parseError } from "../utils/errors";
import { WalletContext, type WalletState } from "./WalletContext";

/** MetaMask returns this when the requested chain is not in the wallet yet. */
const CHAIN_NOT_ADDED = 4902;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  // Lets the long-lived event listeners read the current account without being
  // torn down and resubscribed every time it changes. Written in an effect
  // rather than during render, which is unsafe under concurrent rendering.
  const accountRef = useRef<string | null>(null);
  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  const clearError = useCallback(() => setError(null), []);

  const readBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return;
    setIsLoadingBalance(true);
    try {
      const next = new BrowserProvider(window.ethereum);
      setBalance(await next.getBalance(address));
    } catch (err) {
      console.error("[krypt] balance", err);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  /** Rebuild provider/signer/balance from whatever MetaMask currently reports. */
  const syncWallet = useCallback(
    async (address: string) => {
      if (!window.ethereum) return;
      const nextProvider = new BrowserProvider(window.ethereum);
      const network = await nextProvider.getNetwork();
      setProvider(nextProvider);
      setChainId(network.chainId);
      setAccount(address);
      try {
        setSigner(await nextProvider.getSigner());
      } catch {
        setSigner(null);
      }
      await readBalance(address);
    },
    [readBalance],
  );

  const reset = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setSigner(null);
    setProvider(null);
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Install it to continue.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const nextProvider = new BrowserProvider(window.ethereum);
      const accounts: string[] = await nextProvider.send("eth_requestAccounts", []);
      if (!accounts.length) {
        setError("No accounts were shared by MetaMask.");
        return;
      }
      const nextSigner = await nextProvider.getSigner();
      await syncWallet(await nextSigner.getAddress());
    } catch (err) {
      setError(isUserRejection(err) ? "Wallet connection rejected." : parseError(err));
    } finally {
      setIsConnecting(false);
    }
  }, [syncWallet]);

  /** Clears local state only — a dapp cannot revoke MetaMask's own permission. */
  const disconnect = useCallback(() => {
    reset();
    setError(null);
  }, [reset]);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }
    setError(null);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (err) {
      const code = (err as { code?: number }).code;
      if (code === CHAIN_NOT_ADDED) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID_HEX,
                chainName: "Sepolia",
                nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addErr) {
          setError(
            isUserRejection(addErr)
              ? "Network switch cancelled."
              : "Could not add Sepolia. Add it manually in MetaMask.",
          );
        }
        return;
      }
      setError(isUserRejection(err) ? "Network switch cancelled." : parseError(err));
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (accountRef.current) await readBalance(accountRef.current);
  }, [readBalance]);

  // Restore a session MetaMask already authorised, without prompting.
  useEffect(() => {
    const injected = window.ethereum;
    if (!injected) return;
    let cancelled = false;
    void (async () => {
      try {
        const existing = new BrowserProvider(injected);
        const accounts: string[] = await existing.send("eth_accounts", []);
        if (!cancelled && accounts.length) await syncWallet(accounts[0]);
      } catch (err) {
        console.error("[krypt] eager connect", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [syncWallet]);

  // A single subscription for the lifetime of the provider — never per render.
  useEffect(() => {
    const injected = window.ethereum;
    if (!injected) return;

    const onAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) reset();
      else void syncWallet(accounts[0]);
    };

    const onChainChanged = (nextChainId: string) => {
      setChainId(BigInt(nextChainId));
      setError(null);
      // The signer is bound to the old chain; rebuild it and the balance.
      if (accountRef.current) void syncWallet(accountRef.current);
    };

    injected.on("accountsChanged", onAccountsChanged);
    injected.on("chainChanged", onChainChanged);
    return () => {
      injected.removeListener("accountsChanged", onAccountsChanged);
      injected.removeListener("chainChanged", onChainChanged);
    };
  }, [reset, syncWallet]);

  const value = useMemo<WalletState>(
    () => ({
      account,
      isConnected: Boolean(account),
      balance,
      chainId,
      isCorrectNetwork,
      provider,
      signer,
      hasMetaMask,
      isConnecting,
      isLoadingBalance,
      error,
      connect,
      disconnect,
      switchToSepolia,
      refreshBalance,
      clearError,
    }),
    [
      account, balance, chainId, isCorrectNetwork, provider, signer, hasMetaMask,
      isConnecting, isLoadingBalance, error, connect, disconnect, switchToSepolia,
      refreshBalance, clearError,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
