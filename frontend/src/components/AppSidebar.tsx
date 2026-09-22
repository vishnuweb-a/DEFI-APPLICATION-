import { Icon, type IconName } from "./Icon";
export type DashboardView = "overview" | "wallet" | "send" | "transactions";
const navigation: { view: DashboardView; label: string; icon: IconName }[] = [
  { view: "overview", label: "Overview", icon: "layers" }, { view: "wallet", label: "My wallet", icon: "wallet" },
  { view: "send", label: "Send ETH", icon: "send" }, { view: "transactions", label: "Activity", icon: "activity" },
];
export function AppSidebar({ view }: { view: DashboardView }) {
  return <aside className="sidebar">
    <a className="brand" href="#overview" aria-label="Apna Wallet home"><img src="/apna.svg" width="44" height="44" alt="" /><span><strong>Apna Wallet</strong><small>Own More Together</small></span></a>
    <nav aria-label="Primary navigation" className="sidebar-nav">{navigation.map(item => <a key={item.view} href={`#${item.view}`} aria-label={item.label} aria-current={view === item.view ? "page" : undefined} className={view === item.view ? "nav-item active" : "nav-item"}><Icon name={item.icon} /><span>{item.label}</span></a>)}</nav>
    <div className="sidebar-story" aria-hidden="true"><span className="story-icon"><Icon name="cube" /></span><h2>Build together<br />onchain.</h2><p>Secure. Simple. Shared.</p><svg viewBox="0 0 240 70" className="waves">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M-20 ${35+i*3} C50 ${-10+i*5} 75 ${90-i*3} 140 ${35+i*2} S220 ${5+i*3} 270 ${30+i*3}`} />)}</svg></div>
  </aside>;
}
