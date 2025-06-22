import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Gift, TrendingUp, Clock, Euro, 
  Plus, Upload, Download, Activity, Calendar,
  CheckCircle, XCircle, AlertCircle, BarChart3,
  RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Utility functions
const formatCurrency = (amount) => `€${parseFloat(amount || 0).toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString('nl-NL');
const formatDateTime = (date) => new Date(date).toLocaleString('nl-NL');

// Dutch translations
const t = {
  dashboard: 'Dashboard',
  totalCustomers: 'Totaal Klanten',
  totalReferrals: 'Totaal Referrals',
  pendingReferrals: 'In Behandeling',
  totalRewardsPaid: 'Uitbetaald',
  recentActivity: 'Recente Activiteit',
  topReferrers: 'Top Referrers',
  referralTrend: 'Referral Trend',
  monthlyGrowth: 'Maandelijkse Groei',
  conversionRate: 'Conversieratio',
  quickActions: 'Snelle Acties',
  addCustomer: 'Klant Toevoegen',
  addReferral: 'Referral Toevoegen',
  importData: 'Data Importeren',
  exportData: 'Data Exporteren',
  viewReports: 'Rapporten Bekijken',
  refresh: 'Vernieuwen',
  loading: 'Laden...',
  thisMonth: 'Deze Maand',
  lastMonth: 'Vorige Maand',
  growth: 'Groei',
  noData: 'Geen gegevens beschikbaar',
  referrals: 'referrals',
  customers: 'klanten',
  rewards: 'beloningen',
  approved: 'goedgekeurd',
  paid: 'uitbetaald',
  pending: 'in behandeling',
  cancelled: 'geannuleerd'
};

// API functions (assuming these exist in parent context)
const api = {
  async get(endpoint) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Request failed');
    }
    
    return response.json();
  }
};

// Loading Spinner Component
function LoadingSpinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-600"></div>
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color, trend, isLoading }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.direction === 'up' ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : trend.direction === 'down' ? (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              ) : null}
              <span className={`text-xs ${
                trend.direction === 'up' ? 'text-green-600' : 
                trend.direction === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend.value} {trend.period}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Chart Components
function ReferralTrendChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.referralTrend}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('nl-NL')}
            formatter={(value) => [value, 'Referrals']}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Monthly Growth Chart
function MonthlyGrowthChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.monthlyGrowth}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('nl-NL', { month: 'short' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
          />
          <Bar dataKey="customers" fill="#3B82F6" name="Klanten" />
          <Bar dataKey="referrals" fill="#10B981" name="Referrals" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Status Distribution Chart
function StatusDistributionChart({ data, isLoading }) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Verdeling</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Top Referrers Component
function TopReferrers({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.topReferrers}</h3>
      <div className="space-y-4">
        {data?.slice(0, 5).map((referrer, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{referrer.name}</p>
                <p className="text-sm text-gray-500">{referrer.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{referrer.referral_count}</p>
              <p className="text-xs text-gray-500">{t.referrals}</p>
            </div>
          </div>
        )) || (
          <p className="text-gray-500 text-center py-4">{t.noData}</p>
        )}
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ activities, isLoading }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'referral': return UserPlus;
      case 'reward': return Gift;
      case 'customer': return Users;
      case 'approval': return CheckCircle;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'referral': return 'text-green-600 bg-green-100';
      case 'reward': return 'text-purple-600 bg-purple-100';
      case 'customer': return 'text-blue-600 bg-blue-100';
      case 'approval': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.recentActivity}</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities?.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{formatDateTime(activity.time)}</p>
              </div>
            </div>
          );
        }) || (
          <p className="text-gray-500 text-center py-4">{t.noData}</p>
        )}
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions({ onAction }) {
  const actions = [
    { id: 'add-customer', label: t.addCustomer, icon: Users, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'add-referral', label: t.addReferral, icon: UserPlus, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'import-data', label: t.importData, icon: Upload, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'export-data', label: t.exportData, icon: Download, color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions}</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`flex items-center justify-center p-4 rounded-lg text-white transition-colors ${action.color}`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [referralTrend, setReferralTrend] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [topReferrers, setTopReferrers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch main statistics
      const statsData = await api.get(`/dashboard/stats?period=${period}`);
      setStats(statsData);
      
      // Process referral trend data
      if (statsData.referralTrend) {
        setReferralTrend(statsData.referralTrend);
      }
      
      // Set top referrers
      if (statsData.topReferrers) {
        setTopReferrers(statsData.topReferrers);
      }
      
      // Generate mock data for other charts (replace with real API calls)
      generateMockData(statsData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Generate fallback mock data
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (statsData = {}) => {
    // Generate monthly growth data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toISOString(),
        customers: Math.floor(Math.random() * 50) + 20,
        referrals: Math.floor(Math.random() * 30) + 10
      });
    }
    setMonthlyGrowth(months);
    
    // Generate status distribution
    setStatusDistribution([
      { name: t.pending, value: statsData.pendingReferrals || 15 },
      { name: t.approved, value: Math.floor((statsData.totalReferrals || 50) * 0.4) },
      { name: t.paid, value: Math.floor((statsData.totalReferrals || 50) * 0.3) },
      { name: t.cancelled, value: Math.floor((statsData.totalReferrals || 50) * 0.1) }
    ]);
    
    // Generate recent activities
    const activities = [
      {
        type: 'referral',
        message: 'Nieuwe referral van Jan Jansen voor nieuwe.klant@example.com',
        time: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        type: 'reward',
        message: 'Beloning van €25 uitbetaald aan Maria Smit',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        type: 'customer',
        message: 'Nieuwe klant toegevoegd: Piet de Vries',
        time: new Date(Date.now() - 1000 * 60 * 60 * 4)
      },
      {
        type: 'approval',
        message: '3 referrals goedgekeurd door admin',
        time: new Date(Date.now() - 1000 * 60 * 60 * 6)
      },
      {
        type: 'referral',
        message: 'Referral geannuleerd: ongeldige boeking',
        time: new Date(Date.now() - 1000 * 60 * 60 * 8)
      }
    ];
    setRecentActivities(activities);
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'add-customer':
        // Trigger add customer modal
        console.log('Add customer action');
        break;
      case 'add-referral':
        // Trigger add referral modal
        console.log('Add referral action');
        break;
      case 'import-data':
        // Trigger import modal
        console.log('Import data action');
        break;
      case 'export-data':
        // Trigger export
        console.log('Export data action');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Calculate trends for stat cards
  const getStatTrend = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    const percent = Math.abs((change / previous) * 100).toFixed(1);
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      value: `${percent}%`,
      period: 'vs vorige maand'
    };
  };

  const statCards = [
    {
      title: t.totalCustomers,
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'blue',
      trend: getStatTrend(stats?.totalCustomers || 0, 85)
    },
    {
      title: t.totalReferrals,
      value: stats?.totalReferrals || 0,
      icon: UserPlus,
      color: 'green',
      trend: getStatTrend(stats?.totalReferrals || 0, 42)
    },
    {
      title: t.pendingReferrals,
      value: stats?.pendingReferrals || 0,
      icon: Clock,
      color: 'yellow',
      trend: getStatTrend(stats?.pendingReferrals || 0, 8)
    },
    {
      title: t.totalRewardsPaid,
      value: formatCurrency(stats?.totalRewards || 0),
      icon: Euro,
      color: 'purple',
      trend: getStatTrend(parseFloat(stats?.totalRewards || 0), 875)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.dashboard}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Periode:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">7 dagen</option>
              <option value="30">30 dagen</option>
              <option value="90">90 dagen</option>
              <option value="365">1 jaar</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.refresh}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            isLoading={loading}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralTrendChart data={referralTrend} isLoading={loading} />
        <MonthlyGrowthChart data={monthlyGrowth} isLoading={loading} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusDistributionChart data={statusDistribution} isLoading={loading} />
        <TopReferrers data={topReferrers} isLoading={loading} />
        <QuickActions onAction={handleQuickAction} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} isLoading={loading} />
    </div>
  );
}
