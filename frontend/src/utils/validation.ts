import { isAddress, ZeroAddress, parseEther } from "ethers";
import type { TransferFormValues } from "../types";

export type FieldErrors = Partial<Record<keyof TransferFormValues, string>>;

export const MAX_MESSAGE_LENGTH = 200;
export const MAX_KEYWORD_LENGTH = 32;

export function validateTransfer(
  values: TransferFormValues,
  balance: bigint | null,
): FieldErrors {
  const errors: FieldErrors = {};
  const receiver = values.receiver.trim();

  if (!receiver) {
    errors.receiver = "Receiver address is required.";
  } else if (!isAddress(receiver)) {
    errors.receiver = "Not a valid Ethereum address.";
  } else if (receiver.toLowerCase() === ZeroAddress) {
    errors.receiver = "Cannot send to the zero address.";
  }

  const amount = values.amount.trim();
  if (!amount) {
    errors.amount = "Amount is required.";
  } else if (!/^\d*\.?\d*$/.test(amount)) {
    errors.amount = "Enter a valid number.";
  } else {
    let wei: bigint;
    try {
      wei = parseEther(amount);
    } catch {
      errors.amount = "Enter a valid ETH amount.";
      return errors;
    }
    if (wei <= 0n) {
      errors.amount = "Amount must be greater than zero.";
    } else if (balance !== null && wei > balance) {
      errors.amount = "Amount exceeds your wallet balance.";
    }
  }

  if (values.keyword.trim().length > MAX_KEYWORD_LENGTH) {
    errors.keyword = `Keep the keyword under ${MAX_KEYWORD_LENGTH} characters.`;
  }

  if (values.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Keep the message under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return errors;
}
