import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Copy, CheckCircle2, Clock, XCircle, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'AVAX', name: 'Avalanche' },
];

export default function DepositPage() {
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [address, setAddress] = useState('');
  const [minDeposit, setMinDeposit] = useState('0.0001');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopying] = useState(false);

  useEffect(() => {
    fetchDepositAddress(selectedCoin.symbol);
    fetchDepositHistory(selectedCoin.symbol);
  }, [selectedCoin]);

  const fetchDepositAddress = async (asset: string) => {
    setIsLoading(true);
    try {
      // Assuming backend has an endpoint to get/generate address
      const res = await api.get(`/wallets/deposit/address/${asset}`);
      setAddress(res.data.data.address);
      // Min deposit might come from a config or coin info endpoint
      // For now using mock or if provided in response
      if (res.data.data.min_deposit_amount) {
          setMinDeposit(res.data.data.min_deposit_amount);
      }
    } catch (error) {
      console.error('Failed to fetch deposit address:', error);
      setAddress('Error generating address');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepositHistory = async (asset: string) => {
    try {
      const res = await api.get('/transactions', {
        params: { type: 'DEPOSIT', asset }
      });
      setHistory(res.data.data);
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'PENDING':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-[10px] font-bold"><Clock size={12} /> Pending</span>;
      case 'FAILED':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-[10px] font-bold"><XCircle size={12} /> Failed</span>;
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
        <h1 className="text-2xl font-bold text-gray-900">Deposit Crypto</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Coin Selection */}
        <Card title="Select Coin" className="md:col-span-1 h-fit">
          <div className="space-y-2">
            {COINS.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedCoin.symbol === coin.symbol
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm'
                    : 'border-gray-100 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>{coin.name}</span>
                <span className="text-xs opacity-60">{coin.symbol}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Right: Deposit Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="flex flex-col items-center py-8">
            <div className="w-full max-w-xs space-y-6 text-center">
              <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                  {address && address !== 'Error generating address' ? (
                    <QRCodeSVG
                      value={selectedCoin.symbol === 'BTC' ? `bitcoin:${address}?label=NovaBit` : address}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] bg-gray-100 animate-pulse rounded-lg" />
                  )}
                </div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                  Your {selectedCoin.symbol} Deposit Address
                </p>
                <div className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border border-gray-200">
                  <span className="flex-1 text-xs font-mono break-all line-clamp-2">
                    {isLoading ? 'Generating address...' : address}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={copyToClipboard}
                    disabled={!address || isLoading}
                  >
                    {isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Minimum Deposit</p>
                  <p className="text-sm font-bold text-gray-900">{minDeposit} {selectedCoin.symbol}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Network</p>
                  <p className="text-sm font-bold text-gray-900">{selectedCoin.symbol === 'ETH' || selectedCoin.symbol === 'USDT' ? 'ERC-20' : 'Native'}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-left border border-blue-100">
                <h4 className="text-blue-800 text-xs font-bold mb-1">Important</h4>
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Send only {selectedCoin.name} ({selectedCoin.symbol}) to this address. 
                  Sending any other asset may result in permanent loss.
                </p>
              </div>
            </div>
          </Card>

          {/* Deposit History */}
          <Card title={`${selectedCoin.symbol} Deposit History`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                    <th className="px-4 py-3 text-left">Time</th>
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
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          {tx.amount} {tx.asset}
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center">
                          {getStatusBadge(tx.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400 text-xs italic">
                        No recent deposits found.
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
