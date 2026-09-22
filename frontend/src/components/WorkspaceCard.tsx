import type { CSSProperties } from "react";
import { Icon, type IconName } from "./Icon";

export interface WorkspaceItem {
  title: string;
  tag: string;
  meta: string;
  description: string;
  href?: string;
  icon: IconName;
  accent: string;
  character: number;
}

export function WorkspaceCard({ item }: { item: WorkspaceItem }) {
  const external = item.href?.startsWith("https");
  const style = { "--accent": item.accent } as CSSProperties;
  const content = <>
    {/* Isolate one portrait before applying a cover crop, avoiding adjacent-panel bleed. */}
    <svg className="character-art" viewBox={`${item.character * 543} 0 543 724`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <image href="/assets/wallet-characters/characters.png" width="2172" height="724" />
    </svg>
    <div className="workspace-shade" aria-hidden="true" />
    <div className="workspace-top">
      <span className="workspace-icon"><Icon name={item.icon} /></span>
      <span className="workspace-number" aria-hidden="true">0{item.character + 1}</span>
    </div>
    <div className="workspace-copy">
      <span className="workspace-tag">{item.tag}</span>
      <h2>{item.title}</h2>
      <p className="workspace-description">{item.description}</p>
      <div className="workspace-bottom">
        <span className="workspace-meta">{item.meta}</span>
        {item.href && <span className="workspace-arrow"><Icon name={external ? "external" : "arrow"} /></span>}
      </div>
    </div>
  </>;
  return item.href
    ? <a className="workspace-card" style={style} href={item.href} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>{content}</a>
    : <article className="workspace-card" style={style}>{content}</article>;
}
