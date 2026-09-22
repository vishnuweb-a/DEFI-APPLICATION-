import { useCallback, useEffect, useRef, useState } from "react";
import { Contract, JsonRpcProvider, parseEther, type Result } from "ethers";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  requireContractAddress,
} from "../contracts/contract";
import type { TransferFormValues, TransferRecord, TxStatus } from "../types";
import { parseError } from "../utils/errors";
import { useWallet } from "./useWallet";

/**
 * Public Sepolia RPC used only for reads. It lets history and the counter render
 * before the user connects a wallet, and keeps reads working when MetaMask sits
 * on the wrong chain. Writes always go through the MetaMask signer.
 */
const READ_ONLY_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

const MISSING_ADDRESS_MESSAGE =
  "Missing contract address. Set VITE_CONTRACT_ADDRESS in frontend/.env and restart the dev server.";

interface SendResult {
  hash: string;
}

/** `getAllTransactions()` returns an array of structs; ethers hands them back as Results. */
function toRecords(raw: Result): TransferRecord[] {
  return raw.map((entry): TransferRecord => {
    const tx = entry as unknown as {
      sender: string;
      receiver: string;
      amount: bigint;
      message: string;
      keyword: string;
      timestamp: bigint;
    };
    return {
      sender: tx.sender,
      receiver: tx.receiver,
      amount: tx.amount,
      message: tx.message,
      keyword: tx.keyword,
      timestamp: tx.timestamp,
    };
  });
}

export function useTransactions() {
  const { provider, signer, isCorrectNetwork, refreshBalance, balance } = useWallet();

  const [transactions, setTransactions] = useState<TransferRecord[]>([]);
  const [transactionCount, setTransactionCount] = useState<bigint | null>(null);
  // A missing env var is knowable at render time, so it seeds the initial state
  // instead of being written from an effect.
  const [isLoadingHistory, setIsLoadingHistory] = useState(Boolean(CONTRACT_ADDRESS));
  const [historyError, setHistoryError] = useState<string | null>(
    CONTRACT_ADDRESS ? null : MISSING_ADDRESS_MESSAGE,
  );

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Guards a refresh triggered by an event from racing an in-flight refresh.
  const isRefreshing = useRef(false);

  /**
   * Reads prefer the wallet provider when it is on Sepolia, and otherwise fall
   * back to the public RPC so the page is never blank.
   */
  const getReadContract = useCallback((): Contract | null => {
    if (!CONTRACT_ADDRESS) return null;
    const readProvider =
      provider && isCorrectNetwork ? provider : new JsonRpcProvider(READ_ONLY_RPC);
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
  }, [provider, isCorrectNetwork]);

  const refreshHistory = useCallback(async () => {
    // Nothing to fetch without an address; the error is already seeded.
    if (!CONTRACT_ADDRESS || isRefreshing.current) return;
    isRefreshing.current = true;

    try {
      const contract = getReadContract();
      if (!contract) return;
      // Awaited first so the spinner flag is never set on the synchronous path.
      const [raw, count] = await Promise.all([
        contract.getAllTransactions() as Promise<Result>,
        contract.transactionCount() as Promise<bigint>,
      ]);
      setTransactions(toRecords(raw).reverse()); // newest first
      setTransactionCount(count);
      setHistoryError(null);
    } catch (err) {
      setHistoryError(parseError(err));
    } finally {
      setIsLoadingHistory(false);
      isRefreshing.current = false;
    }
  }, [getReadContract]);

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  /** Manual refresh: drives the button spinner, which the silent path does not. */
  const refreshHistoryWithSpinner = useCallback(async () => {
    setIsLoadingHistory(true);
    await refreshHistory();
  }, [refreshHistory]);

  /**
   * Live `Transfer` events. Subscriptions over the injected provider are polled
   * and can fail silently, so this is a nice-to-have on top of the explicit
   * refresh that runs after a confirmation.
   */
  useEffect(() => {
    if (!CONTRACT_ADDRESS || !provider || !isCorrectNetwork) return;

    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const onTransfer = () => {
      void refreshHistory();
    };

    void contract.on("Transfer", onTransfer).catch((err: unknown) => {
      console.warn("[krypt] Transfer subscription unavailable", err);
    });

    return () => {
      void contract.off("Transfer", onTransfer);
    };
  }, [provider, isCorrectNetwork, refreshHistory]);

  const resetSendState = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setSendError(null);
  }, []);

  const send = useCallback(
    async (values: TransferFormValues): Promise<SendResult | null> => {
      setSendError(null);
      setTxHash(null);

      if (!window.ethereum) {
        setSendError("MetaMask is not installed. Install it to continue.");
        setStatus("failed");
        return null;
      }
      if (!signer) {
        setSendError("Connect your wallet before sending.");
        setStatus("failed");
        return null;
      }
      if (!isCorrectNetwork) {
        setSendError(`Wrong network. Switch to Sepolia (chain ${SEPOLIA_CHAIN_ID}).`);
        setStatus("failed");
        return null;
      }

      try {
        const address = requireContractAddress();
        const value = parseEther(values.amount.trim());

        if (balance !== null && value > balance) {
          setSendError("Insufficient Sepolia ETH to cover the amount plus gas.");
          setStatus("failed");
          return null;
        }

        // Writes are signed by MetaMask — no key material touches this app.
        const contract = new Contract(address, CONTRACT_ABI, signer);

        setStatus("awaiting-wallet");
        const tx = await contract.sendTransaction(
          values.receiver.trim(),
          values.message.trim(),
          values.keyword.trim(),
          { value },
        );

        setTxHash(tx.hash);
        setStatus("pending");

        const receipt = await tx.wait();
        if (!receipt || receipt.status === 0) {
          setSendError("The transaction was mined but reverted.");
          setStatus("failed");
          return null;
        }

        setStatus("confirmed");
        await Promise.all([refreshHistory(), refreshBalance()]);
        return { hash: tx.hash };
      } catch (err) {
        setSendError(parseError(err));
        setStatus("failed");
        return null;
      }
    },
    [signer, isCorrectNetwork, balance, refreshHistory, refreshBalance],
  );

  return {
    transactions,
    transactionCount,
    isLoadingHistory,
    historyError,
    refreshHistory: refreshHistoryWithSpinner,
    status,
    txHash,
    sendError,
    send,
    resetSendState,
    isSending: status === "awaiting-wallet" || status === "pending",
  };
}
