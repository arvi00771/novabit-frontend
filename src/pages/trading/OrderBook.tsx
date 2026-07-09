import React from 'react';

interface OrderBookProps {
  bids: any[];
  asks: any[];
  pair: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, pair }) => {
  const quoteAsset = 'USDT';
  const baseAsset = pair.replace('USDT', '') || 'BTC';

  // Calculate total depth for visualization
  const maxBidTotal = Math.max(...bids.map(b => parseFloat(b.quantity) || 0), 1);
  const maxAskTotal = Math.max(...asks.map(a => parseFloat(a.quantity) || 0), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[400px]">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h3 className="font-bold text-sm text-gray-900">Order Book</h3>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col text-[11px] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 px-4 py-2 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-50">
          <span>Price({quoteAsset})</span>
          <span className="text-right">Amount({baseAsset})</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sells) - Red */}
        <div className="flex-1 overflow-hidden flex flex-col-reverse justify-end">
          {asks.slice(0, 15).map((ask, i) => (
            <div key={i} className="relative group cursor-pointer hover:bg-gray-50 transition-colors">
              <div 
                className="absolute inset-y-0 right-0 bg-red-50 transition-all duration-300" 
                style={{ width: `${(parseFloat(ask.quantity) / maxAskTotal) * 100}%` }}
              />
              <div className="grid grid-cols-3 px-4 py-1 relative z-10">
                <span className="font-bold text-red-500">{parseFloat(ask.price).toFixed(2)}</span>
                <span className="text-right text-gray-600 font-mono">{parseFloat(ask.quantity).toFixed(4)}</span>
                <span className="text-right text-gray-400 font-mono">{(parseFloat(ask.price) * parseFloat(ask.quantity)).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spread / Current Price */}
        <div className="px-4 py-3 bg-gray-50/50 border-y border-gray-100 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-lg font-black text-gray-900">
                {bids[0]?.price || '0.00'}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Last Price</span>
           </div>
           <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Spread</div>
              <div className="font-bold text-gray-600">
                {asks[0] && bids[0] ? (parseFloat(asks[0].price) - parseFloat(bids[0].price)).toFixed(2) : '0.00'}
              </div>
           </div>
        </div>

        {/* Bids (Buys) - Green */}
        <div className="flex-1 overflow-hidden">
          {bids.slice(0, 15).map((bid, i) => (
            <div key={i} className="relative group cursor-pointer hover:bg-gray-50 transition-colors">
              <div 
                className="absolute inset-y-0 right-0 bg-green-50 transition-all duration-300" 
                style={{ width: `${(parseFloat(bid.quantity) / maxBidTotal) * 100}%` }}
              />
              <div className="grid grid-cols-3 px-4 py-1 relative z-10">
                <span className="font-bold text-green-600">{parseFloat(bid.price).toFixed(2)}</span>
                <span className="text-right text-gray-600 font-mono">{parseFloat(bid.quantity).toFixed(4)}</span>
                <span className="text-right text-gray-400 font-mono">{(parseFloat(bid.price) * parseFloat(bid.quantity)).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
