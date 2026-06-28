import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowUpRight, CheckCircle2, Clock, XCircle, ChevronLeft, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const withdrawSchema = z.object({
  asset: z.string().min(1),
  address: z.string().min(1, 'Address is required'),
  amount: z.string().min(1, 'Amount is required'),
  network: z.string().min(1),
  totp_code: z.string().length(6, '2FA code must be 6 digits').optional().or(z.literal('')),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Native', fee: '0.0005' },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', fee: '0.01' },
  { symbol: 'USDT', name: 'Tether', network: 'ERC-20', fee: '1' },
  { symbol: 'SOL', name: 'Solana', network: 'Native', fee: '0.01' },
  { symbol: 'ADA', name: 'Cardano', network: 'Native', fee: '1' },
  { symbol: 'DOGE', name: 'Dogecoin', network: 'Native', fee: '5' },
  { symbol: 'DOT', name: 'Polkadot', network: 'Native', fee: '0.1' },
  { symbol: 'LINK', name: 'Chainlink', network: 'ERC-20', fee: '0.5' },
  { symbol: 'AVAX', name: 'Avalanche', network: 'Native', fee: '0.01' },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      asset: COINS[0].symbol,
      network: COINS[0].network,
    }
  });

  const amount = watch('amount');
  const netAmount = Math.max(0, (parseFloat(amount) || 0) - parseFloat(selectedCoin.fee)).toFixed(8);

  useEffect(() => {
    fetchBalances();
    fetchWithdrawalHistory();
  }, []);

  const fetchBalances = async () => {
    try {
      const res = await api.get('/v1/wallets');
      const bals: Record<string, string> = {};
      res.data.data.forEach((w: any) => {
        bals[w.asset] = w.available_balance;
      });
      setBalances(bals);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const res = await api.get('/v1/wallets/withdrawals');
      setHistory(res.data.data);
    } catch (error) {
      console.error('Failed to fetch withdrawal history:', error);
    }
  };

  const onSubmit = async (data: WithdrawFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/v1/wallets/withdraw', {
        ...data,
        asset: selectedCoin.symbol,
      });
      setSuccess('Withdrawal request submitted successfully!');
      fetchBalances();
      fetchWithdrawalHistory();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Withdrawal failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinSelect = (coin: typeof COINS[0]) => {
    setSelectedCoin(coin);
    setValue('asset', coin.symbol);
    setValue('network', coin.network);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'CONFIRMED':
        return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold">Completed</span>;
      case 'PENDING':
      case 'PROCESSING':
        return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-[10px] font-bold">Pending</span>;
      case 'CANCELED':
      case 'FAILED':
        return <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-[10px] font-bold">{status}</span>;
      default:
        return <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/wallet">
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Withdraw Crypto</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Coin Selection */}
        <Card title="Select Coin" className="md:col-span-1 h-fit">
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {COINS.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => handleCoinSelect(coin)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedCoin.symbol === coin.symbol
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-100 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm">{coin.name}</p>
                  <p className="text-[10px] opacity-60">Balance: {balances[coin.symbol] || '0.00'}</p>
                </div>
                <span className="text-xs">{coin.symbol}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Right: Withdrawal Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <label className="text-sm font-bold text-gray-700">Recipient Address</label>
                   <span className="text-[10px] text-gray-400 uppercase font-bold">Network: {selectedCoin.network}</span>
                </div>
                <Input
                  placeholder={`Enter ${selectedCoin.symbol} address`}
                  {...register('address')}
                  error={errors.address?.message}
                />

                <div className="flex justify-between items-end">
                   <label className="text-sm font-bold text-gray-700">Amount</label>
                   <button 
                     type="button"
                     className="text-[10px] text-blue-600 font-bold hover:underline"
                     onClick={() => setValue('amount', balances[selectedCoin.symbol] || '0')}
                   >
                     Available: {balances[selectedCoin.symbol] || '0.00'} {selectedCoin.symbol}
                   </button>
                </div>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  suffix={selectedCoin.symbol}
                  {...register('amount')}
                  error={errors.amount?.message}
                />

                <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Network Fee</span>
                    <span className="font-mono font-bold">{selectedCoin.fee} {selectedCoin.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-gray-200">
                    <span className="text-gray-900 uppercase">You will receive</span>
                    <span className="text-blue-600 font-mono">{netAmount} {selectedCoin.symbol}</span>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                     2FA Verification
                     <span className="text-[10px] text-gray-400 font-normal italic">(Required)</span>
                   </label>
                   <Input
                     placeholder="6-digit code"
                     {...register('totp_code')}
                     error={errors.totp_code?.message}
                   />
                </div>
              </div>

              <Button className="w-full py-6 font-bold" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : `Withdraw ${selectedCoin.symbol}`} <ArrowUpRight className="ml-2" size={18} />
              </Button>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
                 <AlertTriangle size={20} className="text-yellow-600 shrink-0" />
                 <p className="text-[10px] text-yellow-700 leading-relaxed">
                   Please double-check the recipient address. Withdrawals to the wrong address or on the wrong network cannot be recovered. 
                   Ensure your account has 2FA enabled.
                 </p>
              </div>
            </form>
          </Card>

          {/* Withdrawal History */}
          <Card title="Recent Withdrawals">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Asset</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length > 0 ? (
                    history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          {tx.asset}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          {tx.amount}
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center">
                          {getStatusBadge(tx.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-xs italic">
                        No recent withdrawals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
