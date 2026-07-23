import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ── Lazy-loaded page components (code-split per route) ──
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MarketsPage = lazy(() => import('./pages/markets/MarketsPage'));
const EnterprisePage = lazy(() => import('./pages/enterprise/EnterprisePage'));
const OnboardingPage = lazy(() => import('./pages/enterprise/OnboardingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const TradingPage = lazy(() => import('./pages/trading/TradingPage'));
const WalletPage = lazy(() => import('./pages/wallet/WalletPage'));
const DepositPage = lazy(() => import('./pages/wallet/DepositPage'));
const WithdrawPage = lazy(() => import('./pages/wallet/WithdrawPage'));
const KYCPage = lazy(() => import('./pages/kyc/KYCPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const StakingPage = lazy(() => import('./pages/staking/StakingPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));

// ── Shared loading fallback ──────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 size={36} className="animate-spin text-blue-500 mb-4" />
      <p className="text-sm text-gray-400 font-medium">Loading…</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/wallet/deposit" element={<DepositPage />} />
                <Route path="/wallet/withdraw" element={<WithdrawPage />} />
                <Route path="/kyc" element={<KYCPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/staking" element={<StakingPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;