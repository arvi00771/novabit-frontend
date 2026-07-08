import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, BookOpen, Menu, X,
  CheckCircle, Download, ExternalLink
} from 'lucide-react';

const sections = [
  { id: 'what-you-get', title: 'What You Get' },
  { id: 'prerequisites', title: 'Prerequisites' },
  { id: 'deployment-guide', title: 'Deployment Guide' },
  { id: 'branding-configuration', title: 'Branding & Configuration' },
  { id: 'admin-dashboard', title: 'Admin Dashboard' },
  { id: 'managing-cryptocurrencies', title: 'Managing Cryptocurrencies' },
  { id: 'going-live-checklist', title: 'Going Live Checklist' },
  { id: 'support-resources', title: 'Support & Resources' },
];

const OnboardingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('what-you-get');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="text-white fill-current" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-blue-600">NovaBit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/enterprise" className="hover:text-blue-600 transition-colors">Enterprise</Link>
            <Link to="/markets" className="hover:text-blue-600 transition-colors">Markets</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-bold text-gray-700">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 px-6 rounded-full font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-blue-50/50 to-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100 mb-4">
                  <BookOpen size={14} />
                  Documentation
                </div>
                <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-gray-900">
                  White-Label Onboarding Guide
                </h1>
                <p className="text-lg text-gray-500 font-medium mt-2">
                  Launch your own cryptocurrency exchange in 7 days.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="rounded-full px-6 py-4 font-bold border-2 gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </Button>
                <Link to="/enterprise">
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 py-4 font-bold shadow-lg shadow-blue-100 gap-2">
                    Back to Enterprise
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile TOC Toggle */}
        <div className="lg:hidden sticky top-20 z-30 bg-white border-b border-gray-100">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-700"
          >
            <span>On this page</span>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {mobileMenuOpen && (
            <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                    activeSection === s.id
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 font-medium'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="container mx-auto px-6 py-12 lg:py-16">
          <div className="flex gap-12">
            {/* Sidebar TOC — Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 space-y-1 border-l-2 border-gray-100 pl-6">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">On this page</p>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`block w-full text-left text-sm py-2 pl-4 -ml-6 border-l-2 transition-all ${
                      activeSection === s.id
                        ? 'border-blue-600 text-blue-700 font-bold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 max-w-4xl prose prose-gray prose-headings:font-black prose-headings:text-gray-900 prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:shadow-lg prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-th:font-bold prose-td:text-gray-600 prose-a:text-blue-600">
              {/* Section 1: What You Get */}
              <section id="what-you-get">
                <h2>1. What You Get</h2>
                <p>Your white-label NovaBit exchange includes:</p>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Component</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Trading Engine</td><td className="px-4 py-3 text-gray-600">Real-time order matching with 2M+ TPS throughput</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Wallet System</td><td className="px-4 py-3 text-gray-600">Multi-currency HD wallet with hot/cold management</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">User Management</td><td className="px-4 py-3 text-gray-600">Registration, login, 2FA, profile management</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">KYC/AML</td><td className="px-4 py-3 text-gray-600">Automated identity verification with global compliance</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Admin Dashboard</td><td className="px-4 py-3 text-gray-600">User oversight, trade monitoring, withdrawal approvals</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Web Platform</td><td className="px-4 py-3 text-gray-600">Responsive React SPA — works on all devices</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Mobile Apps</td><td className="px-4 py-3 text-gray-600">iOS & Android (React Native) — branded to you</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">API Access</td><td className="px-4 py-3 text-gray-600">REST + WebSocket APIs for programmatic trading</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Liquidity</td><td className="px-4 py-3 text-gray-600">Built-in aggregation (optional integration)</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 2: Prerequisites */}
              <section id="prerequisites">
                <h2>2. Prerequisites</h2>

                <h3>2.1 Domain &amp; DNS</h3>
                <ul>
                  <li>A domain name (e.g., <code>exchange.yourcompany.com</code>)</li>
                  <li>Access to your DNS provider (Cloudflare recommended)</li>
                  <li>A wildcard SSL certificate or ability to use Let's Encrypt</li>
                </ul>

                <h3>2.2 Infrastructure</h3>
                <p>Choose one deployment option:</p>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Option</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Cost</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Render (recommended)</td><td className="px-4 py-3 text-gray-600">~$50–200/mo</td><td className="px-4 py-3 text-gray-600">Getting started quickly</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">AWS / GCP / DigitalOcean</td><td className="px-4 py-3 text-gray-600">~$200–500/mo</td><td className="px-4 py-3 text-gray-600">Production scale</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">On-premise</td><td className="px-4 py-3 text-gray-600">Variable</td><td className="px-4 py-3 text-gray-600">Enterprise compliance</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>2.3 Accounts</h3>
                <ul>
                  <li><strong>GitHub</strong> account (for repository access)</li>
                  <li><strong>Stripe</strong> account (for payment processing)</li>
                  <li><strong>Cloudflare</strong> account (for DNS &amp; CDN — recommended)</li>
                  <li><strong>SendGrid</strong> or similar (for transactional emails)</li>
                </ul>

                <h3>2.4 Regulatory</h3>
                <ul>
                  <li>Review licensing requirements in your jurisdiction</li>
                  <li>Common licenses: MSB (US/CAN), VASP (EU), Crypto License (UAE, Singapore)</li>
                  <li>We provide compliance templates to help</li>
                </ul>
              </section>

              {/* Section 3: Deployment Guide */}
              <section id="deployment-guide">
                <h2>3. Deployment Guide</h2>

                <h3>Option A: Render (Quickest — ~2 hours)</h3>
                <ol>
                  <li><strong>Fork the repository</strong> (we'll provide access)</li>
                  <li><strong>Create a Render account</strong> at <a href="https://render.com" target="_blank" rel="noopener">render.com</a></li>
                  <li><strong>Set up the backend:</strong>
                    <ul>
                      <li>New Web Service → Connect your forked repo</li>
                      <li>Root Directory: <code>backend</code></li>
                      <li>Build Command: <code>npm install &amp;&amp; npm run build</code></li>
                      <li>Start Command: <code>npm start</code></li>
                      <li>Instance Type: Starter or higher</li>
                      <li>Add environment variables (see Section 3.2)</li>
                    </ul>
                  </li>
                  <li><strong>Set up the database:</strong>
                    <ul>
                      <li>Render Dashboard → New PostgreSQL</li>
                      <li>Copy the internal connection string</li>
                      <li>Add as <code>DATABASE_URL</code> env var to backend</li>
                    </ul>
                  </li>
                  <li><strong>Set up Redis:</strong>
                    <ul>
                      <li>Render Dashboard → New Redis</li>
                      <li>Copy the connection string</li>
                      <li>Add as <code>REDIS_URL</code> env var to backend</li>
                    </ul>
                  </li>
                  <li><strong>Set up the frontend:</strong>
                    <ul>
                      <li>Render Dashboard → New Static Site</li>
                      <li>Root Directory: <code>frontend</code></li>
                      <li>Build Command: <code>npm install &amp;&amp; npm run build</code></li>
                      <li>Publish Directory: <code>dist</code></li>
                      <li>Add Redirect/Rewrite Rule: <code>/* → /index.html</code> (200)</li>
                    </ul>
                  </li>
                  <li><strong>Configure custom domain</strong> in Render dashboard</li>
                  <li><strong>Run database migrations:</strong>
                    <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code># In Render Shell or locally
DATABASE_URL=your_connection_string npm run migrate:up</code></pre>
                  </li>
                </ol>

                <h3>Option B: Docker / VPS</h3>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>{`# Clone the repository
git clone https://github.com/novabit-exchange/backend.git /app
cd /app

# Configure environment
cp .env.production.example .env.production
nano .env.production  # Fill in your secrets

# Deploy
./scripts/deploy.sh`}</code></pre>
                <p>A <code>docker-compose.prod.yml</code> file is included with:</p>
                <ul>
                  <li>Backend API (Node.js + Fastify)</li>
                  <li>PostgreSQL 15 (or connect to external)</li>
                  <li>Redis 7</li>
                  <li>Nginx reverse proxy with SSL</li>
                </ul>

                <h3>3.2 Environment Variables</h3>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>{`# Required
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/exchange
REDIS_URL=redis://user:pass@host:6379
JWT_SECRET=<generate a secure random string>
JWT_REFRESH_SECRET=<generate a different secure random string>

# Email (SendGrid or any SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your sendgrid api key>
EMAIL_FROM=noreply@yourdomain.com

# KYC/AML (get from provider)
KYC_API_KEY=<provider api key>
KYC_API_SECRET=<provider secret>

# Wallet (for deterministic address generation)
WALLET_SEED=<generate a secure random string>

# Frontend URL (for CORS)
FRONTEND_URL=https://exchange.yourdomain.com

# Optional
PORT=3000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100`}</code></pre>
                <p>To generate secure secrets:</p>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>openssl rand -hex 64</code></pre>
              </section>

              {/* Section 4: Branding & Configuration */}
              <section id="branding-configuration">
                <h2>4. Branding &amp; Configuration</h2>

                <h3>4.1 Custom Branding</h3>
                <p><strong>Frontend</strong> — edit <code>frontend/src/config/branding.ts</code>:</p>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>{`export const BRANDING = {
  companyName: 'Your Company Name',
  logo: '/path/to/your-logo.svg',
  favicon: '/path/to/favicon.ico',
  primaryColor: '#2563eb',  // Default blue
  secondaryColor: '#000000',
  supportEmail: 'support@yourdomain.com',
  websiteUrl: 'https://yourdomain.com',
};`}</code></pre>
                <p><strong>Mobile Apps</strong> — edit the app config files in <code>mobile/</code>:</p>
                <ul>
                  <li>iOS: <code>mobile/ios/AppName/Info.plist</code></li>
                  <li>Android: <code>mobile/android/app/src/main/res/values/strings.xml</code></li>
                </ul>

                <h3>4.2 Configure Trading Pairs</h3>
                <p>Edit <code>backend/src/config/trading-pairs.ts</code>:</p>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>{`export const TRADING_PAIRS = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', minQty: 0.0001, maxQty: 100 },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', minQty: 0.001, maxQty: 1000 },
  // Add your pairs here
];`}</code></pre>

                <h3>4.3 Configure Fees</h3>
                <p>Set trading fees in the admin dashboard under <strong>Settings → Fee Schedule</strong>:</p>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Tier</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Maker Fee</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Taker Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Default</td><td className="px-4 py-3 text-gray-600">0.10%</td><td className="px-4 py-3 text-gray-600">0.20%</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">VIP 1 (50 BTC volume)</td><td className="px-4 py-3 text-gray-600">0.08%</td><td className="px-4 py-3 text-gray-600">0.16%</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">VIP 2 (200 BTC volume)</td><td className="px-4 py-3 text-gray-600">0.05%</td><td className="px-4 py-3 text-gray-600">0.10%</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">VIP 3 (1000 BTC volume)</td><td className="px-4 py-3 text-gray-600">0.02%</td><td className="px-4 py-3 text-gray-600">0.05%</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>4.4 Supported Coins</h3>
                <p>Coins are configured in <code>backend/src/services/supported-coins.ts</code>. Default supported coins: BTC, ETH, USDT, USDC, SOL, ADA, XRP, DOT, DOGE, LINK, AVAX, MATIC.</p>
                <p>To add a custom token (EVM-compatible):</p>
                <ol>
                  <li>Add the token contract address to the config</li>
                  <li>Add token metadata (name, symbol, decimals)</li>
                  <li>Run the migration to update supported_coins table</li>
                </ol>
              </section>

              {/* Section 5: Admin Dashboard */}
              <section id="admin-dashboard">
                <h2>5. Admin Dashboard</h2>
                <p>Your admin panel is at <code>/admin</code> on your exchange URL.</p>

                <h3>5.1 First Admin User</h3>
                <p>The first registered user becomes an admin automatically. Or set manually in the database:</p>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>UPDATE users SET role = 'ADMIN' WHERE email = 'admin@yourdomain.com';</code></pre>

                <h3>5.2 Admin Features</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Feature</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">User Management</td><td className="px-4 py-3 text-gray-600">View, search, suspend users. View KYC status and documents</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Trade Oversight</td><td className="px-4 py-3 text-gray-600">Monitor all open orders, trade history, and market activity</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Withdrawal Approvals</td><td className="px-4 py-3 text-gray-600">Approve/reject pending withdrawals with release of locked funds</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Deposit Management</td><td className="px-4 py-3 text-gray-600">View deposit history and manually credit deposits if needed</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Fee Configuration</td><td className="px-4 py-3 text-gray-600">Adjust trading fees per user or tier</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Market Management</td><td className="px-4 py-3 text-gray-600">Enable/disable trading pairs, adjust min/max order sizes</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">System Settings</td><td className="px-4 py-3 text-gray-600">Configure maintenance mode, announcement banners</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Analytics</td><td className="px-4 py-3 text-gray-600">Daily active users, trading volume, revenue charts</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 6: Managing Cryptocurrencies */}
              <section id="managing-cryptocurrencies">
                <h2>6. Managing Cryptocurrencies</h2>

                <h3>6.1 Supported Networks</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Asset</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Network</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Address Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">BTC</td><td className="px-4 py-3 text-gray-600">Bitcoin</td><td className="px-4 py-3 text-gray-600"><code>bc1q...</code> (bech32)</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">ETH</td><td className="px-4 py-3 text-gray-600">Ethereum</td><td className="px-4 py-3 text-gray-600"><code>0x...</code> (EVM)</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">USDT</td><td className="px-4 py-3 text-gray-600">ERC-20 / TRC-20 / BEP-20</td><td className="px-4 py-3 text-gray-600"><code>0x...</code> or <code>T...</code></td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">SOL</td><td className="px-4 py-3 text-gray-600">Solana</td><td className="px-4 py-3 text-gray-600">Base58 (44 chars)</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">ADA</td><td className="px-4 py-3 text-gray-600">Cardano</td><td className="px-4 py-3 text-gray-600"><code>addr1...</code></td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">XRP</td><td className="px-4 py-3 text-gray-600">XRP Ledger</td><td className="px-4 py-3 text-gray-600"><code>r...</code> (with destination tag)</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>6.2 Adding a New Token</h3>
                <p><strong>For EVM tokens (ETH, BSC, Polygon, etc.):</strong></p>
                <ol>
                  <li>Deploy or get the token contract address</li>
                  <li>Add to <code>supported_coins</code> table:
                    <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm mt-2"><code>{`INSERT INTO supported_coins (asset, name, network, min_deposit_amount, min_withdrawal_amount, withdrawal_fee, is_active)
VALUES ('YOURTOKEN', 'Your Token Name', 'ERC20', '1', '10', '0.5', TRUE);`}</code></pre>
                  </li>
                  <li>Restart the backend service</li>
                </ol>
                <p><strong>For non-EVM tokens (custom blockchain):</strong> Requires additional development for address generation and balance checking.</p>
              </section>

              {/* Section 7: Going Live Checklist */}
              <section id="going-live-checklist">
                <h2>7. Going Live Checklist</h2>

                <h3>Week 1: Setup</h3>
                <div className="not-prose space-y-2 mb-8">
                  {[
                    'Domain purchased and DNS configured',
                    'Infrastructure deployed (backend, frontend, database)',
                    'SSL certificates active',
                    'Environment variables configured with secure secrets',
                    'Database migrations run successfully',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <h3>Week 2: Configuration</h3>
                <div className="not-prose space-y-2 mb-8">
                  {[
                    'Custom branding applied (logo, colors, name)',
                    'Trading pairs configured',
                    'Fee schedule set',
                    'Supported coins configured',
                    'Admin account created and verified',
                    'Test trade executed end-to-end',
                    'Test deposit and withdrawal flow',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <h3>Week 3: Compliance</h3>
                <div className="not-prose space-y-2 mb-8">
                  {[
                    'KYC/AML provider integrated and tested',
                    'Terms of Service published',
                    'Privacy Policy published',
                    'Licensing submitted (if applicable)',
                    'Legal review completed',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <h3>Week 4: Launch</h3>
                <div className="not-prose space-y-2">
                  {[
                    'Load testing completed',
                    'Monitoring and alerts configured',
                    'Support email active',
                    'Social media accounts ready',
                    'Marketing materials prepared',
                    'Soft launch with internal users',
                    'Public launch 🚀',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 8: Support & Resources */}
              <section id="support-resources">
                <h2>8. Support &amp; Resources</h2>

                <h3>Getting Help</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Channel</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Response Time</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Email</td><td className="px-4 py-3 text-gray-600">sales@novabit.exchange</td><td className="px-4 py-3 text-gray-600">Sales inquiries</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Email</td><td className="px-4 py-3 text-gray-600">support@novabit.exchange</td><td className="px-4 py-3 text-gray-600">Technical support</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Documentation</td><td className="px-4 py-3 text-gray-600">docs.novabit.exchange</td><td className="px-4 py-3 text-gray-600">API reference</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">GitHub Issues</td><td className="px-4 py-3 text-gray-600">Private repo</td><td className="px-4 py-3 text-gray-600">Bug reports</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>SLA Guarantees</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Plan</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Uptime</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Response Time</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">Support Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Starter</td><td className="px-4 py-3 text-gray-600">99.5%</td><td className="px-4 py-3 text-gray-600">24 hours</td><td className="px-4 py-3 text-gray-600">Business hours</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Growth</td><td className="px-4 py-3 text-gray-600">99.9%</td><td className="px-4 py-3 text-gray-600">4 hours</td><td className="px-4 py-3 text-gray-600">Extended hours</td></tr>
                      <tr><td className="px-4 py-3 font-bold text-gray-900">Enterprise</td><td className="px-4 py-3 text-gray-600">99.99%</td><td className="px-4 py-3 text-gray-600">1 hour</td><td className="px-4 py-3 text-gray-600">24/7 dedicated</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>Useful Commands</h3>
                <pre className="not-prose bg-gray-900 text-gray-100 rounded-2xl p-4 overflow-x-auto text-sm"><code>{`# View backend logs
docker-compose logs -f api

# Backup database
docker-compose exec db pg_dump -U $DB_USER $DB_NAME > backup_$(date +%F).sql

# Run migrations
npm run migrate:up

# Check service health
curl https://api.yourdomain.com/api/v1/health`}</code></pre>
              </section>

              {/* Final CTA */}
              <div className="mt-16 not-prose bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] p-10 lg:p-14 text-center">
                <h3 className="text-2xl lg:text-3xl font-black text-white mb-4">
                  Congratulations! You're ready to launch.
                </h3>
                <p className="text-gray-400 font-medium mb-8 max-w-xl mx-auto">
                  For questions, contact us at <strong className="text-blue-400">sales@novabit.exchange</strong> or visit <strong className="text-blue-400">novabit.exchange</strong>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="mailto:sales@novabit.exchange">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-base px-8 py-5 rounded-full font-bold shadow-xl group">
                      Contact Sales
                      <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </Button>
                  </a>
                  <Link to="/enterprise">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10 text-base px-8 py-5 rounded-full font-bold">
                      Back to Enterprise
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white fill-current" size={18} />
                </div>
                <span className="font-black text-xl tracking-tighter text-blue-600">NovaBit</span>
              </Link>
              <p className="text-gray-500 font-medium max-w-xs mb-8">
                Empowering the world to trade digital assets with confidence, speed, and absolute security.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Company</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Product</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><Link to="/markets" className="hover:text-blue-600">Markets</Link></li>
                <li><Link to="/enterprise" className="hover:text-blue-600">Enterprise</Link></li>
                <li><Link to="/onboarding" className="hover:text-blue-600">Onboarding Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Legal</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© 2024 NovaBit Exchange Inc. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <span>Status: All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingPage;