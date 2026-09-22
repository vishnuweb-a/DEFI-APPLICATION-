import { useMemo, useState, type FormEvent } from "react";
import { SEPOLIA_EXPLORER } from "../contracts/contract";
import { useWallet } from "../hooks/useWallet";
import type { TransferFormValues, TxStatus } from "../types";
import { shortenAddress } from "../utils/address";
import { MAX_KEYWORD_LENGTH, MAX_MESSAGE_LENGTH, validateTransfer } from "../utils/validation";

const EMPTY: TransferFormValues = { receiver: "", amount: "", keyword: "", message: "" };

interface TransferFormProps {
  status: TxStatus;
  txHash: string | null;
  sendError: string | null;
  isSending: boolean;
  send: (values: TransferFormValues) => Promise<{ hash: string } | null>;
  resetSendState: () => void;
}

function buttonLabel(status: TxStatus): string {
  if (status === "awaiting-wallet") return "Waiting for MetaMask...";
  if (status === "pending") return "Confirming...";
  return "Send Now";
}

export function TransferForm({
  status,
  txHash,
  sendError,
  isSending,
  send,
  resetSendState,
}: TransferFormProps) {
  const { isConnected, isCorrectNetwork, balance, switchToSepolia, connect, hasMetaMask } =
    useWallet();
  const [values, setValues] = useState<TransferFormValues>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => validateTransfer(values, balance), [values, balance]);
  const isValid = Object.keys(errors).length === 0;

  const update = (field: keyof TransferFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (status === "confirmed" || status === "failed") resetSendState();
  };

  const markTouched = (field: keyof TransferFormValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const showError = (field: keyof TransferFormValues) =>
    touched[field] && errors[field] ? errors[field] : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched({ receiver: true, amount: true, keyword: true, message: true });
    if (!isValid || isSending) return;

    const result = await send(values);
    // Only clear the form once the chain actually confirmed the transfer.
    if (result) {
      setValues(EMPTY);
      setTouched({});
    }
  };

  const disabled = !isConnected || !isCorrectNetwork || !isValid || isSending;

  return (
    <form className="panel transfer" onSubmit={(e) => void handleSubmit(e)} noValidate>
      <div className="transfer__head">
        <h2>Send ETH</h2>
        <p>Transfers are recorded on-chain with your message and keyword.</p>
      </div>

      <label className="field">
        <span className="field__label">Receiver address</span>
        <input
          className={`input ${showError("receiver") ? "input--error" : ""}`}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="0x..."
          value={values.receiver}
          onChange={(e) => update("receiver", e.target.value)}
          onBlur={() => markTouched("receiver")}
          disabled={isSending}
        />
        {showError("receiver") && <span className="field__error">{errors.receiver}</span>}
      </label>

      <label className="field">
        <span className="field__label">Amount (ETH)</span>
        <input
          className={`input ${showError("amount") ? "input--error" : ""}`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.001"
          value={values.amount}
          onChange={(e) => update("amount", e.target.value)}
          onBlur={() => markTouched("amount")}
          disabled={isSending}
        />
        {showError("amount") && <span className="field__error">{errors.amount}</span>}
      </label>

      <label className="field">
        <span className="field__label">Keyword</span>
        <input
          className={`input ${showError("keyword") ? "input--error" : ""}`}
          type="text"
          autoComplete="off"
          placeholder="coffee"
          maxLength={MAX_KEYWORD_LENGTH}
          value={values.keyword}
          onChange={(e) => update("keyword", e.target.value)}
          onBlur={() => markTouched("keyword")}
          disabled={isSending}
        />
        {showError("keyword") && <span className="field__error">{errors.keyword}</span>}
      </label>

      <label className="field">
        <span className="field__label">Message</span>
        <textarea
          className={`input input--area ${showError("message") ? "input--error" : ""}`}
          rows={3}
          placeholder="Thanks for the coffee!"
          maxLength={MAX_MESSAGE_LENGTH}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => markTouched("message")}
          disabled={isSending}
        />
        {showError("message") && <span className="field__error">{errors.message}</span>}
      </label>

      {isConnected && !isCorrectNetwork && (
        <div className="notice notice--warn">
          <span>You are not on Sepolia. Switch networks to send.</span>
          <button type="button" className="btn btn--warn" onClick={() => void switchToSepolia()}>
            Switch to Sepolia
          </button>
        </div>
      )}

      {!isConnected && (
        <div className="notice">
          <span>Connect your wallet to send a transfer.</span>
          {hasMetaMask && (
            <button type="button" className="btn btn--ghost" onClick={() => void connect()}>
              Connect
            </button>
          )}
        </div>
      )}

      {status === "awaiting-wallet" && (
        <div className="notice notice--info">
          <span className="spinner" aria-hidden="true" />
          Confirm the transaction in MetaMask
        </div>
      )}

      {status === "pending" && (
        <div className="notice notice--info">
          <span className="spinner" aria-hidden="true" />
          Transaction pending...
        </div>
      )}

      {status === "confirmed" && (
        <div className="notice notice--ok">Transaction confirmed</div>
      )}

      {sendError && <div className="notice notice--error">{sendError}</div>}

      {txHash && (
        <div className="tx-hash">
          <span className="label">Transaction hash</span>
          <a
            href={`${SEPOLIA_EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="tx-hash__link"
          >
            {shortenAddress(txHash, 10, 8)}
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={disabled}>
        {isSending && <span className="spinner" aria-hidden="true" />}
        {buttonLabel(status)}
      </button>
    </form>
  );
}
