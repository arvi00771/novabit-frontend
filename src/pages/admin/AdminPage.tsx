import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Settings, 
  TrendingUp, 
  Search,
  
  
} from 'lucide-react';
import { Input } from '../../components/ui/Input';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'market' | 'system'>('users');

  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12%', icon: <Users className="text-blue-600" /> },
    { label: '24h Volume', value: '$1.2M', change: '+5%', icon: <BarChart3 className="text-green-600" /> },
    { label: 'Active Orders', value: '842', change: '-2%', icon: <TrendingUp className="text-purple-600" /> },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: <ShieldAlert className="text-orange-600" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Global exchange overview and management.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings size={18} /> System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{s.icon}</div>
              <span className={`text-xs font-bold ${s.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-100">
        {['users', 'market', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-2 text-sm font-bold capitalize transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Main Table Area */}
      <Card title={activeTab === 'users' ? 'User Management' : 'System Overview'}>
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input 
                placeholder="Search by email or ID..." 
                icon={<Search size={16} />} 
                className="max-w-md"
              />
              <Button variant="secondary">Filter</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-gray-50 uppercase text-[10px] font-bold tracking-widest">
                    <th className="pb-4 px-2">User</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2 text-right">Balance (USD)</th>
                    <th className="pb-4 px-2 text-right">Joined</th>
                    <th className="pb-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-2">
                        <div className="font-bold text-gray-900">user_{i}@example.com</div>
                        <div className="text-[10px] text-gray-400 font-mono">uuid-83j2-9sk2-92l{i}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">VERIFIED</span>
                      </td>
                      <td className="py-4 px-2 text-right font-mono font-medium">$42,350.00</td>
                      <td className="py-4 px-2 text-right text-gray-500">Oct 12, 2023</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button size="sm" variant="outline" className="h-7 text-[10px]">Manage</Button>
                           <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-600">Suspend</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="py-20 text-center text-gray-400">
             <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
             <p>Market health and liquidity monitoring tools coming soon.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
