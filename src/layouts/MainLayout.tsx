import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, TrendingUp, Wallet, Settings, LogOut, User, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const kycBadge = (status?: string) => {
  switch (status) {
    case 'VERIFIED':
      return <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><Award size={10} /> Verified</span>;
    case 'PENDING':
      return <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full"><ShieldAlert size={10} /> Pending</span>;
    case 'REJECTED':
      return <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Rejected</span>;
    default:
      return <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Unverified</span>;
  }
};

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            NovaBit
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            to="/trading"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <TrendingUp size={20} />
            Trade
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Wallet size={20} />
            Wallet
          </Link>
          <Link
            to="/kyc"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <User size={20} />
            <div className="flex items-center gap-2 flex-1">
              <span>Verification</span>
              {kycBadge(user?.kyc_status)}
            </div>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ShieldAlert size={20} className="text-orange-500" />
              Admin
            </Link>
          )}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-gray-700"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800 md:hidden">NovaBit</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              <span className="text-xs text-gray-500">{user?.kyc_status}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {getUserInitials()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
