import assert from 'node:assert/strict';
import { createServer } from 'vite';

/**
 * Guards the named-access crash: markup like `<section id="ethereum">` makes
 * browsers expose that element as `window.ethereum`, which is truthy and so
 * slipped past `if (!window.ethereum)` before throwing on `.on()` and blanking
 * the page. Only reproduced without a wallet extension, i.e. on mobile.
 */
const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, appType: 'spa' });
const previousWindow = globalThis.window;
const previousNode = globalThis.Node;
try {
  await server.listen();
  const { getInjectedProvider, hasInjectedProvider, supportsEvents } =
    await server.ssrLoadModule('/src/utils/injected.ts');

  class FakeNode {}
  globalThis.Node = FakeNode;

  // A <section id="ethereum"> element must never be mistaken for a provider.
  const element = new FakeNode();
  element.tagName = 'SECTION';
  element.id = 'ethereum';
  globalThis.window = { ethereum: element };
  assert.equal(getInjectedProvider(), null, 'a DOM element is not a provider');
  assert.equal(hasInjectedProvider(), false, 'element must not count as a wallet');

  // No wallet at all.
  globalThis.window = {};
  assert.equal(getInjectedProvider(), null);
  assert.equal(hasInjectedProvider(), false);

  // Objects lacking the EIP-1193 request() method are rejected.
  globalThis.window = { ethereum: { on() {}, removeListener() {} } };
  assert.equal(getInjectedProvider(), null, 'request() is required');

  // A real MetaMask-shaped provider is accepted, events detected.
  const wallet = { request: async () => null, on() {}, removeListener() {} };
  globalThis.window = { ethereum: wallet };
  assert.equal(getInjectedProvider(), wallet, 'a real provider passes through');
  assert.equal(hasInjectedProvider(), true);
  assert.equal(supportsEvents(wallet), true);

  // A provider without the optional event surface must not crash callers.
  const eventless = { request: async () => null };
  globalThis.window = { ethereum: eventless };
  assert.equal(getInjectedProvider(), eventless);
  assert.equal(supportsEvents(eventless), false, 'events are optional in EIP-1193');

  console.log('PASS: injected provider rejects DOM elements from id-based named access, requires EIP-1193 request(), and treats events as optional.');
} finally {
  globalThis.window = previousWindow;
  globalThis.Node = previousNode;
  await server.close();
}
