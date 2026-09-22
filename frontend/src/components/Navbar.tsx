import { useEffect, useRef } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { NetworkBadge } from "./NetworkBadge";
import { Icon } from "./Icon";

export function Navbar({ query, onSearch }: { query: string; onSearch: (value: string) => void }) {
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); search.current?.focus(); } };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <header className="topbar">
        <label className="search-box"><Icon name="search" /><input ref={search} type="search" aria-label="Search wallet features or transactions" placeholder="Search wallet features, addresses or transactions..." value={query} onChange={event => onSearch(event.target.value)} /><kbd>Ctrl K</kbd></label>
        <div className="topbar-actions">
          <NetworkBadge />
          <ConnectWallet />
        </div>
    </header>
  );
}
