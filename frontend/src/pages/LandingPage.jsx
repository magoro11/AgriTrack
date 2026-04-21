import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            🌾 AgriTrack
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Smart Farm Management for Modern Agriculture
                </h1>
                <p className="text-xl text-slate-300">
                  Real-time field monitoring, activity tracking, and advanced analytics. Maximize yields and optimize costs with AgriTrack.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
                >
                  Get Started →
                </button>
                <button
                  className="px-8 py-4 rounded-lg border-2 border-sky-400 text-sky-400 font-semibold hover:bg-sky-400/10 transition-all"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </button>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-emerald-400">100%</p>
                  <p className="text-slate-400">Uptime Guarantee</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sky-400">24/7</p>
                  <p className="text-slate-400">Support Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">Real-time</p>
                  <p className="text-slate-400">Analytics & Insights</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
                <div className="space-y-4">
                  <div className="h-64 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 rounded-lg flex items-center justify-center border border-slate-600">
                    <div className="text-center">
                      <p className="text-5xl mb-2">📊</p>
                      <p className="text-slate-400">Advanced Analytics Dashboard</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-2xl mb-1">🌾</p>
                      <p className="text-sm text-slate-300">Field Monitoring</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-2xl mb-1">💰</p>
                      <p className="text-sm text-slate-300">Cost Analysis</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-2xl mb-1">📈</p>
                      <p className="text-sm text-slate-300">Yield Tracking</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-2xl mb-1">📋</p>
                      <p className="text-sm text-slate-300">Activity Logs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Powerful Features for Every Role
            </h2>
            <p className="text-xl text-slate-400">
              Built for farm managers and field agents who care about efficiency and results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Features */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8 hover:border-emerald-500/50 transition-all">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold text-white mb-4">For Farm Managers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Complete field overview and analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Create and manage unlimited fields with detailed metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Assign fields to field agents and track progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Real-time cost analysis and yield projections</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Visual charts and comprehensive activity audit logs</span>
                </li>
              </ul>
            </div>

            {/* Agent Features */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-8 hover:border-sky-500/50 transition-all">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <h3 className="text-2xl font-bold text-white mb-4">For Field Agents</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span className="text-slate-300">View only your assigned fields - focused workflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span className="text-slate-300">Update field stages from planted to harvest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span className="text-slate-300">Log activities with costs (fertilizer, irrigation, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span className="text-slate-300">Access detailed field metrics and soil data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span className="text-slate-300">Real-time feedback and performance analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Metrics Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Track Everything That Matters
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🌱', label: 'Soil Metrics', desc: 'pH, Nitrogen, Phosphorus, Potassium levels' },
              { icon: '🌤️', label: 'Weather Data', desc: 'Rainfall and temperature tracking' },
              { icon: '📊', label: 'Yield Analysis', desc: 'Expected vs actual harvest yields' },
              { icon: '💵', label: 'Cost Tracking', desc: 'Input costs and cost per hectare' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6 text-center hover:border-slate-600 transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.label}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works in 4 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { num: '1', title: 'Create Fields', desc: 'Add your fields with crop type and location' },
              { num: '2', title: 'Assign Agents', desc: 'Assign field agents to manage your fields' },
              { num: '3', title: 'Monitor & Track', desc: 'Get real-time updates and activity logs' },
              { num: '4', title: 'Analyze & Optimize', desc: 'View analytics and optimize operations' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-[55%] right-[-30%] h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                )}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 relative z-10">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: '1000+', label: 'Farms Using AgriTrack' },
              { number: '50M+', label: 'Hectares Under Management' },
              { number: '99.9%', label: 'System Uptime' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-slate-800">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-emerald-900/30 to-sky-900/30 border border-emerald-500/30 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Farm Operations?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and managers who are already maximizing yields and minimizing costs with AgriTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
              >
                Start Your Free Trial
              </button>
              <button
                className="px-8 py-4 rounded-lg border-2 border-slate-600 text-slate-300 font-semibold hover:border-slate-400 transition-all"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">AgriTrack</h4>
              <p className="text-slate-400 text-sm">Smart farm management for modern agriculture</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 AgriTrack. All rights reserved. Built with ❤️ for modern agriculture.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
