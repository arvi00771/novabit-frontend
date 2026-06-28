import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Search } from 'lucide-react';

interface MarketData {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  last_price: string;
  volume: string;
  change_24h: string;
  high_24h: string;
  low_24h: string;
}

const TRADING_PAIRS = [
  { symbol: 'BTCUSDT', base: 'BTC', quote: 'USDT' },
  { symbol: 'ETHUSDT', base: 'ETH', quote: 'USDT' },
  { symbol: 'SOLUSDT', base: 'SOL', quote: 'USDT' },
  { symbol: 'ADAUSDT', base: 'ADA', quote: 'USDT' },
  { symbol: 'DOGEUSDT', base: 'DOGE', quote: 'USDT' },
  { symbol: 'DOTUSDT', base: 'DOT', quote: 'USDT' },
  { symbol: 'LINKUSDT', base: 'LINK', quote: 'USDT' },
  { symbol: 'AVAXUSDT', base: 'AVAX', quote: 'USDT' },
];

const MarketsPage: React.FC = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    async function fetchPrices() {
      try {
        // Fetch 24hr ticker data from Binance public API
        const symbols = TRADING_PAIRS.map(p => `"${p.symbol}"`).join(',');
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`
        );
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const marketData: MarketData[] = data.map((item: any) => {
            const pair = TRADING_PAIRS.find(p => p.symbol === item.symbol);
            return {
              symbol: item.symbol,
              base_asset: pair?.base || item.symbol.replace('USDT', ''),
              quote_asset: 'USDT',
              last_price: parseFloat(item.lastPrice).toFixed(2),
              volume: parseFloat(item.quoteVolume).toLocaleString(undefined, { maximumFractionDigits: 0 }),
              change_24h: parseFloat(item.priceChangePercent).toFixed(2),
              high_24h: parseFloat(item.highPrice).toFixed(2),
              low_24h: parseFloat(item.lowPrice).toFixed(2),
            };
          });
          setMarkets(marketData);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('Failed to fetch prices:', err);
        // Fallback: show pairs with placeholder data
        setMarkets(TRADING_PAIRS.map(p => ({
          symbol: p.symbol,
          base_asset: p.base,
          quote_asset: p.quote,
          last_price: '—',
          volume: '—',
          change_24h: '0.00',
          high_24h: '—',
          low_24h: '—',
        })));
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = markets.filter(m =>
    m.symbol.toLowerCase().includes(search.toLowerCase()) ||
    m.base_asset.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolume = markets.reduce((sum, m) => 
    sum + (parseFloat(m.volume.replace(/,/g, '')) || 0), 0
  );

  const topGainer = [...markets].sort((a, b) => 
    parseFloat(b.change_24h) - parseFloat(a.change_24h)
  )[0];

  const topLoser = [...markets].sort((a, b) => 
    parseFloat(a.change_24h) - parseFloat(b.change_24h)
  )[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-gray-900">
                NovaBit <span className="text-blue-600">Markets</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
                />
              </div>
              <a href="/login" className="text-sm text-blue-600 hover:underline font-medium">Sign In</a>
              <a href="/trading" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium hidden sm:block">Start Trading</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Total Pairs</p>
            <p className="text-2xl font-bold text-gray-900">{markets.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">24h Volume</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalVolume >= 1_000_000_000 
                ? (totalVolume / 1_000_000_000).toFixed(2) + 'B'
                : (totalVolume / 1_000_000).toFixed(2) + 'M'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Top Gainer</p>
            {topGainer && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">{topGainer.base_asset}</span>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  +{topGainer.change_24h}%
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Top Loser</p>
            {topLoser && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">{topLoser.base_asset}</span>
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {topLoser.change_24h}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Markets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Markets</h2>
            {lastUpdate && (
              <span className="text-xs text-gray-400">Updated: {lastUpdate}</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Pair</th>
                  <th className="px-6 py-4 font-medium text-right">Last Price</th>
                  <th className="px-6 py-4 font-medium text-right">24h Change</th>
                  <th className="px-6 py-4 font-medium text-right hidden md:table-cell">24h High</th>
                  <th className="px-6 py-4 font-medium text-right hidden md:table-cell">24h Low</th>
                  <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">24h Volume</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-sm">Loading live prices...</p>
                    </td>
                  </tr>
                ) : filteredMarkets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No markets found for "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredMarkets.map((m) => {
                    const change = parseFloat(m.change_24h);
                    const isUp = change >= 0;
                    return (
                      <tr key={m.symbol} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{m.base_asset}</span>
                            <span className="text-xs text-gray-400">/USDT</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          ${m.last_price}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {isUp ? '+' : ''}{m.change_24h}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 hidden md:table-cell">
                          ${m.high_24h}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 hidden md:table-cell">
                          ${m.low_24h}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 hidden sm:table-cell">
                          ${m.volume}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href="/trading"
                            className="inline-block text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Trade
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Start Trading Crypto</h2>
          <p className="text-gray-400 mb-6">Buy, sell, and trade 8+ cryptocurrencies with low fees</p>
          <a
            href="/trading"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Trading Now
          </a>
        </div>
      </main>
    </div>
  );
};

export default MarketsPage;