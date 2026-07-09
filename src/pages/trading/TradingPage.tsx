import { useState, useEffect, useCallback } from 'react';
import { PriceChart } from './PriceChart';
import { OrderBook } from './OrderBook';
import { TradeForm } from './TradeForm';
import { useWebSocket } from '../../hooks/useWebSocket';
import { ChevronDown, Search, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../utils/api';

interface Order {
  id: string;
  pair: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  price: string;
  amount: string;
  filled_amount: string;
  status: string;
  created_at: string;
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'] as const;
type Timeframe = typeof TIMEFRAMES[number];

export default function TradingPage() {
  const [pair, setPair] = useState('BTCUSDT');
  const [pairs, setPairs] = useState<any[]>([]);
  const [isPairSelectorOpen, setIsPairSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [ticker, setTicker] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState('0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [interval, setInterval] = useState<Timeframe>('1h');
  const [activeTab, setActiveTab] = useState<'trade' | 'open' | 'history'>('trade');
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [walletBalances, setWalletBalances] = useState<Record<string, string>>({});
  const [walletLoading, setWalletLoading] = useState(true);

  // Order feedback
  const [orderFeedback, setOrderFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredPairs = pairs.filter(p =>
    p.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchKlines = useCallback(async (selectedPair: string, tf: Timeframe) => {
    try {
      const res = await api.get(`/market/klines/${selectedPair}`, {
        params: { interval: tf, limit: 200 }
      });
      const raw = res.data?.data || res.data || [];
      const formatted = raw.map((k: any) => ({
        time: k.time || k.open_time,
        open: parseFloat(k.open),
        high: parseFloat(k.high),
        low: parseFloat(k.low),
        close: parseFloat(k.close),
        volume: parseFloat(k.volume),
      }));
      setChartData(formatted);

      // Volume data for histogram (green if close >= open, red otherwise)
      const vol = formatted.map((k: any) => ({
        time: k.time,
        value: k.volume,
        color: k.close >= k.open ? '#26a69a33' : '#ef535033',
      }));
      setVolumeData(vol);
    } catch (err) {
      console.error('Failed to fetch klines:', err);
      setChartData([]);
      setVolumeData([]);
    }
  }, []);

  const fetchOrders = useCallback(async (status: 'open' | 'closed') => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders', { params: { status, limit: 50 } });
      const data = res.data?.data || res.data || [];
      if (status === 'open') setOpenOrders(data);
      else setOrderHistory(data);
    } catch (err) {
      console.error(`Failed to fetch ${status} orders:`, err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchWalletBalances = useCallback(async () => {
    setWalletLoading(true);
    try {
      const res = await api.get('/wallets');
      const wallets = res.data?.data || res.data || [];
      const balanceMap: Record<string, string> = {};
      wallets.forEach((w: any) => {
        balanceMap[w.asset] = w.available || w.balance || '0';
      });
      setWalletBalances(balanceMap);
    } catch (err) {
      console.error('Failed to fetch wallet balances:', err);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const fetchInitialData = useCallback(async (selectedPair: string) => {
    try {
      setIsLoading(true);
      const [pairsRes, bookRes, tradesRes, tickerRes] = await Promise.all([
        api.get('/market/pairs'),
        api.get(`/market/orderbook/${selectedPair}`),
        api.get(`/market/trades/${selectedPair}`),
        api.get(`/market/ticker/${selectedPair}`)
      ]);

      setPairs(pairsRes.data.data);
      setBids(bookRes.data.data.bids || []);
      setAsks(bookRes.data.data.asks || []);
      setTradeHistory(tradesRes.data.data || []);
      setTicker(tickerRes.data.data);
      setCurrentPrice(tickerRes.data.data.last_price || '0.00');
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData(pair);
    fetchKlines(pair, interval);
    fetchWalletBalances();
  }, [pair, fetchInitialData, fetchKlines, fetchWalletBalances]);

  useEffect(() => {
    fetchKlines(pair, interval);
  }, [interval, pair, fetchKlines]);

  // Fetch orders when switching to open/history tabs
  useEffect(() => {
    if (activeTab === 'open') fetchOrders('open');
    if (activeTab === 'history') fetchOrders('closed');
  }, [activeTab, fetchOrders]);

  // WebSocket
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://novabit-backend.onrender.com/ws';
  const { isConnected, sendMessage } = useWebSocket(wsUrl, {
    onOpen: () => {
      sendMessage({ type: 'subscribe', pair });
    },
    onMessage: (data) => {
      if (data.type === 'orderbook' && data.pair === pair) {
        setBids(data.bids);
        setAsks(data.asks);
      }
      if (data.type === 'trade' && data.pair === pair) {
        setCurrentPrice(data.price);
        setTradeHistory(prev => [data, ...prev].slice(0, 50));
      }
      if (data.type === 'ticker' && data.pair === pair) {
        setTicker(data);
      }
    },
    reconnect: true,
  });

  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'unsubscribe' });
      sendMessage({ type: 'subscribe', pair });
    }
  }, [pair, isConnected, sendMessage]);

  const handleTradeSubmit = async (data: any) => {
    try {
      const res = await api.post('/orders', { ...data, pair });
      setOrderFeedback({ type: 'success', message: 'Order placed successfully!' });
      // Refresh orders and balances
      fetchOrders('open');
      fetchWalletBalances();
      setTimeout(() => setOrderFeedback(null), 4000);
      return res.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to place order';
      setOrderFeedback({ type: 'error', message: msg });
      setTimeout(() => setOrderFeedback(null), 6000);
      throw error;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      fetchOrders('open');
    } catch (err) {
      console.error('Failed to cancel order:', err);
    }
  };

  const getBaseAsset = (p: string) => p.replace('USDT', '') || 'BTC';

  if (isLoading && pairs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const baseAsset = getBaseAsset(pair);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Bar: Pair Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors shrink-0"
          onClick={() => setIsPairSelectorOpen(true)}
        >
          <span className="font-bold text-xl">{pair}</span>
          <ChevronDown size={16} className="text-gray-400" />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        {ticker && (
          <div className="flex gap-4 lg:gap-6 flex-wrap">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Price</div>
              <div className={`text-lg font-bold leading-none ${parseFloat(ticker.change_24h) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${currentPrice}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Change</div>
              <div className={`text-sm font-bold ${parseFloat(ticker.change_24h) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ticker.change_24h > 0 ? '+' : ''}{ticker.change_24h_percent || ticker.change_24h}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h High</div>
              <div className="text-sm font-bold text-gray-900">${ticker.high_24h}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Low</div>
              <div className="text-sm font-bold text-gray-900">${ticker.low_24h}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Volume</div>
              <div className="text-sm font-bold text-gray-900">${ticker.volume_24h}</div>
            </div>
          </div>
        )}
      </div>

      {/* Order Feedback Toast */}
      {orderFeedback && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold animate-in slide-in-from-right ${
          orderFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {orderFeedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{orderFeedback.message}</span>
          <button onClick={() => setOrderFeedback(null)} className="ml-4 opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-0 border-b border-gray-200">
        {(['trade', 'open', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'trade' ? 'Trade' : tab === 'open' ? 'Open Orders' : 'Order History'}
          </button>
        ))}
      </div>

      {/* Trade View */}
      {activeTab === 'trade' && (
        <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Left: Chart */}
          <div className="flex-[3] flex flex-col gap-4 overflow-hidden">
            {/* Timeframe Selector */}
            <div className="flex gap-1 bg-gray-50 rounded-lg p-1 self-start">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setInterval(tf)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                    interval === tf
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 min-h-[450px]">
              {chartData.length > 0 ? (
                <PriceChart data={chartData} volumeData={volumeData} />
              ) : (
                <div className="flex items-center justify-center h-[450px] text-gray-400 font-medium">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Loading chart data...
                </div>
              )}
            </div>

            {/* Market Trades */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 overflow-auto max-h-[300px]">
              <h3 className="font-bold text-sm mb-4">Market Trades</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-gray-50 pb-2">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tradeHistory.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 text-gray-500">{new Date(t.trade_time).toLocaleTimeString()}</td>
                      <td className={`py-2 font-bold ${t.taker_side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.price}
                      </td>
                      <td className="py-2">{t.quantity}</td>
                      <td className="py-2 text-right text-gray-500">{t.quote_quantity}</td>
                    </tr>
                  ))}
                  {tradeHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">No recent trades.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Order Book & Trade Form */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-[320px]">
            <OrderBook bids={bids} asks={asks} pair={pair} />
            <TradeForm
              pair={pair}
              balance={{
                base: walletBalances[baseAsset] || '0.00',
                quote: walletBalances['USDT'] || '0.00',
              }}
              currentPrice={currentPrice}
              onSubmit={handleTradeSubmit}
              walletLoading={walletLoading}
            />
          </div>
        </div>
      )}

      {/* Open Orders Tab */}
      {activeTab === 'open' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-gray-400 border-b border-gray-100 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Pair</th>
                  <th className="px-6 py-4">Side</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Filled</th>
                  <th className="px-6 py-4 text-right">Time</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordersLoading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</td></tr>
                ) : openOrders.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No open orders.</td></tr>
                ) : (
                  openOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{o.pair}</td>
                      <td className={`px-6 py-4 font-bold ${o.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{o.side}</td>
                      <td className="px-6 py-4 text-gray-600">{o.type}</td>
                      <td className="px-6 py-4 text-right font-mono">{parseFloat(o.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-mono">{parseFloat(o.amount).toFixed(4)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono">{parseFloat(o.filled_amount).toFixed(4)}</span>
                          <span className="text-[10px] text-gray-400">/ {parseFloat(o.amount).toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="danger" className="text-[10px] px-3 py-1 rounded-full font-bold" onClick={() => handleCancelOrder(o.id)}>
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-gray-400 border-b border-gray-100 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Pair</th>
                  <th className="px-6 py-4">Side</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Filled</th>
                  <th className="px-6 py-4 text-right">Status</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordersLoading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</td></tr>
                ) : orderHistory.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No order history.</td></tr>
                ) : (
                  orderHistory.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{o.pair}</td>
                      <td className={`px-6 py-4 font-bold ${o.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{o.side}</td>
                      <td className="px-6 py-4 text-gray-600">{o.type}</td>
                      <td className="px-6 py-4 text-right font-mono">{parseFloat(o.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-mono">{parseFloat(o.amount).toFixed(4)}</td>
                      <td className="px-6 py-4 text-right font-mono">{parseFloat(o.filled_amount).toFixed(4)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          o.status === 'FILLED' ? 'bg-green-50 text-green-700' :
                          o.status === 'CANCELED' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">{new Date(o.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pair Selector Modal */}
      <Modal
        isOpen={isPairSelectorOpen}
        onClose={() => setIsPairSelectorOpen(false)}
        title="Select Trading Pair"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search pair..."
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
            {filteredPairs.map((p) => (
              <div
                key={p.symbol}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                onClick={() => {
                  setPair(p.symbol);
                  setIsPairSelectorOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{p.symbol}</span>
                  <span className="text-[10px] text-gray-400">Vol {p.volume_24h}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm font-mono">{p.last_price}</span>
                  <span className={`text-[10px] font-bold ${parseFloat(p.change_24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(p.change_24h) > 0 ? '+' : ''}{p.change_24h_percent || p.change_24h}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}