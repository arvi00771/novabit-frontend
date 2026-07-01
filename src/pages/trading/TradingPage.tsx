import { useState, useEffect, useCallback } from 'react';
import { PriceChart } from './PriceChart';
import { OrderBook } from './OrderBook';
import { TradeForm } from './TradeForm';
import { useWebSocket } from '../../hooks/useWebSocket';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../utils/api';

// Pairs will be fetched from the API

const MOCK_CHART_DATA = [
  { time: '2024-01-01', open: 42000.00, high: 43500.00, low: 41800.00, close: 43200.00 },
  { time: '2024-01-02', open: 43200.00, high: 44100.00, low: 42900.00, close: 43800.00 },
  { time: '2024-01-03', open: 43800.00, high: 45000.00, low: 43500.00, close: 44500.00 },
  { time: '2024-01-04', open: 44500.00, high: 44800.00, low: 43200.00, close: 43600.00 },
  { time: '2024-01-05', open: 43600.00, high: 44200.00, low: 43100.00, close: 43900.00 },
];

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

  const filteredPairs = pairs.filter(p => 
    p.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  }, [pair, fetchInitialData]);

  // WebSocket URL would come from env config
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
  
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
      const res = await api.post('/orders', {
        ...data,
        pair
      });
      console.log('Order placed:', res.data.data);
      // Maybe show a success toast here
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  if (isLoading && pairs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Bar: Pair Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-8 shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => setIsPairSelectorOpen(true)}
        >
          <span className="font-bold text-xl">{pair}</span>
          <ChevronDown size={16} className="text-gray-400" />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        
        {ticker && (
          <div className="flex gap-8">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Price</div>
              <div className={`text-lg font-bold leading-none ${ticker.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPrice}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Change</div>
              <div className={`text-sm font-bold ${ticker.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ticker.change_24h > 0 ? '+' : ''}{ticker.change_24h_percent}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h High</div>
              <div className="text-sm font-bold text-gray-900">{ticker.high_24h}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Low</div>
              <div className="text-sm font-bold text-gray-900">{ticker.low_24h}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">24h Volume</div>
              <div className="text-sm font-bold text-gray-900">{ticker.volume_24h}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left: Chart */}
        <div className="flex-[3] flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm min-h-[450px]">
            <PriceChart data={MOCK_CHART_DATA} />
          </div>
          
          {/* Recent Trades */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 overflow-auto">
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
            balance={{ base: '0.00', quote: '0.00' }} 
            currentPrice={currentPrice}
            onSubmit={handleTradeSubmit}
          />
        </div>
      </div>

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
                  <span className={`text-[10px] font-bold ${p.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {p.change_24h > 0 ? '+' : ''}{p.change_24h_percent}%
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
