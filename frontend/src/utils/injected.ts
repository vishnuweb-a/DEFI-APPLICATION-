import type { InjectedProvider } from "../types/ethereum";

/**
 * Returns MetaMask's injected provider, or null when no usable one is present.
 *
 * A plain `window.ethereum` truthiness check is not enough. Browsers expose every
 * element carrying an `id` as a global property ("named access on the window
 * object"), so markup such as `<section id="ethereum">` makes `window.ethereum`
 * a DOM element. That element is truthy, passes a `if (!window.ethereum)` guard,
 * and then throws on the first `.request()`/`.on()` call — unmounting the app.
 *
 * Real wallets win the name on desktop, which hides the problem there and makes
 * it appear only on mobile, where no extension is installed. Verifying the
 * EIP-1193 shape keeps that class of collision from ever reaching ethers.
 */
export function getInjectedProvider(): InjectedProvider | null {
  if (typeof window === "undefined") return null;
  const candidate = window.ethereum as unknown;
  if (!candidate || typeof candidate !== "object") return null;
  // A DOM node is never a provider, whatever it happens to be named.
  if (typeof Node !== "undefined" && candidate instanceof Node) return null;
  if (typeof (candidate as InjectedProvider).request !== "function") return null;
  return candidate as InjectedProvider;
}

/** True when a usable EIP-1193 provider is available to connect to. */
export function hasInjectedProvider(): boolean {
  return getInjectedProvider() !== null;
}

/** Event subscription is optional in EIP-1193, so it is feature-detected. */
export function supportsEvents(
  provider: InjectedProvider,
): provider is InjectedProvider {
  return typeof provider.on === "function" && typeof provider.removeListener === "function";
}
