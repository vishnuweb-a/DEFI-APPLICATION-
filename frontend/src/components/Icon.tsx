export type IconName = "layers" | "wallet" | "activity" | "send" | "cube" | "arrow" | "search" | "plus" | "external";
const paths: Record<IconName, string> = {
  layers: "m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  wallet: "M3 6h16a2 2 0 0 1 2 2v11H3V5a2 2 0 0 1 2-2h12v3m4 5h-6v5h6m-3-2.5h.01",
  activity: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  send: "m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2",
  cube: "m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5m-9 5v10",
  arrow: "m9 5 7 7-7 7", search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  plus: "M12 5v14M5 12h14", external: "M14 3h7v7m0-7L10 14M10 3H3v18h18v-7",
};
export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
