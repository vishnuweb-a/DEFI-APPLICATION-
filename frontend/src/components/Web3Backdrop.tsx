export function Web3Backdrop() {
  return <div className="web3-scene" aria-hidden="true"><div className="editorial-note">A MORE OPEN<br />FINANCIAL FUTURE<br />TOGETHER.<span /></div>
    <svg className="globe" viewBox="0 0 1000 440" fill="none">
      <defs><radialGradient id="earth"><stop stopColor="#18181b" /><stop offset=".88" stopColor="#27272a" /><stop offset="1" stopColor="#71717a" /></radialGradient><pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#53b9c4" /></pattern><clipPath id="sphere"><circle cx="690" cy="445" r="285" /></clipPath><linearGradient id="landscape"><stop stopColor="#22d3ee" stopOpacity="0" /><stop offset=".6" stopColor="#22d3ee" stopOpacity=".2" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></linearGradient></defs>
      <g stroke="url(#landscape)">{Array.from({length: 14},(_,i)=><path key={i} d={`M0 ${320+i*12} Q150 ${220+i*15} 280 ${350+i*4} T1000 ${300+i*16}`} />)}</g>
      <ellipse cx="680" cy="340" rx="365" ry="194" transform="rotate(-29 680 340)" stroke="#28859d" strokeOpacity=".6" /><ellipse cx="680" cy="340" rx="310" ry="205" transform="rotate(35 680 340)" stroke="#28859d" strokeOpacity=".4" />
      <circle cx="690" cy="445" r="285" fill="url(#earth)" fillOpacity=".6" stroke="#5fc7d6" strokeOpacity=".7" />
      <g clipPath="url(#sphere)" stroke="#5ab7c5" strokeOpacity=".25"><circle cx="690" cy="445" r="279" fill="url(#dots)" />{[65,145,225].map(r=><ellipse key={r} cx="690" cy="445" rx={r} ry="285" />)}{[230,285,360,430].map(y=><ellipse key={y} cx="690" cy={y} rx="285" ry="35" />)}</g>
      <g transform="translate(510 139)"><circle r="27" fill="#18181b" stroke="#438dcb" /><path d="m0-19-11 20 11 7 11-7L0-19Zm-11 24 11 16 11-16-11 7-11-7Z" fill="#75bdf9" /></g>
      <g transform="translate(759 100)"><circle r="27" fill="#18181b" stroke="#42b6bc" /><path d="m-4 7 12-12m-10 2-4-4c-9-4-15 8-8 13l5 3m11-14 5-3c9-3 14 8 6 13l-4 2" stroke="#61dce1" strokeWidth="3" /></g>
      <g transform="translate(360 296)"><circle r="27" fill="#18181b" stroke="#9671dc" /><path d="m-10-8 8 4v9l-8 4-8-4v-9l8-4Zm17 6 8 4v9l-8 4-8-4V2l8-4Z" stroke="#b39aea" strokeWidth="2" /></g>
    </svg><div className="scene-caption">WALLETS<br />PEOPLE<br />PROGRESS<span /></div></div>;
}
