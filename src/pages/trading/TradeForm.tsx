import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';

interface TradeFormProps {
  pair: string;
  balance: { base: string; quote: string };
  currentPrice: string;
  onSubmit: (data: any) => void;
  walletLoading?: boolean;
}

export const TradeForm: React.FC<TradeFormProps> = ({ pair, balance, currentPrice, onSubmit, walletLoading }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [type, setType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(currentPrice);
  const [quantity, setQuantity] = useState('');
  
  const base = pair.replace('USDT', '') || 'BTC';
  const quote = 'USDT';

  const handleTotalClick = (percent: number) => {
    if (side === 'buy') {
      const maxQuote = parseFloat(balance.quote);
      const targetPrice = type === 'market' ? parseFloat(currentPrice) : parseFloat(price);
      if (targetPrice > 0) {
        setQuantity(((maxQuote * (percent / 100)) / targetPrice).toFixed(4));
      }
    } else {
      const maxBase = parseFloat(balance.base);
      setQuantity((maxBase * (percent / 100)).toFixed(4));
    }
  };

  const total = (parseFloat(price || currentPrice) * parseFloat(quantity || '0')).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
      <div className="flex bg-gray-100 rounded-md p-1 mb-6">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
            side === 'buy' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setSide('buy')}
        >
          BUY
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
            side === 'sell' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setSide('sell')}
        >
          SELL
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {['limit', 'market'].map((t) => (
          <button
            key={t}
            className={cn(
              "text-xs font-bold uppercase tracking-wider pb-1 border-b-2 transition-all duration-200",
              type === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
            onClick={() => setType(t as any)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tight">
          <span>Available</span>
          <span className="text-gray-900">
            {walletLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              `${side === 'buy' ? `${parseFloat(balance.quote).toFixed(2)} ${quote}` : `${parseFloat(balance.base).toFixed(4)} ${base}`}`
            )}
          </span>
        </div>

        {type === 'limit' && (
          <Input
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            suffix={quote}
            className="text-right font-mono"
          />
        )}
        
        {type === 'market' && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 flex items-center justify-between">
              <span>Market Price</span>
              <span className="font-mono">{quote}</span>
            </div>
          </div>
        )}

        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          suffix={base}
          className="text-right font-mono"
        />

        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((p) => (
            <button
              key={p}
              className="py-1 text-[10px] font-bold bg-gray-50 hover:bg-gray-100 text-gray-500 rounded border border-gray-100 transition-colors"
              onClick={() => handleTotalClick(p)}
            >
              {p}%
            </button>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-4 bg-gray-50 p-2 rounded">
            <span>Total</span>
            <span className="text-gray-900 font-bold">{total} {quote}</span>
          </div>

          <Button
            className={cn(
              "w-full py-3 font-bold text-sm tracking-wider",
              side === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            )}
            onClick={() => onSubmit({ side, type, price, quantity })}
          >
            {side.toUpperCase()} {base}
          </Button>
        </div>
      </div>
    </div>
  );
};
