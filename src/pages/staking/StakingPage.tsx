import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import api from '../../utils/api';
import {
  Wallet, Clock, Award, CheckCircle2,
  Loader2, Coins, ArrowRight, XCircle, AlertTriangle,
  History, Sparkles, CalendarDays
} from 'lucide-react';

interface StakingProduct {
  id: string;
  name: string;
  asset: string;
  apy: number;
  min_stake: string;
  lock_days: number;
  total_staked: string;
  is_active: boolean;
}

interface StakingPosition {
  id: string;
  product_id: string;
  asset: string;
  amount: string;
  apy: number;
  rewards_earned: string;
  start_date: string;
  status: 'ACTIVE' | 'UNSTAKING' | 'COMPLETED';
}

interface Reward {
  id: string;
  asset: string;
  amount: string;
  stake_id: string;
  created_at: string;
}

export default function StakingPage() {
  const [products, setProducts] = useState<StakingProduct[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stake modal state
  const [selectedProduct, setSelectedProduct] = useState<StakingProduct | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [stakeSuccess, setStakeSuccess] = useState(false);

  // Claim modal
  const [claimStake, setClaimStake] = useState<StakingPosition | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Unstake modal
  const [unstakeTarget, setUnstakeTarget] = useState<StakingPosition | null>(null);
  const [unstakeError, setUnstakeError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, posRes, rewRes] = await Promise.all([
        api.get('/staking/products'),
        api.get('/staking/positions'),
        api.get('/staking/rewards'),
      ]);
      setProducts(prodRes.data?.data || prodRes.data || []);
      setPositions(posRes.data?.data || posRes.data || []);
      setRewards(rewRes.data?.data || rewRes.data || []);
    } catch (err) {
      console.error('Failed to fetch staking data:', err);
      setError('Unable to load staking data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openStakeModal = async (product: StakingProduct) => {
    setSelectedProduct(product);
    setStakeAmount('');
    setStakeError(null);
    setStakeSuccess(false);
    try {
      const res = await api.get(`/wallets/${product.asset}`);
      setWalletBalance(parseFloat(res.data?.data?.available || res.data?.available || '0'));
    } catch {
      setWalletBalance(0);
    }
  };

  const handleStake = async () => {
    if (!selectedProduct) return;
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      setStakeError('Enter a valid amount');
      return;
    }
    if (amount > walletBalance) {
      setStakeError('Insufficient balance');
      return;
    }
    if (amount < parseFloat(selectedProduct.min_stake)) {
      setStakeError(`Minimum stake is ${selectedProduct.min_stake} ${selectedProduct.asset}`);
      return;
    }

    setActionLoading('stake');
    setStakeError(null);
    try {
      await api.post('/staking/stake', {
        product_id: selectedProduct.id,
        amount: stakeAmount,
      });
      setStakeSuccess(true);
      fetchData();
    } catch (err: any) {
      setStakeError(err.response?.data?.message || 'Failed to stake. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleClaim = async (position: StakingPosition) => {
    setClaimStake(position);
    setClaimError(null);
    setClaimSuccess(false);
  };

  const confirmClaim = async () => {
    if (!claimStake) return;
    setActionLoading('claim');
    setClaimError(null);
    try {
      await api.post('/staking/rewards/claim', { stake_id: claimStake.id });
      setClaimSuccess(true);
      fetchData();
    } catch (err: any) {
      setClaimError(err.response?.data?.message || 'Failed to claim rewards.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmUnstake = async () => {
    if (!unstakeTarget) return;
    setActionLoading('unstake');
    setUnstakeError(null);
    try {
      await api.post('/staking/unstake', { stake_id: unstakeTarget.id });
      setUnstakeTarget(null);
      fetchData();
    } catch (err: any) {
      setUnstakeError(err.response?.data?.message || 'Failed to unstake.');
    } finally {
      setActionLoading(null);
    }
  };

  const calcDailyReward = (amountStr: string, apy: number) => {
    const amount = parseFloat(amountStr);
    if (!amount) return '0';
    return (amount * apy / 365 / 100).toFixed(6);
  };

  const calcMonthlyReward = (amountStr: string, apy: number) => {
    const amount = parseFloat(amountStr);
    if (!amount) return '0';
    return (amount * apy / 12 / 100).toFixed(6);
  };

  const apyToColor = (apy: number) => {
    if (apy >= 15) return 'text-green-500';
    if (apy >= 8) return 'text-emerald-500';
    return 'text-blue-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"><Clock size={12} /> Active</span>;
      case 'UNSTAKING':
        return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"><AlertTriangle size={12} /> Unstaking</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 size={12} /> Completed</span>;
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading staking products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg mb-2">Unable to load data</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Button onClick={fetchData} className="rounded-full px-8 font-bold">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mb-2">
            <Sparkles size={14} />
            Earn Yield
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Staking</h1>
          <p className="text-gray-500 font-medium mt-1">Stake your crypto and earn passive rewards</p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          className="rounded-full font-bold gap-2"
        >
          <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* 1. Staking Products Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Award size={20} className="text-blue-600" />
          Available Staking Products
        </h2>

        {products.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <Coins className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500 mb-1">No staking products available</h3>
            <p className="text-sm text-gray-400">Check back soon for new staking opportunities.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.is_active).map((product) => (
              <Card
                key={product.id}
                className="border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Coins className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{product.asset}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-5 text-center border border-green-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Annual Percentage Yield</p>
                    <p className={`text-4xl font-black ${apyToColor(product.apy)}`}>
                      {product.apy}%
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Minimum</span>
                      <span className="font-bold text-gray-800">{product.min_stake} {product.asset}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Lock Period</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <CalendarDays size={14} className="text-gray-400" />
                        {product.lock_days === 0 ? 'Flexible' : `${product.lock_days} Days`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Total Staked</span>
                      <span className="font-bold text-gray-800">
                        {parseFloat(product.total_staked).toLocaleString()} {product.asset}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => openStakeModal(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-5 font-bold gap-2"
                  >
                    Stake Now
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 2. My Stakes Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Wallet size={20} className="text-blue-600" />
          My Stakes
        </h2>

        {positions.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500 mb-1">No active stakes</h3>
            <p className="text-sm text-gray-400">Start staking to earn passive rewards.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {positions.map((pos) => (
              <Card key={pos.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Coins className="text-blue-600" size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{pos.asset}</h3>
                        <p className="text-xs text-gray-400">Started {formatDate(pos.start_date)}</p>
                      </div>
                    </div>
                    {getStatusBadge(pos.status)}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Staked</p>
                      <p className="text-lg font-black text-gray-900">{parseFloat(pos.amount).toFixed(4)}</p>
                      <p className="text-[10px] text-gray-400">{pos.asset}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">APY</p>
                      <p className={`text-lg font-black ${apyToColor(pos.apy)}`}>{pos.apy}%</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-1">Rewards Earned</p>
                      <p className="text-lg font-black text-green-700">{parseFloat(pos.rewards_earned).toFixed(6)}</p>
                      <p className="text-[10px] text-green-500">{pos.asset}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Daily Reward</p>
                      <p className="text-lg font-black text-blue-700">{calcDailyReward(pos.amount, pos.apy)}</p>
                      <p className="text-[10px] text-blue-500">{pos.asset}</p>
                    </div>
                  </div>

                  {pos.status === 'ACTIVE' && (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleClaim(pos)}
                        className="bg-green-600 hover:bg-green-700 rounded-full text-sm font-bold px-6 gap-2"
                      >
                        <Award size={16} />
                        Claim Rewards
                      </Button>
                      <Button
                        onClick={() => {
                          setUnstakeTarget(pos);
                          setUnstakeError(null);
                        }}
                        variant="outline"
                        className="rounded-full text-sm font-bold border-red-200 text-red-600 hover:bg-red-50 gap-2"
                      >
                        <XCircle size={16} />
                        Unstake
                      </Button>
                    </div>
                  )}

                  {pos.status === 'UNSTAKING' && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl px-4 py-3 text-sm font-medium">
                      <AlertTriangle size={16} />
                      Unstaking in progress — your funds will be available once complete
                    </div>
                  )}

                  {pos.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium">
                      <CheckCircle2 size={16} className="text-green-500" />
                      Staking completed — funds returned to wallet
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 3. Reward History */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <History size={20} className="text-blue-600" />
          Reward History
        </h2>

        <Card className="border border-gray-100 rounded-2xl overflow-hidden">
          {rewards.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">No rewards claimed yet</p>
              <p className="text-xs text-gray-400 mt-1">Your earned rewards will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] text-gray-400 border-b border-gray-100 uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right hidden sm:table-cell">Stake Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rewards.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{r.asset}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-green-600">
                        +{parseFloat(r.amount).toFixed(6)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 text-xs font-mono hidden sm:table-cell">
                        {r.stake_id.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Stake Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={`Stake ${selectedProduct?.asset || ''}`}
      >
        {stakeSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Successfully Staked!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your {selectedProduct?.asset} is now earning rewards.
            </p>
            <Button
              onClick={() => { setSelectedProduct(null); fetchData(); }}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 font-bold"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Available Balance</span>
              <span className="font-bold text-gray-900">
                {walletBalance.toFixed(4)} {selectedProduct?.asset}
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount to Stake</label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  min={selectedProduct?.min_stake || 0}
                  step="0.0001"
                  className="w-full p-4 pr-16 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <button
                  onClick={() => setStakeAmount(walletBalance.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 uppercase tracking-wider"
                >
                  Max
                </button>
              </div>
              {selectedProduct && (
                <p className="text-xs text-gray-400 mt-1">
                  Minimum: {selectedProduct.min_stake} {selectedProduct.asset}
                </p>
              )}
            </div>

            {stakeAmount && parseFloat(stakeAmount) > 0 && selectedProduct && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2 border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Estimated Rewards</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily</span>
                  <span className="font-bold text-gray-900">
                    {calcDailyReward(stakeAmount, selectedProduct.apy)} {selectedProduct.asset}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly</span>
                  <span className="font-bold text-gray-900">
                    {calcMonthlyReward(stakeAmount, selectedProduct.apy)} {selectedProduct.asset}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">APY</span>
                  <span className="font-bold text-green-600">{selectedProduct.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lock Period</span>
                  <span className="font-bold text-gray-900">
                    {selectedProduct.lock_days === 0 ? 'Flexible' : `${selectedProduct.lock_days} days`}
                  </span>
                </div>
              </div>
            )}

            {stakeError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                <AlertTriangle size={16} />
                {stakeError}
              </div>
            )}

            <Button
              onClick={handleStake}
              disabled={actionLoading === 'stake'}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-5 font-bold text-base"
            >
              {actionLoading === 'stake' ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Staking...</>
              ) : (
                <>Confirm Stake</>
              )}
            </Button>
          </div>
        )}
      </Modal>

      {/* Claim Rewards Modal */}
      <Modal
        isOpen={!!claimStake}
        onClose={() => setClaimStake(null)}
        title="Claim Rewards"
      >
        {claimSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Rewards Claimed!</h3>
            <p className="text-gray-500 text-sm mb-6">Your rewards have been added to your wallet.</p>
            <Button
              onClick={() => { setClaimStake(null); fetchData(); }}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 font-bold"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Rewards to Claim</p>
              <p className="text-3xl font-black text-green-700">
                {claimStake ? parseFloat(claimStake.rewards_earned).toFixed(6) : '0'}
              </p>
              <p className="text-sm text-green-600 font-medium">{claimStake?.asset}</p>
            </div>

            {claimError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                <AlertTriangle size={16} />
                {claimError}
              </div>
            )}

            <Button
              onClick={confirmClaim}
              disabled={actionLoading === 'claim'}
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-5 font-bold text-base gap-2"
            >
              {actionLoading === 'claim' ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Claiming...</>
              ) : (
                <><Award size={20} /> Claim Rewards</>
              )}
            </Button>
          </div>
        )}
      </Modal>

      {/* Unstake Confirmation Modal */}
      <Modal
        isOpen={!!unstakeTarget}
        onClose={() => { setUnstakeTarget(null); }}
        title={`Unstake ${unstakeTarget?.asset || ''}`}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">Are you sure?</p>
              <p className="text-xs text-amber-700">
                Your staked funds will be returned to your wallet. If there's a lock period, you may need to wait for it to complete.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Amount Staked</span>
              <span className="font-bold text-gray-900">
                {unstakeTarget ? parseFloat(unstakeTarget.amount).toFixed(4) : '0'} {unstakeTarget?.asset}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rewards to Claim</span>
              <span className="font-bold text-green-600">
                {unstakeTarget ? parseFloat(unstakeTarget.rewards_earned).toFixed(6) : '0'} {unstakeTarget?.asset}
              </span>
            </div>
          </div>

          {unstakeError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
              <AlertTriangle size={16} />
              {unstakeError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setUnstakeTarget(null); }}
              className="flex-1 rounded-xl py-4 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUnstake}
              disabled={actionLoading === 'unstake'}
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl py-4 font-bold gap-2"
            >
              {actionLoading === 'unstake' ? (
                <><Loader2 className="animate-spin" size={18} /> Processing...</>
              ) : (
                <><XCircle size={18} /> Unstake</>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}