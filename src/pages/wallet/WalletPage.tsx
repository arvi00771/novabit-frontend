import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowDownLeft, ArrowUpRight, History, Wallet as WalletIcon, Loader2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

interface WalletAsset {
  asset: string;
  balance: string;
  locked_balance: string;
}

const ASSET_METADATA: Record<string, { logo: string, color: string }> = {
  BTC: { logo: '₿', color: 'text-orange-500' },
  ETH: { logo: 'Ξ', color: 'text-blue-500' },
  USDT: { logo: '$', color: 'text-green-500' },
  SOL: { logo: 'S', color: 'text-purple-500' },
};

export default function WalletPage() {
  const [wallets, setWallets] = useState<WalletAsset[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const [walletsRes, historyRes] = await Promise.all([
        api.get('/wallets'),
        api.get('/transactions')
      ]);
      
      setWallets(walletsRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      // Fallback to empty or mock if backend fails
    } finally {
      setIsLoading(false);
    }
  };

  const getUsdValue = (w: WalletAsset): number => {
     const prices: Record<string, number> = { BTC: 43852.40, ETH: 2245.15, USDT: 1, SOL: 98.42 };
     const price = prices[w.asset] || 0;
     return (parseFloat(w.balance) + parseFloat(w.locked_balance)) * price;
  }

  const totalUsd = wallets.reduce((acc, w) => acc + getUsdValue(w), 0).toFixed(2);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-500">Manage your assets and transactions.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Balance</div>
          <div className="text-3xl font-bold text-gray-900">${totalUsd} <span className="text-sm font-normal text-gray-400">USD</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Your Assets" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 uppercase text-[10px] font-bold tracking-wider">
                    <th className="px-6 py-4 text-left">Asset</th>
                    <th className="px-6 py-4 text-right">Available</th>
                    <th className="px-6 py-4 text-right">Locked</th>
                    <th className="px-6 py-4 text-right">USD Value</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {wallets.map((w) => {
                    const meta = ASSET_METADATA[w.asset] || { logo: '?', color: 'text-gray-500' };
                    return (
                      <tr key={w.asset} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gray-50 ${meta.color} flex items-center justify-center font-bold border border-gray-100`}>
                              {meta.logo}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{w.asset}</div>
                              <div className="text-[10px] text-gray-400">Network: Native</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">{w.balance}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-500">{w.locked_balance}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">${getUsdValue(w).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link to="/wallet/deposit">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-[10px] gap-1"
                              >
                                <Plus size={12} /> Deposit
                              </Button>
                            </Link>
                            <Link to="/wallet/withdraw">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-8 text-[10px] gap-1"
                              >
                                <Minus size={12} /> Withdraw
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50">
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${h.type === 'DEPOSIT' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {h.type === 'DEPOSIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{h.type.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-400">{new Date(h.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="font-bold text-gray-900">{h.amount} {h.asset}</div>
                        <div className={`text-[10px] font-bold ${h.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {h.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-400">No recent activity.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-600 font-bold text-xs gap-2">
              <History size={14} /> View All History
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg shadow-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                <WalletIcon size={20} />
              </div>
              <h3 className="font-bold">Main Account</h3>
            </div>
            <p className="text-blue-100 text-sm mb-1">Estimated Value</p>
            <div className="text-3xl font-bold mb-6">${totalUsd}</div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/wallet/deposit">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-0">
                  Deposit
                </Button>
              </Link>
              <Link to="/wallet/withdraw">
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-400 border-0">
                  Withdraw
                </Button>
              </Link>
            </div>
          </Card>

          <Card title="Security Status">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">2FA Status</span>
                <span className="text-green-500 font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Identity Verification</span>
                <span className="text-green-500 font-bold">Verified (Level 1)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Withdrawal Limit</span>
                <span className="text-gray-900 font-bold">10 BTC / Day</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
