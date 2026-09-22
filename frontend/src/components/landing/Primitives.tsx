import { Icon, type IconName } from "../Icon";

export type LandingIconName = IconName | "shield" | "moon" | "sun" | "menu" | "close" | "book" | "play" | "lock";
const paths: Partial<Record<LandingIconName, string>> = {
  shield: "M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7l-9-4Zm-4 9 3 3 5-6",
  moon: "M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6",
  book: "M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1m0-16c4-3 8-2 10-1v16c-4-2-7-1-10 1V5Z",
  play: "m9 7 8 5-8 5V7Zm13 5a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5V10Zm7 4v3",
};
export function LandingIcon({ name }: { name: LandingIconName }) {
  return paths[name] ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg> : <Icon name={name as IconName} />;
}
export function AppLink({ arrow = false }: { arrow?: boolean }) {
  return <a className="lp-button lp-button--gold" href="/app"><LandingIcon name="wallet" />Connect Wallet{arrow && <span aria-hidden="true">→</span>}</a>;
}
export function LandingBrand() {
  return <a className="lp-brand" href="/" aria-label="Apna Wallet home"><img src="/apna.svg" width="42" height="42" alt="" /><span>Apna Wallet<small>Own More Together</small></span></a>;
}
