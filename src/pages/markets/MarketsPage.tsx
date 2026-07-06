import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Zap, Loader2, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';

interface MarketPair {
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
  const navigate = useNavigate();
  const [markets, setMarkets] = useState<MarketPair[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    let interval: ReturnType<typeof setInterval>;

    async function fetchPrices() {
      try {
        // First try the backend API
        const response = await api.get('/market/pairs');
        if (mounted && response.data?.data?.length > 0) {
          const data = response.data.data as MarketPair[];
          setMarkets(data);
          setLastUpdate(new Date().toLocaleTimeString());
          setError(null);
          return;
        }
      } catch {
        // Fallback to Binance public API if backend is not available
        console.log('Backend API unavailable, using Binance fallback');
      }

      try {
        const symbols = TRADING_PAIRS.map(p => `"${p.symbol}"`).join(',');
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`
        );
        const data = await response.json();

        if (mounted && Array.isArray(data)) {
          const marketData: MarketPair[] = data.map((item: any) => {
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
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch prices:', err);
          setError('Unable to load market data. Please try again later.');
          // Show pairs with placeholder data
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
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPrices();
    interval = setInterval(fetchPrices, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredMarkets = markets.filter(m =>
    m.symbol.toLowerCase().includes(search.toLowerCase()) ||
    m.base_asset.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolume = markets.reduce((sum, m) => {
    const vol = parseFloat(String(m.volume).replace(/,/g, '')) || 0;
    return sum + vol;
  }, 0);

  const sortedByChange = [...markets].sort((a, b) =>
    parseFloat(b.change_24h) - parseFloat(a.change_24h)
  );
  const topGainer = sortedByChange[0];
  const topLoser = sortedByChange[sortedByChange.length - 1];

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + 'B';
    if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + 'M';
    if (vol >= 1_000) return (vol / 1_000).toFixed(1) + 'K';
    return vol.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="text-white fill-current" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-blue-600">NovaBit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/markets" className="text-blue-600 transition-colors">Markets</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-bold text-gray-700">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 px-6 rounded-full font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero / Banner */}
        <section className="relative overflow-hidden pt-16 pb-12 lg:pt-20 lg:pb-16 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Live Market Data
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900">
                Cryptocurrency <span className="text-blue-600">Markets</span>
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                Track real-time prices, 24h changes, and volume across all major trading pairs.
              </p>
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by pair name (e.g. BTC, ETH)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="container mx-auto px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10">
            <Card className="p-5 lg:p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Total Pairs</p>
              <p className="text-2xl lg:text-3xl font-black text-gray-900">
                {loading ? '—' : markets.length}
              </p>
            </Card>
            <Card className="p-5 lg:p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">24h Volume</p>
              <p className="text-2xl lg:text-3xl font-black text-gray-900">
                {loading ? '—' : `$${formatVolume(totalVolume)}`}
              </p>
            </Card>
            <Card className="p-5 lg:p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Top Gainer</p>
              {topGainer && !loading ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-green-600">{topGainer.base_asset}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                    <ArrowUp size={14} /> {topGainer.change_24h}%
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-black text-gray-400">—</p>
              )}
            </Card>
            <Card className="p-5 lg:p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Top Loser</p>
              {topLoser && !loading ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-red-600">{topLoser.base_asset}</span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                    <ArrowDown size={14} /> {topLoser.change_24h}%
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-black text-gray-400">—</p>
              )}
            </Card>
          </div>
        </section>

        {/* Markets Table */}
        <section className="container mx-auto px-6 pb-20">
          <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">All Markets</h2>
              {lastUpdate && (
                <span className="text-xs text-gray-400 font-medium">Updated: {lastUpdate}</span>
              )}
            </div>
            <div className="overflow-x-auto">
              {error && !loading && (
                <div className="px-6 py-8 text-center">
                  <p className="text-amber-600 font-medium mb-2">{error}</p>
                  <p className="text-sm text-gray-400">Showing fallback data</p>
                </div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Pair</th>
                    <th className="px-6 py-4 font-bold text-right">Last Price</th>
                    <th className="px-6 py-4 font-bold text-right">24h Change</th>
                    <th className="px-6 py-4 font-bold text-right hidden md:table-cell">24h High</th>
                    <th className="px-6 py-4 font-bold text-right hidden md:table-cell">24h Low</th>
                    <th className="px-6 py-4 font-bold text-right hidden sm:table-cell">24h Volume</th>
                    <th className="px-6 py-4 font-bold text-right">Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <p className="text-sm font-medium">Loading live prices...</p>
                      </td>
                    </tr>
                  ) : filteredMarkets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                        <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium">No markets found for "{search}"</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMarkets.map((m) => {
                      const change = parseFloat(m.change_24h);
                      const isUp = change >= 0;
                      return (
                        <tr
                          key={m.symbol}
                          onClick={() => navigate(`/trading?pair=${m.symbol}`)}
                          className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-black text-blue-600">
                                {m.base_asset.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-900">{m.base_asset}</span>
                                <span className="text-xs text-gray-400 ml-1">/{m.quote_asset}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">
                            ${m.last_price}
                          </td>
                          <td className={`px-6 py-4 text-right font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            <div className="flex items-center justify-end gap-1.5">
                              {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                              <span>{isUp ? '+' : ''}{m.change_24h}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600 font-medium hidden md:table-cell">
                            ${m.high_24h}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600 font-medium hidden md:table-cell">
                            ${m.low_24h}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600 font-medium hidden sm:table-cell">
                            ${m.volume}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-xs px-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/trading?pair=${m.symbol}`);
                              }}
                            >
                              Trade
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-12 lg:p-20 max-w-5xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[80px] rounded-full" />
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                  Start Trading Crypto Today
                </h2>
                <p className="text-gray-400 text-lg font-medium mb-8 max-w-xl mx-auto">
                  Buy, sell, and trade 8+ cryptocurrencies with ultra-low fees and institutional-grade security.
                </p>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6 rounded-full font-bold shadow-2xl shadow-blue-500/20 group">
                    Get Started Free
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-gray-500 font-bold uppercase tracking-widest">No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white fill-current" size={18} />
                </div>
                <span className="font-black text-xl tracking-tighter text-blue-600">NovaBit</span>
              </Link>
              <p className="text-gray-500 font-medium max-w-xs mb-8">
                Empowering the world to trade digital assets with confidence, speed, and absolute security.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Company</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Product</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><Link to="/markets" className="hover:text-blue-600">Markets</Link></li>
                <li><a href="#" className="hover:text-blue-600">Exchange</a></li>
                <li><a href="#" className="hover:text-blue-600">Fees</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Legal</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© 2024 NovaBit Exchange Inc. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <span>Status: All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketsPage;