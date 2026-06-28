import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../store/AuthContext';
import { 
  Lock, 
  Key, 
  Bell, 
  User, 
  Smartphone, 
  Copy, 
  Eye, 
  EyeOff,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { user: _user } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'api' | 'notifications'>('security');
  const [showSecret, setShowSecret] = useState(false);

  const tabs = [
    { id: 'security', label: 'Security & Auth', icon: <Lock size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

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
              <Card title="Security Status" className="bg-green-50/50 border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900">Your account is well protected</h4>
                    <p className="text-sm text-green-700">2-Factor Authentication is currently active.</p>
                  </div>
                </div>
              </Card>

              <Card title="Two-Factor Authentication (2FA)">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Authenticator App</p>
                      <p className="text-xs text-gray-500">Google Authenticator, Authy, etc.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                </div>
              </Card>

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
