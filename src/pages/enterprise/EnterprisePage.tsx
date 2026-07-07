import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Zap, Shield, ChevronRight, CheckCircle2, Server, Wallet,
  Smartphone, LayoutDashboard, Activity, ChevronDown,
  Star, Globe, Lock, Users, ArrowRight, BarChart3, Infinity
} from 'lucide-react';

const features = [
  {
    icon: <Shield className="text-blue-600" size={32} />,
    title: 'KYC/AML Compliance',
    desc: 'Automated identity verification with global compliance frameworks. Support for 100+ country documents, liveness detection, and sanction screening.',
  },
  {
    icon: <Server className="text-blue-600" size={32} />,
    title: 'Matching Engine',
    desc: 'Ultra-low latency order matching engine capable of 2M+ transactions per second with FIFO allocation and advanced order types.',
  },
  {
    icon: <Wallet className="text-blue-600" size={32} />,
    title: 'Wallet System',
    desc: 'Multi-currency wallet with hierarchical deterministic (HD) key generation, cold storage, and automated hot/cold wallet management.',
  },
  {
    icon: <Smartphone className="text-blue-600" size={32} />,
    title: 'Multi-Platform',
    desc: 'Fully responsive web app plus native iOS and Android apps. Consistent experience across all devices with shared backend.',
  },
  {
    icon: <LayoutDashboard className="text-blue-600" size={32} />,
    title: 'Admin Dashboard',
    desc: 'Comprehensive admin panel for user management, trade oversight, withdrawal approvals, system monitoring, and business analytics.',
  },
  {
    icon: <Activity className="text-blue-600" size={32} />,
    title: 'Liquidity Management',
    desc: 'Built-in liquidity aggregation, market making tools, and smart order routing. Connect to external liquidity providers seamlessly.',
  },
];

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$5,000',
    period: '/month',
    description: 'Perfect for startups testing the waters in crypto exchange.',
    highlighted: false,
    features: [
      'Up to 10,000 users',
      '5 supported cryptocurrencies',
      'Basic KYC/AML',
      'Standard matching engine',
      'Web platform only',
      'Email support',
      'API access',
    ],
  },
  {
    name: 'Growth',
    price: '$15,000',
    period: '/month',
    description: 'Built for growing exchanges that need more power and reach.',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Up to 100,000 users',
      '50+ supported cryptocurrencies',
      'Advanced KYC/AML with liveness',
      'High-performance matching engine',
      'Web + Mobile apps (iOS & Android)',
      'Admin dashboard',
      'Priority support',
      'Liquidity integration',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations with unique requirements.',
    highlighted: false,
    features: [
      'Unlimited users',
      'All cryptocurrencies',
      'Custom KYC/AML workflows',
      'Enterprise-grade matching engine',
      'Full white-label branding',
      'Dedicated infrastructure',
      '24/7 dedicated support',
      'Custom feature development',
      'SLA guarantee',
    ],
  },
];

const faqs = [
  {
    q: 'How fast can I launch my exchange?',
    a: 'Most clients launch within 7-14 days. Our turnkey solution includes pre-configured infrastructure, smart contracts, and regulatory templates. The timeline depends on customization needs and licensing requirements in your jurisdiction.',
  },
  {
    q: 'Do I need a crypto license to operate?',
    a: 'Regulatory requirements vary by jurisdiction. We provide compliance frameworks for major regulatory bodies (MSB, VASP, etc.) and can connect you with legal partners who specialize in crypto licensing. Our KYC/AML system is designed to meet global standards.',
  },
  {
    q: 'Can I customize the branding and UI?',
    a: 'Absolutely. The Enterprise plan includes full white-labeling — custom domain, logo, color scheme, and UI modifications. The Growth plan includes logo and color customization. Every plan allows you to operate under your own brand.',
  },
  {
    q: 'What cryptocurrencies are supported?',
    a: 'We support BTC, ETH, USDT, USDC, SOL, ADA, XRP, DOT, DOGE, LINK, AVAX, and 40+ more out of the box. We can add any EVM-compatible token within 48 hours. Enterprise clients get custom asset onboarding.',
  },
  {
    q: 'How does liquidity work?',
    a: 'We provide built-in liquidity aggregation connecting to major exchanges and market makers. Our smart order routing ensures best price execution. Growth and Enterprise plans include dedicated liquidity management and market making tools.',
  },
  {
    q: 'What kind of support do you provide?',
    a: 'Starter includes email support with 24-hour response. Growth includes priority support with 4-hour response. Enterprise includes a dedicated account manager and 24/7 support with 1-hour critical response. All plans include comprehensive documentation.',
  },
];

const EnterprisePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <a href="/markets" className="hover:text-blue-600 transition-colors">Markets</a>
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
        {/* Enterprise Hero */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-28 lg:pb-40 bg-gradient-to-b from-blue-50/50 via-white to-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-400/10 blur-[150px] rounded-full" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
                  <Star className="text-blue-600" size={14} />
                  NovaBit Enterprise
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
                  Launch Your Own{' '}
                  <span className="text-blue-600">Crypto Exchange</span>
                  {' '}in 7 Days.
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  A complete white-label cryptocurrency exchange platform. 
                  Take our battle-tested technology and launch under your own brand — 
                  with KYC, liquidity, and mobile apps included.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                  <a href="#pricing">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-10 py-7 rounded-full font-bold shadow-xl shadow-blue-100 group">
                      View Plans
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <a href="#contact">
                    <Button variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full font-bold border-2 hover:bg-gray-50">
                      Talk to Sales
                    </Button>
                  </a>
                </div>
                <div className="flex items-center gap-8 justify-center lg:justify-start pt-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black">7 Days</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Time to Launch</span>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black">100%</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">White-Label</span>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black">200+</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Assets Supported</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="bg-gray-900 rounded-[2rem] p-8 lg:p-10 shadow-2xl border border-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-white/40 text-xs font-mono">enterprise.novabit.exchange</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">BTC/USDT</span>
                      <span className="text-green-400 font-mono font-bold">$67,432.21</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ETH/USDT</span>
                      <span className="text-green-400 font-mono font-bold">$3,456.78</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">SOL/USDT</span>
                      <span className="text-red-400 font-mono font-bold">$142.93</span>
                    </div>
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">24h Volume</span>
                        <span className="text-white font-bold text-sm">$2.4B</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <Globe size={14} />
                    <span>Live data • Powered by NovaBit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 bg-gray-50/80 border-y border-gray-100">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 text-gray-300">
              {['FinTech Labs', 'BlockChain Corp', 'DigitalX', 'CryptoVault', 'TradeWave', 'PayFi'].map((name) => (
                <span key={name} className="text-lg font-black tracking-tight opacity-50 hover:opacity-80 transition-opacity">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Everything You Need</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                A complete exchange platform, delivered.
              </h3>
              <p className="text-lg text-gray-500 font-medium">
                Every component is production-ready. Customize what you need, launch what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{f.title}</h4>
                  <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Simple Pricing</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                Plans that scale with you.
              </h3>
              <p className="text-lg text-gray-500 font-medium">
                Start small, grow big. All plans include our core exchange infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`relative rounded-[2rem] border-2 p-10 transition-all duration-300 ${
                    tier.highlighted
                      ? 'border-blue-500 bg-white shadow-2xl shadow-blue-100 scale-105 lg:scale-110'
                      : 'border-gray-100 bg-white hover:shadow-xl hover:-translate-y-2'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {tier.badge}
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold mb-2">{tier.name}</h4>
                    <p className="text-gray-500 text-sm font-medium mb-6">{tier.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-black text-gray-900">{tier.price}</span>
                      {tier.period && (
                        <span className="text-gray-400 font-bold text-lg">{tier.period}</span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {tier.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-600 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={
                      tier.name === 'Starter'
                        ? 'https://buy.stripe.com/4gM9ATg5sbvObKQ6J0awo00'
                        : tier.name === 'Growth'
                        ? 'https://buy.stripe.com/eVq3cv06udDW8yE5EWawo01'
                        : '#contact'
                    }
                    target={tier.name !== 'Enterprise' ? '_blank' : undefined}
                    rel={tier.name !== 'Enterprise' ? 'noopener noreferrer' : undefined}
                  >
                    <Button
                      className={`w-full rounded-full py-6 font-bold text-base ${
                        tier.highlighted
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {tier.name === 'Enterprise' ? 'Contact Sales' : 'Buy Now'}
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="py-28">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-12 lg:p-24 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full" />
              <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 space-y-8">
                  <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm">Enterprise Grade</h2>
                  <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                    Built for scale. Secured to the highest standard.
                  </h3>
                  <div className="space-y-6">
                    {[
                      'SOC 2 Type II certified infrastructure',
                      'Multi-region, high-availability deployment',
                      'Real-time fraud detection & AI monitoring',
                      'Regulatory compliance frameworks included',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-gray-300">
                        <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-lg font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 text-center">
                    <Lock className="text-blue-500 mx-auto mb-4" size={40} />
                    <h4 className="text-white font-bold text-xl">99.99%</h4>
                    <p className="text-gray-400 text-sm mt-1">Uptime SLA</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 text-center">
                    <Infinity className="text-blue-500 mx-auto mb-4" size={40} />
                    <h4 className="text-white font-bold text-xl">Unlimited</h4>
                    <p className="text-gray-400 text-sm mt-1">Scalability</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 text-center">
                    <Users className="text-blue-500 mx-auto mb-4" size={40} />
                    <h4 className="text-white font-bold text-xl">1M+</h4>
                    <p className="text-gray-400 text-sm mt-1">Concurrent Users</p>
                  </div>
                  <div className="col-span-2 bg-blue-600 p-8 rounded-3xl text-center">
                    <BarChart3 className="text-white mx-auto mb-4" size={40} />
                    <h4 className="text-white font-bold text-xl">2M TPS</h4>
                    <p className="text-blue-200 text-sm mt-1">Matching Engine Throughput</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-28 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">FAQ</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                Frequently asked questions.
              </h3>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-lg text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-6 pb-6 text-gray-500 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / Contact Section */}
        <section id="contact" className="py-28">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-[3rem] p-12 lg:p-24 max-w-5xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-white/5 blur-[80px] rounded-full" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                  Ready to launch your exchange?
                </h2>
                <p className="text-xl text-blue-200 font-medium max-w-2xl mx-auto">
                  Get in touch with our team. We'll walk you through the platform, 
                  answer your questions, and help you go live in days, not months.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a href="mailto:sales@novabit.exchange">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-12 py-7 rounded-full font-bold shadow-2xl group">
                      Contact Sales
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <a href="#pricing">
                    <Button variant="outline" className="border-blue-400 text-white hover:bg-blue-600 text-lg px-10 py-7 rounded-full font-bold">
                      View Pricing
                    </Button>
                  </a>
                </div>
                <p className="text-blue-200/60 text-sm font-bold uppercase tracking-widest">
                  Free consultation • No commitment required
                </p>
              </div>
            </div>
          </div>
        </section>
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
                <li><a href="#" className="hover:text-blue-600">Fees</a></li>
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

export default EnterprisePage;