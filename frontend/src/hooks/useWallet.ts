import { useContext } from "react";
import { WalletContext, type WalletState } from "../context/WalletContext";

export function useWallet(): WalletState {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside a <WalletProvider>.");
  return context;
}
