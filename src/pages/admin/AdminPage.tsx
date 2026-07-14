import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  LayoutDashboard, ShieldCheck, ArrowUpFromLine, Users,
  Wallet, Search, CheckCircle2, XCircle, Clock,
  Loader2, AlertTriangle, RefreshCw, UserCheck, UserX,
  Ban, Check, BarChart3, TrendingUp, DollarSign,
  Activity, UserPlus, Lock, ChevronLeft, ChevronRight,
  ExternalLink, Eye, Star, EyeOff, Filter
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../store/AuthContext';

// ── Types ───────────────────────────────────────
interface DashboardStats {
  total_users: number;
  verified_users: number;
  pending_kyc: number;
  total_deposits_24h: string;
  total_withdrawals_24h: string;
  total_trading_volume_24h: string;
  active_users_24h: number;
  pending_withdrawals: number;
  total_staked: string;
  total_stakers: number;
}

interface KYCSubmission {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  created_at: string;
  full_name?: string;
  document_type?: string;
  reason?: string;
}

interface WithdrawalRequest {
  id: string;
  user_id: string;
  user_email: string;
  asset: string;
  amount: string;
  fee: string;
  network: string;
  to_address: string;
  status: string;
  created_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: string;
  kyc_status: string;
  is_active: boolean;
  is_2fa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface StakingProduct {
  id: string;
  name: string;
  asset: string;
  min_stake: string;
  max_stake: string | null;
  apy: string;
  lock_period_days: number;
  is_active: boolean;
  total_staked: string;
  staker_count: number;
}

// ── Admin Page Component ────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // KYC
  const [kycList, setKycList] = useState<KYCSubmission[]>([]);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycTotal, setKycTotal] = useState(0);
  const [kycActionLoading, setKycActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ userId: string; email: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Withdrawals
  const [wdList, setWdList] = useState<WithdrawalRequest[]>([]);
  const [wdLoading, setWdLoading] = useState(false);
  const [wdTotal, setWdTotal] = useState(0);
  const [wdActionLoading, setWdActionLoading] = useState<string | null>(null);
  const [wdRejectModal, setWdRejectModal] = useState<{ id: string; email: string; amount: string } | null>(null);
  const [wdRejectReason, setWdRejectReason] = useState('');

  // Users
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [userToggleLoading, setUserToggleLoading] = useState<string | null>(null);
  const USER_LIMIT = 20;

  // Staking
  const [stakingSummary, setStakingSummary] = useState<any>(null);
  const [stakingLoading, setStakingLoading] = useState(false);
  const [distributeLoading, setDistributeLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const LIMIT = 20;

  // ── Fetch dashboard stats ─────────────────────
  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err: any) {
      setStatsError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  };

  // ── Fetch KYC list ────────────────────────────
  useEffect(() => {
    if (activeTab === 'kyc') fetchKyc();
  }, [activeTab]);

  const fetchKyc = useCallback(async () => {
    setKycLoading(true);
    try {
      const res = await api.get('/admin/kyc/pending', { params: { limit: LIMIT, offset: page * LIMIT } });
      setKycList(res.data.data || []);
      setKycTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to fetch KYC list:', err);
    } finally {
      setKycLoading(false);
    }
  }, [page]);

  const handleKycApprove = async (userId: string) => {
    setKycActionLoading(userId);
    try {
      await api.post(`/admin/kyc/${userId}/approve`);
      setKycList((prev) => prev.filter((k) => k.user_id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to approve KYC');
    } finally {
      setKycActionLoading(null);
    }
  };

  const handleKycReject = async () => {
    if (!rejectModal) return;
    setKycActionLoading(rejectModal.userId);
    try {
      await api.post(`/admin/kyc/${rejectModal.userId}/reject`, { reason: rejectReason || undefined });
      setKycList((prev) => prev.filter((k) => k.user_id !== rejectModal.userId));
      setRejectModal(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to reject KYC');
    } finally {
      setKycActionLoading(null);
    }
  };

  // ── Fetch withdrawals ─────────────────────────
  useEffect(() => {
    if (activeTab === 'withdrawals') fetchWithdrawals();
  }, [activeTab]);

  const fetchWithdrawals = useCallback(async () => {
    setWdLoading(true);
    try {
      const res = await api.get('/admin/withdrawals', { params: { limit: LIMIT, offset: page * LIMIT } });
      setWdList(res.data.data || []);
      setWdTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    } finally {
      setWdLoading(false);
    }
  }, [page]);

  const handleWdApprove = async (id: string) => {
    setWdActionLoading(id);
    try {
      await api.post(`/admin/withdrawals/${id}/approve`);
      setWdList((prev) => prev.filter((w) => w.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to approve withdrawal');
    } finally {
      setWdActionLoading(null);
    }
  };

  const handleWdReject = async () => {
    if (!wdRejectModal) return;
    setWdActionLoading(wdRejectModal.id);
    try {
      await api.post(`/admin/withdrawals/${wdRejectModal.id}/reject`, { reason: wdRejectReason || undefined });
      setWdList((prev) => prev.filter((w) => w.id !== wdRejectModal.id));
      setWdRejectModal(null);
      setWdRejectReason('');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to reject withdrawal');
    } finally {
      setWdActionLoading(null);
    }
  };

  // ── Fetch users ───────────────────────────────
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, userPage, userSearch]);

  const fetchUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      const params: any = { limit: USER_LIMIT, offset: userPage * USER_LIMIT };
      if (userSearch) params.search = userSearch;
      const res = await api.get('/admin/users', { params });
      setUserList(res.data.data || []);
      setUserTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUserLoading(false);
    }
  }, [userPage, userSearch]);

  const handleToggleUser = async (userId: string) => {
    setUserToggleLoading(userId);
    try {
      const res = await api.post(`/admin/users/${userId}/toggle-active`);
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: res.data.data.is_active } : u))
      );
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to toggle user status');
    } finally {
      setUserToggleLoading(null);
    }
  };

  // ── Fetch staking summary ─────────────────────
  useEffect(() => {
    if (activeTab === 'staking') fetchStaking();
  }, [activeTab]);

  const fetchStaking = async () => {
    setStakingLoading(true);
    try {
      const res = await api.get('/admin/staking/summary');
      setStakingSummary(res.data.data);
    } catch (err) {
      console.error('Failed to fetch staking summary:', err);
    } finally {
      setStakingLoading(false);
    }
  };

  const handleDistribute = async () => {
    setDistributeLoading(true);
    try {
      const res = await api.post('/admin/staking/distribute');
      alert(`Rewards distributed! ${res.data.data?.rewards_distributed || 0} rewards processed.`);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to distribute rewards');
    } finally {
      setDistributeLoading(false);
    }
  };

  // ── Sidebar tabs ──────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kyc', label: 'KYC Review', icon: ShieldCheck },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'staking', label: 'Staking', icon: Wallet },
  ];

  // ── Render ─────────────────────────────────────
  return (
    <div className="flex gap-8 min-h-[calc(100vh-12rem)]">
      {/* Sidebar Navigation */}
      <div className="w-56 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-6">
          <div className="p-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Admin Panel</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Manage your exchange</p>
          </div>
          <nav className="p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setPage(0); setUserPage(0); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.id === 'kyc' && kycTotal > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {kycTotal}
                    </span>
                  )}
                  {tab.id === 'withdrawals' && wdTotal > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {wdTotal}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 min-w-0">
        {activeTab === 'dashboard' && <DashboardTab stats={stats} loading={statsLoading} error={statsError} onRetry={fetchStats} />}
        {activeTab === 'kyc' && (
          <KYCTab
            list={kycList}
            loading={kycLoading}
            total={kycTotal}
            actionLoading={kycActionLoading}
            onApprove={handleKycApprove}
            onRejectOpen={(userId, email) => { setRejectModal({ userId, email }); setRejectReason(''); }}
            page={page}
            setPage={setPage}
            onRefresh={fetchKyc}
          />
        )}
        {activeTab === 'withdrawals' && (
          <WithdrawalsTab
            list={wdList}
            loading={wdLoading}
            total={wdTotal}
            actionLoading={wdActionLoading}
            onApprove={handleWdApprove}
            onRejectOpen={(id, email, amount) => { setWdRejectModal({ id, email, amount }); setWdRejectReason(''); }}
            page={page}
            setPage={setPage}
            onRefresh={fetchWithdrawals}
          />
        )}
        {activeTab === 'users' && (
          <UsersTab
            list={userList}
            loading={userLoading}
            total={userTotal}
            search={userSearch}
            onSearchChange={setUserSearch}
            toggleLoading={userToggleLoading}
            onToggleUser={handleToggleUser}
            page={userPage}
            setPage={setUserPage}
            onRefresh={fetchUsers}
          />
        )}
        {activeTab === 'staking' && (
          <StakingTab
            summary={stakingSummary}
            loading={stakingLoading}
            distributeLoading={distributeLoading}
            onDistribute={handleDistribute}
            onRefresh={fetchStaking}
          />
        )}
      </div>

      {/* KYC Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title={`Reject KYC — ${rejectModal?.email || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Provide a reason for rejection (optional):</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={handleKycReject}
              disabled={kycActionLoading === rejectModal?.userId}
            >
              {kycActionLoading === rejectModal?.userId ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Reject KYC
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdrawal Reject Modal */}
      <Modal
        isOpen={!!wdRejectModal}
        onClose={() => setWdRejectModal(null)}
        title={`Reject Withdrawal — ${wdRejectModal?.amount || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Provide a reason for rejection (optional):</p>
          <textarea
            value={wdRejectReason}
            onChange={(e) => setWdRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setWdRejectModal(null)}>Cancel</Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={handleWdReject}
              disabled={wdActionLoading === wdRejectModal?.id}
            >
              {wdActionLoading === wdRejectModal?.id ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Reject Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Dashboard Tab ────────────────────────────────
function DashboardTab({ stats, loading, error, onRetry }: {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={40} className="text-red-400 mb-4" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), icon: Users, color: 'blue' },
    { label: 'Verified Users', value: stats.verified_users.toLocaleString(), icon: UserCheck, color: 'green' },
    { label: 'Pending KYC', value: stats.pending_kyc.toLocaleString(), icon: Clock, color: 'amber' },
    { label: 'Active Users (24h)', value: stats.active_users_24h.toLocaleString(), icon: Activity, color: 'purple' },
    { label: 'Trading Volume (24h)', value: `$${parseFloat(stats.total_trading_volume_24h).toLocaleString()}`, icon: TrendingUp, color: 'blue' },
    { label: 'Deposits (24h)', value: `$${parseFloat(stats.total_deposits_24h).toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Pending Withdrawals', value: stats.pending_withdrawals.toLocaleString(), icon: ArrowUpFromLine, color: 'red' },
    { label: 'Total Staked', value: `${parseFloat(stats.total_staked).toLocaleString()}`, icon: Wallet, color: 'indigo' },
    { label: 'Active Stakers', value: stats.total_stakers.toLocaleString(), icon: Users, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time exchange overview</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="!p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${colorMap[s.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}

// ── KYC Review Tab ──────────────────────────────
function KYCTab({ list, loading, total, actionLoading, onApprove, onRejectOpen, page, setPage, onRefresh }: {
  list: KYCSubmission[];
  loading: boolean;
  total: number;
  actionLoading: string | null;
  onApprove: (userId: string) => void;
  onRejectOpen: (userId: string, email: string) => void;
  page: number;
  setPage: (p: number) => void;
  onRefresh: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Review</h1>
          <p className="text-sm text-gray-500 mt-1">{total} pending submissions</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 size={24} className="animate-spin text-gray-300 mx-auto" />
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ShieldCheck size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No pending KYC submissions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((k) => (
                  <tr key={k.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900">{k.user_email}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{k.user_id}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 text-[10px] bg-green-600 hover:bg-green-700"
                          onClick={() => onApprove(k.user_id)}
                          disabled={actionLoading === k.user_id}
                        >
                          {actionLoading === k.user_id ? (
                            <Loader2 size={12} className="animate-spin mr-1" />
                          ) : (
                            <Check size={12} className="mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[10px] text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => onRejectOpen(k.user_id, k.user_email)}
                          disabled={actionLoading === k.user_id}
                        >
                          <XCircle size={12} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * 20 >= total} onClick={() => setPage(page + 1)}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

// ── Withdrawals Tab ─────────────────────────────
function WithdrawalsTab({ list, loading, total, actionLoading, onApprove, onRejectOpen, page, setPage, onRefresh }: {
  list: WithdrawalRequest[];
  loading: boolean;
  total: number;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onRejectOpen: (id: string, email: string, amount: string) => void;
  page: number;
  setPage: (p: number) => void;
  onRefresh: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{total} pending withdrawals</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 size={24} className="animate-spin text-gray-300 mx-auto" />
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ArrowUpFromLine size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No pending withdrawal requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Network</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-xs font-bold text-gray-900">{w.user_email}</div>
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-gray-900">
                      {w.amount} {w.asset}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {w.network}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-mono text-gray-500 max-w-[120px] block truncate" title={w.to_address}>
                        {w.to_address}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 text-[10px] bg-green-600 hover:bg-green-700"
                          onClick={() => onApprove(w.id)}
                          disabled={actionLoading === w.id}
                        >
                          {actionLoading === w.id ? (
                            <Loader2 size={12} className="animate-spin mr-1" />
                          ) : (
                            <Check size={12} className="mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[10px] text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => onRejectOpen(w.id, w.user_email, `${w.amount} ${w.asset}`)}
                          disabled={actionLoading === w.id}
                        >
                          <XCircle size={12} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * 20 >= total} onClick={() => setPage(page + 1)}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

// ── Users Tab ────────────────────────────────────
function UsersTab({ list, loading, total, search, onSearchChange, toggleLoading, onToggleUser, page, setPage, onRefresh }: {
  list: AdminUser[];
  loading: boolean;
  total: number;
  search: string;
  onSearchChange: (s: string) => void;
  toggleLoading: string | null;
  onToggleUser: (id: string) => void;
  page: number;
  setPage: (p: number) => void;
  onRefresh: () => void;
}) {
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = () => {
    onSearchChange(searchInput);
    setPage(0);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total users</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>

      <Card>
        {/* Search */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Search by email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
            icon={<Search size={16} />}
            className="max-w-sm"
          />
          <Button variant="secondary" onClick={handleSearch}>
            <Filter size={14} className="mr-1.5" />
            Search
          </Button>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => { onSearchChange(''); setSearchInput(''); }}>
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 size={24} className="animate-spin text-gray-300 mx-auto" />
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">{search ? 'No users match your search.' : 'No users found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Role</th>
                  <th className="px-4 py-3 text-center">KYC</th>
                  <th className="px-4 py-3 text-center">2FA</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-gray-900">{u.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{u.id}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.kyc_status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                        u.kyc_status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        u.kyc_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {u.kyc_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {u.is_2fa_enabled ? (
                        <Lock size={14} className="text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {u.is_active ? (
                        <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-green-600">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
                          <XCircle size={12} /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Button
                        size="sm"
                        variant={u.is_active ? 'outline' : 'ghost'}
                        className={`h-8 text-[10px] ${
                          u.is_active
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        onClick={() => onToggleUser(u.id)}
                        disabled={toggleLoading === u.id}
                      >
                        {toggleLoading === u.id ? (
                          <Loader2 size={12} className="animate-spin mr-1" />
                        ) : u.is_active ? (
                          <Ban size={12} className="mr-1" />
                        ) : (
                          <Check size={12} className="mr-1" />
                        )}
                        {u.is_active ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * 20 >= total} onClick={() => setPage(page + 1)}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

// ── Staking Tab ──────────────────────────────────
function StakingTab({ summary, loading, distributeLoading, onDistribute, onRefresh }: {
  summary: any;
  loading: boolean;
  distributeLoading: boolean;
  onDistribute: () => void;
  onRefresh: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="text-sm">Loading staking data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staking Management</h1>
          <p className="text-sm text-gray-500 mt-1">Staking products and rewards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw size={14} className="mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={onDistribute}
            disabled={distributeLoading}
          >
            {distributeLoading ? (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            ) : (
              <Activity size={14} className="mr-1.5" />
            )}
            Distribute Rewards
          </Button>
        </div>
      </div>

      {summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <Card className="lg:col-span-3 !p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Staked</p>
                <p className="text-2xl font-black text-gray-900">
                  {parseFloat(summary.total_staked || '0').toLocaleString()} <span className="text-sm font-normal text-gray-500">tokens</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Active Stakers</p>
                <p className="text-2xl font-black text-gray-900">{summary.total_stakers || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Active Products</p>
                <p className="text-2xl font-black text-gray-900">{summary.total_products || 0}</p>
              </div>
            </div>
          </Card>

          {/* Products List */}
          <Card title="Staking Products" className="lg:col-span-2">
            {summary.products && summary.products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold tracking-wider">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-right">APY</th>
                      <th className="px-4 py-3 text-right">Lock Period</th>
                      <th className="px-4 py-3 text-right">Staked</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summary.products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-[10px] text-gray-400">{p.asset}</div>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-green-600">{p.apy}%</td>
                        <td className="px-4 py-4 text-right text-gray-600">{p.lock_period_days}d</td>
                        <td className="px-4 py-4 text-right font-mono text-gray-900">
                          {parseFloat(p.total_staked || '0').toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {p.is_active ? (
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                          ) : (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs italic">
                No staking products configured.
              </div>
            )}
          </Card>

          {/* Recent Rewards */}
          <Card title="Recent Rewards">
            {summary.recent_rewards && summary.recent_rewards.length > 0 ? (
              <div className="space-y-3">
                {summary.recent_rewards.slice(0, 5).map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{r.user_email || 'User'}</p>
                      <p className="text-[10px] text-gray-400">{r.asset} · {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">+{r.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs italic">
                No recent rewards.
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <Wallet size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No staking data available.</p>
        </div>
      )}
    </>
  );
}