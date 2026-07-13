import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Copy, CheckCircle2, Clock, XCircle, ChevronLeft,
  AlertTriangle, RefreshCw, Banknote, CreditCard,
  Landmark, Wallet, Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

// ── Types ───────────────────────────────────────
interface SupportedCoin {
  asset: string;
  name: string;
  network: string;
  is_active: boolean;
  min_deposit_amount: string;
  min_withdrawal_amount: string;
  withdrawal_fee: string;
  withdrawal_fee_type: string;
  required_confirmations: number;
  deposit_enabled: boolean;
  withdrawal_enabled: boolean;
  withdrawal_requires_2fa: boolean;
}

interface DepositInfo {
  address: string;
  network: string;
  memo: string | null;
  asset: string;
  min_deposit_amount: string;
  required_confirmations: number;
  coin_name: string;
}

interface DepositTx {
  id: string;
  type: string;
  status: string;
  asset: string;
  amount: string;
  fee: string;
  tx_hash: string | null;
  destination_address: string | null;
  source_address: string | null;
  created_at: string;
  confirmed_at: string | null;
}

// ── Fallback coins when API is unavailable ──────
const FALLBACK_COINS: SupportedCoin[] = [
  { asset: 'BTC', name: 'Bitcoin', network: 'NATIVE', is_active: true, min_deposit_amount: '0.0001', min_withdrawal_amount: '0.001', withdrawal_fee: '0.0005', withdrawal_fee_type: 'fixed', required_confirmations: 2, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'ETH', name: 'Ethereum', network: 'ERC20', is_active: true, min_deposit_amount: '0.01', min_withdrawal_amount: '0.05', withdrawal_fee: '0.005', withdrawal_fee_type: 'fixed', required_confirmations: 12, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'USDT', name: 'Tether', network: 'ERC20', is_active: true, min_deposit_amount: '10', min_withdrawal_amount: '20', withdrawal_fee: '5', withdrawal_fee_type: 'fixed', required_confirmations: 12, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'USDT', name: 'Tether', network: 'BEP20', is_active: true, min_deposit_amount: '5', min_withdrawal_amount: '10', withdrawal_fee: '1', withdrawal_fee_type: 'fixed', required_confirmations: 15, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'USDT', name: 'Tether', network: 'TRC20', is_active: true, min_deposit_amount: '5', min_withdrawal_amount: '10', withdrawal_fee: '1', withdrawal_fee_type: 'fixed', required_confirmations: 20, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'SOL', name: 'Solana', network: 'SOL', is_active: true, min_deposit_amount: '0.1', min_withdrawal_amount: '0.5', withdrawal_fee: '0.01', withdrawal_fee_type: 'fixed', required_confirmations: 1, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'ADA', name: 'Cardano', network: 'ADA', is_active: true, min_deposit_amount: '5', min_withdrawal_amount: '10', withdrawal_fee: '1', withdrawal_fee_type: 'fixed', required_confirmations: 3, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'DOGE', name: 'Dogecoin', network: 'NATIVE', is_active: true, min_deposit_amount: '10', min_withdrawal_amount: '50', withdrawal_fee: '1', withdrawal_fee_type: 'fixed', required_confirmations: 2, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'DOT', name: 'Polkadot', network: 'DOT', is_active: true, min_deposit_amount: '1', min_withdrawal_amount: '5', withdrawal_fee: '0.1', withdrawal_fee_type: 'fixed', required_confirmations: 1, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'LINK', name: 'Chainlink', network: 'ERC20', is_active: true, min_deposit_amount: '1', min_withdrawal_amount: '5', withdrawal_fee: '0.5', withdrawal_fee_type: 'fixed', required_confirmations: 12, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
  { asset: 'AVAX', name: 'Avalanche', network: 'AVAX', is_active: true, min_deposit_amount: '0.1', min_withdrawal_amount: '0.5', withdrawal_fee: '0.05', withdrawal_fee_type: 'fixed', required_confirmations: 1, deposit_enabled: true, withdrawal_enabled: true, withdrawal_requires_2fa: true },
];

// ── Network info helper ─────────────────────────
const NETWORK_META: Record<string, { name: string; short: string; explorer?: string }> = {
  ERC20: { name: 'Ethereum (ERC-20)', short: 'ERC-20' },
  BEP20: { name: 'Binance Smart Chain (BEP-20)', short: 'BEP-20' },
  TRC20: { name: 'Tron (TRC-20)', short: 'TRC-20' },
  NATIVE: { name: 'Native Network', short: 'Native' },
  SOL: { name: 'Solana', short: 'Solana' },
  ADA: { name: 'Cardano', short: 'Cardano' },
  XRP: { name: 'XRP Ledger', short: 'XRP' },
  DOT: { name: 'Polkadot', short: 'Polkadot' },
  POLYGON: { name: 'Polygon', short: 'Polygon' },
  ARBITRUM: { name: 'Arbitrum', short: 'Arbitrum' },
  OPTIMISM: { name: 'Optimism', short: 'Optimism' },
  AVAX: { name: 'Avalanche C-Chain', short: 'Avalanche' },
};

// Group coins by asset symbol for multi-network support
function groupCoinsByAsset(coins: SupportedCoin[]): { asset: string; name: string; networks: SupportedCoin[] }[] {
  const map = new Map<string, { name: string; networks: SupportedCoin[] }>();
  for (const coin of coins) {
    if (!map.has(coin.asset)) {
      map.set(coin.asset, { name: coin.name, networks: [] });
    }
    map.get(coin.asset)!.networks.push(coin);
  }
  return Array.from(map.entries())
    .map(([asset, val]) => ({ asset, name: val.name, networks: val.networks }))
    .sort((a, b) => a.asset.localeCompare(b.asset));
}

// ── Deposit Page Component ──────────────────────
export default function DepositPage() {
  // Tab state: 'crypto' | 'fiat'
  const [activeTab, setActiveTab] = useState<'crypto' | 'fiat'>('crypto');

  // Coin & network
  const [coins, setCoins] = useState<SupportedCoin[]>([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [coinsError, setCoinsError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');

  // Deposit address
  const [depositInfo, setDepositInfo] = useState<DepositInfo | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Clipboard
  const [isCopied, setIsCopying] = useState(false);

  // Deposit history
  const [history, setHistory] = useState<DepositTx[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // ── Fetch supported coins on mount ────────────
  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setCoinsLoading(true);
    setCoinsError(null);
    try {
      const res = await api.get('/wallets/coins');
      const coinList: SupportedCoin[] = res.data.data || [];
      setCoins(coinList);

      // Auto-select first coin with deposit enabled
      const first = coinList.find((c) => c.deposit_enabled);
      if (first) {
        setSelectedAsset(first.asset);
        setSelectedNetwork(first.network);
      }
    } catch (err: any) {
      console.error('Failed to fetch coins:', err);
      // Use fallback coins when API is unavailable
      if (err.response?.status === 401) {
        setCoinsError('Please log in to view coins.');
        return;
      }
      setCoins(FALLBACK_COINS);
      const first = FALLBACK_COINS.find((c) => c.deposit_enabled);
      if (first) {
        setSelectedAsset(first.asset);
        setSelectedNetwork(first.network);
      }
    } finally {
      setCoinsLoading(false);
    }
  };

  // Get unique assets for the sidebar
  const coinGroups = groupCoinsByAsset(coins);
  const selectedGroup = coinGroups.find((g) => g.asset === selectedAsset);

  // When selected asset changes, pick first available network
  useEffect(() => {
    if (selectedGroup && selectedGroup.networks.length > 0) {
      const firstEnabled = selectedGroup.networks.find((n) => n.deposit_enabled);
      if (firstEnabled) {
        setSelectedNetwork(firstEnabled.network);
      }
    }
  }, [selectedAsset]);

  // ── Fetch wallet balance when selected asset changes ──
  useEffect(() => {
    if (selectedAsset) {
      fetchBalance(selectedAsset);
    }
  }, [selectedAsset]);

  const fetchBalance = async (asset: string) => {
    setBalanceLoading(true);
    setWalletBalance(null);
    try {
      const res = await api.get(`/wallets/${asset}`);
      setWalletBalance(res.data.data?.available_balance || res.data.data?.balance || '0');
    } catch (err: any) {
      // Silently fail — balance display is non-critical
      if (err.response?.status !== 401) {
        console.error('Failed to fetch wallet balance:', err);
      }
      setWalletBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  // ── Fetch deposit address when asset/network changes ──
  useEffect(() => {
    if (selectedAsset && selectedNetwork) {
      fetchDepositInfo(selectedAsset, selectedNetwork);
    }
  }, [selectedAsset, selectedNetwork]);

  const fetchDepositInfo = async (asset: string, network: string) => {
    setAddressLoading(true);
    setAddressError(null);
    setDepositInfo(null);
    try {
      // Use the enhanced endpoint that also returns required_confirmations and coin_name
      const res = await api.get(`/wallets/deposit/${asset}`, {
        params: { network },
      });
      setDepositInfo(res.data.data);
    } catch (err: any) {
      console.error('Failed to fetch deposit address:', err);
      setAddressError(err.response?.data?.message || 'Unable to generate deposit address. Please try again.');
    } finally {
      setAddressLoading(false);
    }
  };

  // ── Fetch deposit history ─────────────────────
  useEffect(() => {
    if (selectedAsset) {
      fetchHistory(selectedAsset);
    }
  }, [selectedAsset]);

  // Separate fetch function so it can be called on polling
  const fetchHistory = useCallback(async (asset: string) => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/transactions', {
        params: { type: 'DEPOSIT', asset, limit: 20 },
      });
      setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch deposit history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Polling: refresh history every 10 seconds ──
  useEffect(() => {
    if (!selectedAsset || activeTab !== 'crypto') return;

    const interval = setInterval(() => {
      fetchHistory(selectedAsset);
    }, 10_000);

    return () => clearInterval(interval);
  }, [selectedAsset, activeTab, fetchHistory]);

  // ── Clipboard copy ────────────────────────────
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  // ── Status badge ──────────────────────────────
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case 'PENDING':
      case 'CONFIRMING':
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-[10px] font-bold">
            <Clock size={12} /> Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-[10px] font-bold">
            <XCircle size={12} /> Failed
          </span>
        );
      default:
        return (
          <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  // ── Get network metadata ──────────────────────
  const networkMeta = (network: string) => NETWORK_META[network] || { name: network, short: network };

  // ── Render ─────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/wallet">
            <Button variant="ghost" size="icon">
              <ChevronLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Deposit</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCoins} disabled={coinsLoading}>
          <RefreshCw size={14} className={coinsLoading ? 'animate-spin' : ''} />
          <span className="ml-1.5">Refresh</span>
        </Button>
      </div>

      {/* Tab Bar: Crypto / Fiat */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'crypto'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wallet size={16} />
          Crypto
        </button>
        <button
          onClick={() => setActiveTab('fiat')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'fiat'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Banknote size={16} />
          Fiat
        </button>
      </div>

      {activeTab === 'crypto' ? (
        <CryptoDeposit
          coins={coins}
          coinsLoading={coinsLoading}
          coinsError={coinsError}
          coinGroups={coinGroups}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          depositInfo={depositInfo}
          addressLoading={addressLoading}
          addressError={addressError}
          onRetryAddress={() => fetchDepositInfo(selectedAsset, selectedNetwork)}
          history={history}
          historyLoading={historyLoading}
          copyToClipboard={copyToClipboard}
          isCopied={isCopied}
          getStatusBadge={getStatusBadge}
          networkMeta={networkMeta}
        />
      ) : (
        <FiatDeposit />
      )}
    </div>
  );
}

// ── Crypto Deposit Sub-component ─────────────────
function CryptoDeposit({
  coins, coinsLoading, coinsError, coinGroups,
  selectedAsset, setSelectedAsset,
  selectedNetwork, setSelectedNetwork,
  depositInfo, addressLoading, addressError, onRetryAddress,
  history, historyLoading, copyToClipboard, isCopied,
  getStatusBadge, networkMeta,
}: {
  coins: SupportedCoin[];
  coinsLoading: boolean;
  coinsError: string | null;
  coinGroups: { asset: string; name: string; networks: SupportedCoin[] }[];
  selectedAsset: string;
  setSelectedAsset: (a: string) => void;
  selectedNetwork: string;
  setSelectedNetwork: (n: string) => void;
  depositInfo: DepositInfo | null;
  addressLoading: boolean;
  addressError: string | null;
  onRetryAddress: () => void;
  history: DepositTx[];
  historyLoading: boolean;
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
  getStatusBadge: (status: string) => JSX.Element;
  networkMeta: (network: string) => { name: string; short: string; explorer?: string };
}) {
  const selectedGroup = coinGroups.find((g) => g.asset === selectedAsset);

  // Loading state
  if (coinsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="text-sm">Loading supported coins...</p>
      </div>
    );
  }

  // Error state
  if (coinsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={40} className="text-red-400 mb-4" />
        <p className="text-sm text-red-600 mb-4">{coinsError}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Empty state
  if (coinGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Wallet size={40} className="mb-4 opacity-50" />
        <p className="text-sm">No supported coins available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Coin Selection */}
      <Card title="Select Coin" className="md:col-span-1 h-fit">
        <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
          {coinGroups.map((group) => {
            const enabled = group.networks.some((n) => n.deposit_enabled);
            return (
              <button
                key={group.asset}
                onClick={() => enabled && setSelectedAsset(group.asset)}
                disabled={!enabled}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  !enabled
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : selectedAsset === group.asset
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-100 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{group.name}</span>
                  {group.networks.length > 1 && (
                    <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-mono">
                      {group.networks.length}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${enabled ? 'opacity-60' : ''}`}>
                  {group.asset}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Right: Deposit Details */}
      <div className="md:col-span-2 space-y-6">
        <Card className="flex flex-col items-center py-8">
          <div className="w-full max-w-xs space-y-6 text-center">
            {/* Coin + Network Selection */}
            {selectedGroup && selectedGroup.networks.length > 1 && (
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Select Network
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedGroup.networks
                    .filter((n) => n.deposit_enabled)
                    .map((n) => {
                      const meta = networkMeta(n.network);
                      const isSelected = selectedNetwork === n.network;
                      return (
                        <button
                          key={n.network}
                          onClick={() => setSelectedNetwork(n.network)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {meta.short}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Address/QR Error State */}
            {addressError && !addressLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
                <p className="text-xs text-red-700 mb-3">{addressError}</p>
                <Button variant="outline" size="sm" onClick={onRetryAddress}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {addressLoading && (
              <div className="py-8 flex flex-col items-center">
                <Loader2 size={36} className="animate-spin text-blue-500 mb-4" />
                <p className="text-xs text-gray-400">Generating deposit address...</p>
              </div>
            )}

            {/* Deposit Address Display */}
            {!addressLoading && !addressError && depositInfo && (
              <>
                <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <QRCodeSVG
                      value={
                        depositInfo.asset === 'BTC'
                          ? `bitcoin:${depositInfo.address}?label=NovaBit`
                          : depositInfo.asset === 'ETH' || depositInfo.network === 'ERC20'
                          ? `ethereum:${depositInfo.address}`
                          : depositInfo.address
                      }
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                    Your {depositInfo.coin_name || depositInfo.asset} Deposit Address
                  </p>
                  <div className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border border-gray-200">
                    <span className="flex-1 text-xs font-mono break-all line-clamp-2">
                      {depositInfo.address}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => copyToClipboard(depositInfo.address)}
                    >
                      {isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    </Button>
                  </div>

                  {/* Memo/Destination Tag */}
                  {depositInfo.memo && (
                    <div className="mt-4 w-full">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">
                        Destination Tag / Memo
                      </p>
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <span className="flex-1 text-xs font-mono break-all">{depositInfo.memo}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={() => copyToClipboard(depositInfo.memo!)}
                        >
                          {isCopied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Minimum Deposit</p>
                    <p className="text-sm font-bold text-gray-900">
                      {depositInfo.min_deposit_amount} {depositInfo.asset}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Network</p>
                    <p className="text-sm font-bold text-gray-900">
                      {networkMeta(depositInfo.network).short}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Confirmations Required</p>
                    <p className="text-sm font-bold text-gray-900">{depositInfo.required_confirmations}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Deposit Status</p>
                    <p className="text-sm font-bold text-green-600">Enabled</p>
                  </div>
                </div>

                {/* Warning Notice */}
                <div className="bg-blue-50 p-4 rounded-lg text-left border border-blue-100">
                  <h4 className="text-blue-800 text-xs font-bold mb-1">Important</h4>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Send only {depositInfo.coin_name || depositInfo.asset} ({depositInfo.asset}) to this address on the{' '}
                    <strong>{networkMeta(depositInfo.network).name}</strong> network.
                    Sending any other asset or using a different network may result in permanent loss.
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Deposit History */}
        <Card
          title={`${selectedAsset} Deposit History`}
          subtitle="Updates automatically every 10 seconds"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Confirmations</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyLoading && history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <Loader2 size={20} className="animate-spin text-gray-300 mx-auto" />
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium">
                        {tx.amount} {tx.asset}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {tx.status === 'CONFIRMED' || tx.status === 'COMPLETED' ? (
                          <span className="text-green-600 font-bold">Completed</span>
                        ) : tx.status === 'CONFIRMING' ? (
                          <span className="text-yellow-600">Confirming...</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-center flex justify-center">
                        {getStatusBadge(tx.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 text-xs italic">
                      No recent deposits found. Send funds to the address above to see them here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Fiat Deposit Sub-component ───────────────────
function FiatDeposit() {
  const [fiatTab, setFiatTab] = useState<'bank' | 'card'>('bank');

  return (
    <div className="space-y-6">
      {/* Fiat Method Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFiatTab('bank')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            fiatTab === 'bank'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Landmark size={16} />
          Bank Transfer
        </button>
        <button
          onClick={() => setFiatTab('card')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            fiatTab === 'card'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard size={16} />
          Card / Instant
        </button>
      </div>

      {fiatTab === 'bank' ? (
        <Card>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Landmark size={24} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 text-sm mb-1">SEPA Bank Transfer</h3>
                <p className="text-xs text-blue-700">
                  Transfer EUR from any SEPA bank account. Funds are credited after 1–2 business days once the transfer clears.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Beneficiary Name</p>
                  <p className="text-sm font-bold text-gray-900">NovaBit Exchange OÜ</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">IBAN</p>
                  <p className="text-sm font-mono font-bold text-gray-900">EE38 2200 2210 1234 5678</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">BIC / SWIFT</p>
                  <p className="text-sm font-mono font-bold text-gray-900">LHVBEE22</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Bank Name</p>
                  <p className="text-sm font-bold text-gray-900">LHV Pank</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="text-amber-800 text-xs font-bold mb-2 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                Deposit Reference Required
              </h4>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Include your account email as the payment reference so we can credit your account.
                Transfers without a valid reference may be delayed or returned.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Card Deposit — Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">
              We're working on integrating credit/debit card deposits and instant payment methods.
              You'll be able to deposit EUR, USD, and more directly with your card.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={14} />
              <span>Expected launch: Q3 2026</span>
            </div>
          </div>
        </Card>
      )}

      {/* Fiat Deposit History */}
      <Card title="Fiat Deposit History">
        <div className="py-8 text-center text-gray-400 text-xs italic">
          No fiat deposit history yet.
        </div>
      </Card>
    </div>
  );
}
