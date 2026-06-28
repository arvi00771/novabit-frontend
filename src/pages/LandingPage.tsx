import React, { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Shield, Zap, BarChart3, Globe, CheckCircle2, ChevronRight, Lock, Smartphone } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
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
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  New Version 2.0 is Live
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
                  The Future of <span className="text-blue-600">Crypto Trading</span> is Here.
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Join 2M+ users on NovaBit. Securely buy, sell, and trade over 200+ digital assets with the world's lowest fees.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-10 py-7 rounded-full font-bold shadow-xl shadow-blue-100 group">
                      Start Trading Now
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/markets" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full font-bold border-2 hover:bg-gray-50">
                      View Markets
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-8 justify-center lg:justify-start pt-8">
                   <div className="flex flex-col">
                      <span className="text-2xl font-black">$0.00</span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Trading Fees</span>
                   </div>
                   <div className="w-px h-10 bg-gray-100" />
                   <div className="flex flex-col">
                      <span className="text-2xl font-black">200+</span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Digital Assets</span>
                   </div>
                   <div className="w-px h-10 bg-gray-100" />
                   <div className="flex flex-col">
                      <span className="text-2xl font-black">0.02ms</span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Latency</span>
                   </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full" />
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500 lg:scale-110">
                   <img 
                    src="/src/assets/hero.png" 
                    alt="Trading Interface" 
                    className="rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1611974717483-585824c16551?q=80&w=2070&auto=format&fit=crop";
                    }}
                   />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Core Ecosystem</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">Built for Professionals, Designed for Everyone.</h3>
              <p className="text-lg text-gray-500 font-medium">Everything you need to grow your crypto portfolio in one place.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Zap className="text-blue-600" size={32} />, 
                  title: 'Lightning Fast', 
                  desc: 'Proprietary matching engine capable of 2M+ transactions per second.' 
                },
                { 
                  icon: <Shield className="text-blue-600" size={32} />, 
                  title: 'Grade-A Security', 
                  desc: '98% of assets stored in offline cold wallets with institutional-grade encryption.' 
                },
                { 
                  icon: <BarChart3 className="text-blue-600" size={32} />, 
                  title: 'Advanced Analytics', 
                  desc: 'Real-time charts, indicators, and historical data at your fingertips.' 
                },
              ].map((f, i) => (
                <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                    {f.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{f.title}</h4>
                  <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Trust Section */}
        <section id="security" className="py-32">
           <div className="container mx-auto px-6">
              <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-24 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full" />
                 <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 space-y-8">
                       <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm">Security First</h2>
                       <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight">Your assets are safe, always.</h3>
                       <div className="space-y-6">
                          {[
                            'Multisig Cold Storage Wallet System',
                            'Personalized Whitelisting & 2FA',
                            'Real-time Threat Monitoring & AI Shield',
                            'Fully Regulated & Compliant Operations'
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
                          <h4 className="text-white font-bold text-xl">SOC2 Type II</h4>
                       </div>
                       <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 text-center">
                          <Globe className="text-blue-500 mx-auto mb-4" size={40} />
                          <h4 className="text-white font-bold text-xl">ISO 27001</h4>
                       </div>
                       <div className="col-span-2 bg-blue-600 p-8 rounded-3xl text-center">
                          <Smartphone className="text-white mx-auto mb-4" size={40} />
                          <h4 className="text-white font-bold text-xl">Hardware Key Support</h4>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 text-center">
           <div className="container mx-auto px-6">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">Ready to take control?</h2>
              <p className="text-2xl text-gray-500 mb-12 max-w-2xl mx-auto">Create an account in minutes and start your journey with NovaBit.</p>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-xl px-12 py-8 rounded-full font-bold shadow-2xl shadow-blue-200">
                  Register Account Free
                </Button>
              </Link>
              <p className="mt-8 text-sm text-gray-400 font-bold uppercase tracking-widest">No credit card required</p>
           </div>
        </section>
      </main>

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
                 {/* Social icons placeholder */}
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
                <li><a href="#" className="hover:text-blue-600">Exchange</a></li>
                <li><a href="#" className="hover:text-blue-600">Wallet</a></li>
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

export default LandingPage;
