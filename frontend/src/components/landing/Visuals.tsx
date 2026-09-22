import { LandingIcon } from "./Primitives";

export function HeroVisual() {
  return <div className="lp-hero-art" aria-hidden="true">
    <div className="lp-art-grid" />
    <svg viewBox="0 0 560 490" className="lp-stage" fill="none">
      <defs>
        <radialGradient id="hero-halo"><stop stopColor="#ffd84d" stopOpacity=".22" /><stop offset="1" stopColor="#ffd84d" stopOpacity="0" /></radialGradient>
        <linearGradient id="pedestal"><stop stopColor="#09090b" /><stop offset=".45" stopColor="#30302b" /><stop offset="1" stopColor="#09090b" /></linearGradient>
        <linearGradient id="gold-orb"><stop stopColor="#fff7c2" /><stop offset=".45" stopColor="#ffe36e" /><stop offset="1" stopColor="#9c6b13" /></linearGradient>
      </defs>
      <ellipse cx="295" cy="247" rx="230" ry="207" fill="url(#hero-halo)" />
      <g stroke="#f5c542" strokeWidth=".8"><ellipse cx="290" cy="230" rx="218" ry="67" transform="rotate(-21 290 230)" opacity=".6" /><ellipse cx="290" cy="225" rx="201" ry="63" transform="rotate(22 290 225)" opacity=".35" /></g>
      <circle cx="199" cy="80" r="23" fill="url(#gold-orb)" />
      <circle cx="473" cy="180" r="3" fill="#ffe36e" />
      <ellipse cx="292" cy="435" rx="192" ry="27" stroke="#f5c542" opacity=".18" />
      <path d="M124 382v40c0 38 336 38 336 0v-40" fill="url(#pedestal)" stroke="#f5c542" strokeOpacity=".3" />
      <ellipse cx="292" cy="382" rx="168" ry="23" fill="#18181b" stroke="#f5c542" strokeOpacity=".75" />
      <ellipse cx="292" cy="382" rx="132" ry="15" stroke="#f5c542" strokeOpacity=".25" />
      <ellipse cx="292" cy="382" rx="91" ry="9" stroke="#f5c542" strokeOpacity=".3" />
      <text x="292" y="423" fill="#fafafa" textAnchor="middle" fontFamily="Georgia,serif" fontSize="23">Apna Wallet</text>
    </svg>
    <img className="lp-mascot" src="/apna.svg" width="280" height="280" alt="" />
    <span className="lp-art-label lp-art-label--keys">Your keys.<br />Your crypto.</span>
    <span className="lp-art-label lp-art-label--eth"><svg width="22" height="36" viewBox="0 0 24 40"><path fill="#ffe36e" d="M12 0 0 21l12 7 12-7L12 0Zm-12 25 12 15 12-15-12 7-12-7Z" /></svg>Built on<br />Ethereum</span>
    <span className="lp-art-tile lp-art-tile--lock"><LandingIcon name="lock" /></span>
    <span className="lp-art-tile lp-art-tile--send"><LandingIcon name="send" /></span>
    <span className="lp-art-note">More freedom.<br />Together.</span>
  </div>;
}

export function EthereumVisual() {
  return <div className="lp-ethereum-art" aria-hidden="true">
    <div className="lp-art-grid" />
    <svg viewBox="0 0 520 400" fill="none">
      <defs><linearGradient id="eth-gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8cf" /><stop offset=".5" stopColor="#ffe36e" /><stop offset="1" stopColor="#9b6d13" /></linearGradient></defs>
      <g stroke="#f5c542" strokeOpacity=".5"><path d="m105 100 155 95 155-95M105 300l155-105 155 105M260 195v115" /></g>
      {[ [105,100], [415,100], [105,300], [415,300] ].map(([x,y]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><path d="m0-26 29 16v34L0 40-29 24v-34Z" fill="#202023" stroke="#71717a" /><path d="m-29-10 29 17 29-17M0 7v33" stroke="#71717a" /><path d="m0-20 17 10L0 0-17-10Z" fill="#ffe36e" fillOpacity=".2" stroke="#f5c542" /></g>)}
      <path d="m260 218 75 40v36l-75 40-75-40v-36Z" fill="#202023" stroke="#a17d26" /><path d="m185 258 75 41 75-41m-75 41v35" stroke="#a17d26" />
      <ellipse cx="260" cy="261" rx="51" ry="17" fill="#f5c542" fillOpacity=".13" />
      <path d="m260 55-62 111 62 37 62-37L260 55Z" fill="url(#eth-gold)" stroke="#fff0b0" /><path d="m260 55 0 148 62-37L260 55Z" fill="#b88e25" fillOpacity=".7" /><path d="m198 166 62-29 62 29-62 37-62-37Z" fill="#09090b" fillOpacity=".35" />
      <path d="m198 180 62 89 62-89-62 37-62-37Z" fill="url(#eth-gold)" stroke="#ffe36e" /><path d="m260 217 62-37-62 89v-52Z" fill="#a17d26" />
    </svg>
    <span className="lp-node lp-node--one">DeFi</span><span className="lp-node lp-node--two">NFTs</span><span className="lp-node lp-node--three">Smart<br />contracts</span><span className="lp-node lp-node--four">Global<br />ecosystem</span>
  </div>;
}

export function GlobeVisual() {
  return <svg className="lp-globe" viewBox="0 0 640 340" fill="none" aria-hidden="true">
    <defs><pattern id="lp-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#f5c542" /></pattern><clipPath id="lp-sphere"><circle cx="410" cy="325" r="260" /></clipPath></defs>
    <g clipPath="url(#lp-sphere)"><circle cx="410" cy="325" r="260" fill="url(#lp-dots)" fillOpacity=".5" /><g stroke="#f5c542" strokeOpacity=".45"><circle cx="410" cy="325" r="260" />{[80,160,230].map(r => <ellipse key={r} cx="410" cy="325" rx={r} ry="260" />)}{[120,180,250,320].map(y => <ellipse key={y} cx="410" cy={y} rx="260" ry="35" />)}</g></g><ellipse cx="390" cy="285" rx="325" ry="125" transform="rotate(-25 390 285)" stroke="#f5c542" strokeOpacity=".5" />
  </svg>;
}

