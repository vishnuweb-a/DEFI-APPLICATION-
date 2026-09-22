import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { WalletContext } = await server.ssrLoadModule('/src/context/WalletContext.tsx');
  const { TransactionCard } = await server.ssrLoadModule('/src/components/TransactionCard.tsx');
  const { TransferForm } = await server.ssrLoadModule('/src/components/TransferForm.tsx');
  const { NetworkBadge } = await server.ssrLoadModule('/src/components/NetworkBadge.tsx');
  const { ConnectWallet } = await server.ssrLoadModule('/src/components/ConnectWallet.tsx');
  const { TransactionHistory } = await server.ssrLoadModule('/src/components/TransactionHistory.tsx');
  const { WorkspaceCard } = await server.ssrLoadModule('/src/components/WorkspaceCard.tsx');
  const noop = () => {};
  const wallet = { account: null, isConnected: false, balance: null, chainId: null, isCorrectNetwork: false, hasMetaMask: true, isConnecting: false, isLoadingBalance: false, connect: noop, disconnect: noop, switchToSepolia: noop };
  const render = (Component, props = {}, overrides = {}) => renderToStaticMarkup(createElement(WalletContext.Provider, { value: { ...wallet, ...overrides } }, createElement(Component, props)));
  const sender = '0x1111111111111111111111111111111111111111';
  const receiver = '0x2222222222222222222222222222222222222222';
  const tx = render(TransactionCard, { tx: { sender, receiver, amount: 1250000000000000000n, timestamp: 1700000000n, message: '<script>unsafe</script>', keyword: 'test transfer' } });
  assert.match(tx, /1\.25 ETH/);
  assert.ok(tx.includes(`/address/${sender}`) && tx.includes(`/address/${receiver}`));
  assert.match(tx, /&lt;script&gt;unsafe&lt;\/script&gt;/);
  assert.match(tx, /transaction-avatar/);
  assert.ok(!tx.includes('/tx/'), 'History must not invent unavailable transaction hashes');
  const empty = render(TransactionHistory, { transactions: [], isLoading: false, error: null, onRefresh: noop });
  assert.match(empty, /No transactions yet/);
  const noMatch = render(TransactionHistory, { transactions: [], isLoading: false, error: null, onRefresh: noop, searchQuery: 'missing' });
  assert.match(noMatch, /No matching transactions/);
  assert.match(render(NetworkBadge), /Sepolia testnet/);
  assert.match(render(NetworkBadge, {}, { isConnected: true, isCorrectNetwork: false }), /Switch to Sepolia/);
  assert.match(render(ConnectWallet, {}, { account: sender, isConnected: true }), /0x1111\.\.\.1111/);
  assert.match(render(ConnectWallet, {}, { hasMetaMask: false }), /Install MetaMask/);
  const transferProps = { status: 'idle', txHash: null, sendError: null, isSending: false, send: async () => null, resetSendState: noop };
  assert.match(render(TransferForm, transferProps), /Connect your wallet to send a transfer/);
  for (const [status, expected] of [['awaiting-wallet', 'Confirm the transaction in MetaMask'], ['pending', 'Transaction pending'], ['confirmed', 'Transaction confirmed']]) {
    assert.ok(render(TransferForm, { ...transferProps, status, isSending: status !== 'confirmed' }).includes(expected));
  }
  assert.match(render(TransferForm, { ...transferProps, status: 'failed', sendError: 'User rejected request' }), /User rejected request/);
  const item = { title: 'Contract', tag: 'Smart contract', meta: 'Sepolia', description: 'Not configured', icon: 'cube', character: 3, accent: '#e4bd6d' };
  assert.ok(render(WorkspaceCard, { item }).startsWith('<article'), 'Unavailable contract must not have a fake action');
  assert.match(render(WorkspaceCard, { item: { ...item, href: '#wallet' } }), /href="#wallet"/);
  console.log('PASS: real transaction metadata, escaping, empty/search states, network and wallet states, transfer feedback, and card actions.');
} finally { await server.close(); }
