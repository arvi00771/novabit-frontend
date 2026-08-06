import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../store/AuthContext';
import { 
  Lock, 
  Key, 
  Bell, 
  Smartphone, 
  Copy, 
  Eye, 
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle,
  QrCode,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../utils/api';
import { normalizeTwoFactorSetup } from '../../utils/twoFactor';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'api' | 'notifications'>('security');
  const [showSecret, setShowSecret] = useState(false);

  // 2FA state
  const [twoFA, setTwoFA] = useState<{
    step: 'idle' | 'setup' | 'verify' | 'disable';
    secret?: string;
    uri?: string;
    loading: boolean;
    error?: string;
    success?: string;
  }>({ step: 'idle', loading: false });

  const tabs = [
    { id: 'security', label: 'Security & Auth', icon: <Lock size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  // ── 2FA: Start Enable ──
  const handleEnable2FA = async () => {
    setTwoFA({ step: 'setup', loading: true });
    try {
      const res = await api.post('/auth/2fa/enable');
      const setup = normalizeTwoFactorSetup(res.data?.data, user?.email);

      if (!setup) {
        setTwoFA({
          step: 'idle',
          loading: false,
          error: 'The server did not return a 2FA setup code. Please try again.',
        });
        return;
      }

      setTwoFA({
        step: 'setup',
        loading: false,
        secret: setup.secret,
        uri: setup.uri,
      });
    } catch (err: any) {
      setTwoFA({
        step: 'idle',
        loading: false,
        error: err.response?.data?.error?.message || 'Failed to generate 2FA secret',
      });
    }
  };

  // ── 2FA: Verify and Enable ──
  const handleVerify2FA = async (code: string) => {
    setTwoFA(prev => ({ ...prev, loading: true, error: undefined }));
    try {
      await api.post('/auth/2fa/verify', { totp_code: code });
      updateUser({ ...user!, is_2fa_enabled: true });
      setTwoFA({
        step: 'idle',
        loading: false,
        success: 'Two-factor authentication has been enabled!',
      });
    } catch (err: any) {
      setTwoFA(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error?.message || 'Invalid code. Please try again.',
      }));
    }
  };

  // ── 2FA: Disable ──
  const handleDisable2FA = async (password: string, code: string) => {
    setTwoFA(prev => ({ ...prev, loading: true, error: undefined }));
    try {
      await api.post('/auth/2fa/disable', { password, totp_code: code });
      updateUser({ ...user!, is_2fa_enabled: false });
      setTwoFA({
        step: 'idle',
        loading: false,
        success: 'Two-factor authentication has been disabled.',
      });
    } catch (err: any) {
      setTwoFA(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error?.message || 'Failed to disable 2FA',
      }));
    }
  };

  // ── Copy to clipboard ──
  const copySecret = () => {
    if (twoFA.secret) {
      navigator.clipboard.writeText(twoFA.secret);
    }
  };

  const is2FAEnabled = user?.is_2fa_enabled;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 font-medium">Manage your account security and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Success message */}
              {twoFA.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm font-medium">
                  <CheckCircle size={18} />
                  {twoFA.success}
                </div>
              )}

              {/* Error message */}
              {twoFA.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {twoFA.error}
                </div>
              )}

              {/* Security Status */}
              <Card
                title="Security Status"
                className={is2FAEnabled ? 'bg-green-50/50 border-green-100' : 'bg-yellow-50/50 border-yellow-100'}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {is2FAEnabled ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                  </div>
                  <div>
                    <h4 className={`font-bold ${is2FAEnabled ? 'text-green-900' : 'text-yellow-900'}`}>
                      {is2FAEnabled ? 'Your account is well protected' : 'Increase your account security'}
                    </h4>
                    <p className={`text-sm ${is2FAEnabled ? 'text-green-700' : 'text-yellow-700'}`}>
                      {is2FAEnabled
                        ? '2-Factor Authentication is currently active.'
                        : 'Enable 2FA to protect your account from unauthorized access.'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Two-Factor Authentication */}
              <Card title="Two-Factor Authentication (2FA)">
                {(twoFA.step === 'idle' || twoFA.step === 'setup') && (
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${is2FAEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Authenticator App</p>
                        <p className="text-xs text-gray-500">Google Authenticator, Authy, etc.</p>
                      </div>
                    </div>
                    {is2FAEnabled ? (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setTwoFA({ step: 'disable', loading: false })}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={handleEnable2FA}
                        disabled={twoFA.loading}
                      >
                        {twoFA.loading ? <Loader2 size={16} className="animate-spin" /> : 'Enable'}
                      </Button>
                    )}
                  </div>
                )}

                {/* SETUP: Show QR & manual entry fallback */}
                {twoFA.step === 'setup' && (twoFA.uri || twoFA.secret) && (
                  <div className="mt-4 space-y-6 border-t pt-4">
                    <div className="text-center space-y-4">
                      {twoFA.uri ? (
                        <>
                          <p className="text-sm text-gray-600 font-medium">
                            Scan this QR code with your authenticator app:
                          </p>
                          <div className="inline-flex p-4 bg-white border-2 border-gray-200 rounded-xl" aria-label="2FA setup QR code">
                            <QRCodeSVG value={twoFA.uri} size={180} level="M" />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
                          <QrCode size={16} aria-hidden="true" />
                          QR setup is unavailable. Enter the code below in your authenticator app.
                        </div>
                      )}

                      {twoFA.secret ? (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Or enter this code manually:</p>
                          <div className="flex items-center justify-center gap-2">
                            <code className="max-w-full break-all px-4 py-2 bg-gray-100 rounded-lg text-sm font-mono select-all" aria-label="Manual 2FA setup code">
                              {twoFA.secret}
                            </code>
                            <Button variant="ghost" size="icon" onClick={copySecret} aria-label="Copy manual 2FA setup code" title="Copy setup code">
                              <Copy size={14} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Your authenticator app can scan the QR code directly.
                        </p>
                      )}
                    </div>

                    {/* Verify Code */}
                    <VerifyCodeForm
                      loading={twoFA.loading}
                      onSubmit={handleVerify2FA}
                      onCancel={() => setTwoFA({ step: 'idle', loading: false })}
                    />
                  </div>
                )}

                {twoFA.step === 'setup' && !twoFA.uri && !twoFA.secret && twoFA.loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                  </div>
                )}

                {/* DISABLE: Confirm */}
                {twoFA.step === 'disable' && (
                  <Disable2FAForm
                    loading={twoFA.loading}
                    onSubmit={handleDisable2FA}
                    onCancel={() => setTwoFA({ step: 'idle', loading: false })}
                  />
                )}
              </Card>

              {/* Password */}
              <Card title="Password">
                <div className="space-y-4">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <Button className="w-full">Update Password</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <Card title="Your API Keys">
                 <div className="space-y-6">
                    <p className="text-sm text-gray-500">Use API keys to trade programmatically. Keep your secret keys safe!</p>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Main Trading Key</span>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white p-2 rounded border border-gray-200 text-xs font-mono break-all">
                              nb_live_51P2u8HJG9f2kS8vL9w2x...
                            </div>
                            <Button variant="ghost" size="icon"><Copy size={14} /></Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white p-2 rounded border border-gray-200 text-xs font-mono break-all flex items-center justify-between">
                              {showSecret ? 'sk_live_v98X2jL83nB7mQ9p... ' : '••••••••••••••••••••••••••••'}
                              <button onClick={() => setShowSecret(!showSecret)}>
                                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                            <Button variant="ghost" size="icon"><Copy size={14} /></Button>
                          </div>
                       </div>
                    </div>
                    <Button className="w-full py-6 font-bold" variant="secondary">
                      Create New API Key
                    </Button>
                 </div>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card title="Email Notifications">
              <div className="space-y-4 divide-y divide-gray-50">
                {[
                  { label: 'Security Alerts', desc: 'Login notifications and security changes', default: true },
                  { label: 'Trade Executions', desc: 'When your buy or sell orders are filled', default: true },
                  { label: 'Deposits & Withdrawals', desc: 'Updates on your wallet movements', default: true },
                  { label: 'Newsletter', desc: 'New coin listings and platform updates', default: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4 first:pt-0">
                    <div className="max-w-[280px]">
                      <p className="font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.default ? 'bg-blue-600' : 'bg-gray-200'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.default ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Verify 2FA Code Form ──
function VerifyCodeForm({
  loading,
  onSubmit,
  onCancel,
}: {
  loading: boolean;
  onSubmit: (code: string) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600 font-medium">
        Enter the 6-digit code from your authenticator app to verify:
      </p>
      <Input
        label="Verification Code"
        type="text"
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        autoFocus
      />
      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading || code.length !== 6}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Enable'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Disable 2FA Form ──
function Disable2FAForm({
  loading,
  onSubmit,
  onCancel,
}: {
  loading: boolean;
  onSubmit: (password: string, code: string) => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && code.length === 6) onSubmit(password, code);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t pt-4">
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        Disabling 2FA will reduce your account security. Please confirm your password and 2FA code.
      </div>
      <Input
        label="Current Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <Input
        label="2FA Code"
        type="text"
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
      />
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="outline"
          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          disabled={loading || !password || code.length !== 6}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Disable 2FA'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
