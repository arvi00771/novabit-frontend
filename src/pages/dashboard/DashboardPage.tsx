import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';
import { 
   
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface WalletAsset {
  asset: string;
  balance: string;
  locked_balance: string;
}

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

const ASSET_METADATA: Record<string, { color: string }> = {
  BTC: { color: '#F7931A' },
  ETH: { color: '#627EEA' },
  USDT: { color: '#26A17B' },
  SOL: { color: '#14F195' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletAsset[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({ USDT: 1 });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletsRes, ordersRes, pairsRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/orders', { params: { limit: 5 } }),
          api.get('/market/pairs')
        ]);

        setWallets(walletsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        
        // Extract prices from pairs
        const newPrices: Record<string, number> = { USDT: 1 };
        pairsRes.data.data.forEach((p: any) => {
          if (p.symbol.endsWith('USDT')) {
            const asset = p.symbol.replace('USDT', '');
            newPrices[asset] = parseFloat(p.price || '0');
          }
        });
        setPrices(newPrices);
      } catch (error) {
        console.error('Dashboard data fetch failed:', error);
      }
    };

    fetchData();
  }, []);

  const getUsdValue = (w: WalletAsset): number => {
    const price = prices[w.asset] || 0;
    return (parseFloat(w.balance) + parseFloat(w.locked_balance)) * price;
  };

  const totalUsd = wallets.reduce((acc, w) => acc + getUsdValue(w), 0);
  
  const allocation = wallets
    .map(w => ({
      asset: w.asset,
      value: getUsdValue(w),
      percentage: totalUsd > 0 ? (getUsdValue(w) / totalUsd) * 100 : 0,
      color: ASSET_METADATA[w.asset]?.color || '#94a3b8'
    }))
    .filter(a => a.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{user?.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-gray-500 font-medium">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/wallet">
            <Button variant="outline" className="font-bold gap-2">
              <ArrowDownLeft size={18} /> Deposit
            </Button>
          </Link>
          <Link to="/wallet">
            <Button variant="outline" className="font-bold gap-2">
              <ArrowUpRight size={18} /> Withdraw
            </Button>
          </Link>
          <Link to="/trading">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
              <Zap size={18} /> Trade Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white shadow-xl shadow-blue-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold bg-green-400 text-green-900 px-2 py-1 rounded-full">
              +2.4%
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-black mb-6">${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          <Link to="/wallet" className="flex items-center text-xs text-blue-100 font-bold gap-1 cursor-pointer hover:text-white transition-colors">
            View Wallet <ChevronRight size={14} />
          </Link>
        </Card>

        <Card title="Asset Allocation">
          <div className="space-y-4">
            {/* Simple Allocation Bar */}
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-100">
              {allocation.map((a, i) => (
                <div 
                  key={i} 
                  style={{ width: `${a.percentage}%`, backgroundColor: a.color }}
                  title={`${a.asset}: ${a.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allocation.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-xs font-bold text-gray-700">{a.asset}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{a.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Security Level">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="font-bold text-gray-900">High Security</div>
              <div className="text-xs text-gray-500">2FA and Whitelist enabled</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[85%]" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">85% Profile Strength</p>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Recent Orders">
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${order.side === 'BUY' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {order.side === 'BUY' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{order.pair}</div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {order.type} • {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">
                        {parseFloat(order.amount).toFixed(4)}
                      </div>
                      <div className={`text-[10px] font-bold uppercase ${
                        order.status === 'FILLED' ? 'text-green-500' : 
                        order.status === 'CANCELLED' ? 'text-gray-400' : 'text-blue-500'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Clock size={32} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No recent orders found</p>
                <Link to="/trading">
                  <Button variant="ghost" size="sm" className="text-blue-600 mt-2">Start Trading</Button>
                </Link>
              </div>
            )}
            <Link to="/trading">
              <Button variant="ghost" className="w-full mt-2 text-blue-600 font-bold text-xs gap-2">
                Go to Trading <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Market Overview">
          <div className="space-y-4">
            {Object.entries(prices).filter(([asset]) => asset !== 'USDT').slice(0, 5).map(([asset, price]) => (
              <div key={asset} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-400 border border-gray-100">
                    {asset[0]}
                  </div>
                  <span className="font-bold text-sm text-gray-700">{asset}/USDT</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <div className="text-[10px] font-bold text-green-500">+1.24%</div>
                </div>
              </div>
            ))}
            <Link to="/trading">
              <Button variant="ghost" className="w-full mt-4 text-blue-600 font-bold text-xs gap-2">
                View All Markets <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
