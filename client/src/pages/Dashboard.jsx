import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  TrendingUp, Users, FileText, CheckCircle2, Clock, AlertCircle, 
  IndianRupee, CreditCard, Landmark, Wallet, RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard statistics. Is the backend online?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral-500 border-t-transparent"></div>
          <p className="text-sm text-navy-500 dark:text-navy-400">Compiling analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-rose-50 p-4 text-rose-500 dark:bg-rose-950/20 dark:text-rose-450">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-lg font-bold text-navy-900 dark:text-white">{error}</h3>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const {
    todayRevenue,
    monthlyRevenue,
    totalPatients,
    pendingReports,
    waitingReports,
    approvedReports,
    paymentSummary,
    revenueChart
  } = stats || {};

  // Custom calculations for charts
  const maxRevenueVal = Math.max(...revenueChart.map(d => d.total), 1000);
  
  // Method payment details mapping
  const paymentIcons = {
    'Cash': Wallet,
    'Card': CreditCard,
    'UPI': TrendingUp,
    'Net Banking': Landmark
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Jyothi Lab Analytics</h1>
          <p className="text-sm text-navy-500 dark:text-navy-450">Real-time revenue, patient records, and workflow indicators.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-navy-800"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">Today's Revenue</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-450">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">₹{todayRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
            <p className="mt-1 text-xs text-emerald-500">Collected today</p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">Monthly Revenue</span>
            <div className="rounded-lg bg-coral-50 p-2 text-coral-500 dark:bg-coral-950/10 dark:text-coral-450">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">₹{monthlyRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
            <p className="mt-1 text-xs text-coral-500">Current calendar month</p>
          </div>
        </div>

        {/* Total Patients */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">Total Patients</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-500 dark:bg-blue-950/20 dark:text-blue-450">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">{totalPatients}</h3>
            <p className="mt-1 text-xs text-blue-500">Registered UHIDs</p>
          </div>
        </div>

        {/* Total Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">Approved Reports</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-500 dark:bg-purple-950/20 dark:text-purple-450">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">{approvedReports}</h3>
            <p className="mt-1 text-xs text-purple-500">Verified and delivered</p>
          </div>
        </div>
      </div>

      {/* Reports Workflow Indicators */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/15 dark:text-amber-450">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Pending Entry</p>
            <h4 className="text-2xl font-bold text-navy-850 dark:text-white">{pendingReports}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-950/15 dark:text-blue-450">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Awaiting Approval</p>
            <h4 className="text-2xl font-bold text-navy-850 dark:text-white">{waitingReports}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/15 dark:text-emerald-450">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Finalized Reports</p>
            <h4 className="text-2xl font-bold text-navy-850 dark:text-white">{approvedReports}</h4>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 7-Day Revenue Trend Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <h3 className="text-base font-bold text-navy-950 dark:text-white mb-6">Revenue Trend (Last 7 Days)</h3>
          
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 600 240" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 60, 120, 180].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="580"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="dark:stroke-navy-800"
                />
              ))}

              {/* Draw Area path */}
              {(() => {
                const points = revenueChart.map((d, index) => {
                  const x = 50 + index * 85;
                  const ratio = maxRevenueVal > 0 ? d.total / maxRevenueVal : 0;
                  const y = 180 - ratio * 150;
                  return { x, y };
                });

                if (points.length === 0) return null;

                const pathD = `M ${points[0].x} ${points[0].y} ` + 
                  points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
                  ` L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

                const lineD = `M ${points[0].x} ${points[0].y} ` + 
                  points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

                return (
                  <>
                    <path d={pathD} fill="url(#chart-grad)" />
                    <path d={lineD} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                    
                    {/* Data Points */}
                    {points.map((p, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="#f43f5e"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all hover:r-6"
                        />
                        {/* Tooltip */}
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          className="opacity-0 group-hover:opacity-100 fill-navy-800 dark:fill-white transition-opacity bg-white"
                        >
                          ₹{revenueChart[idx].total}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* X Axis Labels */}
              {revenueChart.map((d, index) => (
                <text
                  key={index}
                  x={50 + index * 85}
                  y="200"
                  textAnchor="middle"
                  fontSize="9"
                  className="fill-navy-400 dark:fill-navy-500 font-semibold"
                >
                  {d.date.split(',')[0]}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Payment Summary breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-850 dark:bg-navy-900">
          <h3 className="text-base font-bold text-navy-950 dark:text-white mb-6">Payment Modes Summary</h3>
          <div className="space-y-4">
            {paymentSummary && paymentSummary.length > 0 ? (
              paymentSummary.map((item, idx) => {
                const Icon = paymentIcons[item.payment_method] || Wallet;
                const totalAmt = parseFloat(item.total) || 0;
                return (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-navy-850">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-50 p-2.5 text-navy-600 dark:bg-navy-800 dark:text-navy-300">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-850 dark:text-white">{item.payment_method}</p>
                        <p className="text-xs text-navy-450 dark:text-navy-500">Total collected</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy-900 dark:text-white">₹{totalAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex h-44 flex-col items-center justify-center text-navy-400 dark:text-navy-650">
                <p className="text-sm">No payment data recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
