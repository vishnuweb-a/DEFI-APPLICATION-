import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, appType: 'spa' });
const previousWindow = globalThis.window;
const previousStorage = globalThis.localStorage;
try {
  await server.listen();
  const { isDashboardRoute } = await server.ssrLoadModule('/src/utils/routes.ts');
  assert.equal(isDashboardRoute('/', ''), false);
  for (const hash of ['#home', '#features', '#how-it-works', '#blockchain', '#faq', '#security']) {
    assert.equal(isDashboardRoute('/', hash), false, `${hash} must stay on the landing page`);
  }
  for (const hash of ['#overview', '#wallet', '#send', '#transactions', '#top']) {
    assert.equal(isDashboardRoute('/', hash), true, `${hash} must preserve old dashboard links`);
  }
  assert.equal(isDashboardRoute('/app', ''), true);
  assert.equal(isDashboardRoute('/app/', '#wallet'), true);
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const renderRoute = (pathname, hash = '') => {
    globalThis.window = { location: { pathname, hash } };
    return renderToStaticMarkup(createElement(App));
  };
  const landing = renderRoute('/');
  assert.match(landing, /Simple\. Secure\./);
  assert.match(landing, /data-theme="dark"/);
  assert.ok(!landing.includes('workspace-grid'));
  const ids = new Set([...landing.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of landing.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(match[1]), `Broken landing anchor: ${match[1]}`);
  }
  assert.equal([...landing.matchAll(/href="\/app"/g)].length, 4, 'Connect CTAs and the mobile launch link enter the existing app');
  assert.match(landing, /href="#how-it-works"[^>]*>.*?Watch Demo/);
  assert.match(landing, /aria-controls="landing-navigation" aria-expanded|aria-expanded="false" aria-controls="landing-navigation"/);
  assert.match(landing, /Sepolia Testnet/);
  assert.ok(!/50K\+|1M\+|100% secure|unhackable/.test(landing));
  for (const hash of ['', '#wallet', '#send', '#transactions']) {
    const dashboard = renderRoute('/app', hash);
    assert.match(dashboard, /Primary navigation/);
    assert.match(dashboard, /Install MetaMask/);
    assert.ok(!dashboard.includes('lp-hero'));
  }
  assert.match(renderRoute('/', '#send'), /Confirm the transaction|Connect your wallet to send a transfer/);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => 'light' } });
  assert.match(renderRoute('/'), /data-theme="light"/);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => { throw new Error('Storage unavailable'); } } });
  assert.match(renderRoute('/'), /data-theme="dark"/);
  const address = server.httpServer.address();
  for (const path of ['/', '/app', '/app/']) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /src\/main.tsx/);
  }
  console.log('PASS: landing/dashboard route rendering, legacy deep links, CTA destinations, section anchors, wallet installation state, theme restoration/storage fallback, and HTTP SPA routes.');
} finally {
  if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
  if (previousStorage === undefined) delete globalThis.localStorage;
  else Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage });
  await server.close();
}
