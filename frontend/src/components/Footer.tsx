import { CONTRACT_ADDRESS, SEPOLIA_EXPLORER } from "../contracts/contract";
import { shortenAddress } from "../utils/address";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="logo">
          <span className="logo__mark" aria-hidden="true" />
          <span className="logo__text">Apna Wallet</span>
        </div>

        <p className="footer__note">
          Testnet only. Signing is handled entirely by MetaMask.
        </p>

        {CONTRACT_ADDRESS && (
          <a
            className="footer__contract"
            href={`${SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer noopener"
            title={CONTRACT_ADDRESS}
          >
            Contract {shortenAddress(CONTRACT_ADDRESS)} ↗
          </a>
        )}
      </div>
    </footer>
  );
}
