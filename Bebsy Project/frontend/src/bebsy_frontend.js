import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Gift, 
  TrendingUp, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Euro
} from 'lucide-react';

// API Base URL - change for production
const API_BASE = 'http://localhost:3001/api';

// Utility functions
const formatCurrency = (amount) => `€${parseFloat(amount).toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString('nl-NL');

// Auth context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API functions
const api = {
  async login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async get(endpoint, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  async post(endpoint, data, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  async put(endpoint, data, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  async uploadFile(endpoint, file, token) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
};

// Auth Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token validity
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login Component
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError('Ongeldige inloggegevens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bebsy Referral Systeem
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Log in op het admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Gebruikersnaam"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dashboard Stats Component
function DashboardStats() {
  const [stats, setStats] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats', token);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) {
    return <div className="text-center py-4">Statistieken laden...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Klanten</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <UserPlus className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Referrals</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalReferrals}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">In behandeling</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingReferrals}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Euro className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Uitbetaald</h3>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.totalRewards)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Customers Management Component
function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [showImport, setShowImport] = useState(false);
  const { token } = useAuth();

  const fetchCustomers = async (page = 1, searchTerm = '') => {
    try {
      const data = await api.get(`/customers?page=${page}&search=${searchTerm}`, token);
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(1, search);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE}/export/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `klanten-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Klantenbeheer</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importeren
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </button>
        </div>
      </div>

      {showImport && <ImportCustomers onSuccess={() => fetchCustomers()} />}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Zoek klanten..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Zoeken
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beloningen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aangemaakt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {customer.referral_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.referral_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.total_rewards || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Pagina {pagination.page} van {pagination.pages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchCustomers(pagination.page - 1, search)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Vorige
              </button>
              <button
                onClick={() => fetchCustomers(pagination.page + 1, search)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Volgende
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Import Customers Component
function ImportCustomers({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const { token } = useAuth();

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const data = await api.uploadFile('/customers/import', file, token);
      setResult(data);
      if (data.imported > 0) {
        onSuccess();
      }
    } catch (error) {
      setResult({ error: 'Import mislukt' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Klanten Importeren</h3>
      
      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV Bestand
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            CSV moet kolommen bevatten: bebsy_customer_id, name, email
          </p>
        </div>

        <button
          type="submit"
          disabled={!file || importing}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {importing ? 'Importeren...' : 'Importeren'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <div className="text-green-600">
              Import voltooid: {result.imported} geïmporteerd, {result.skipped} overgeslagen
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Referrals Management Component
function ReferralsManagement() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { token } = useAuth();

  const fetchReferrals = async () => {
    try {
      const data = await api.get(`/referrals?status=${filter}`, token);
      setReferrals(data.referrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [token, filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/referrals/${id}/status`, { status }, token);
      fetchReferrals();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'paid': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Referral Beheer</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Alle statussen</option>
            <option value="pending">In behandeling</option>
            <option value="approved">Goedgekeurd</option>
            <option value="paid">Uitbetaald</option>
            <option value="cancelled">Geannuleerd</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nieuwe Klant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Boeking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrals.map((referral) => (
              <tr key={referral.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{referral.referrer_name}</div>
                    <div className="text-sm text-gray-500">{referral.referrer_email}</div>
                    <div className="text-xs text-blue-600">{referral.referral_code}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {referral.new_customer_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {referral.booking_reference || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(referral.reward_status)}`}>
                    {getStatusIcon(referral.reward_status)}
                    <span className="ml-1 capitalize">{referral.reward_status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(referral.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {referral.reward_status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(referral.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => updateStatus(referral.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Annuleren
                      </button>
                    </div>
                  )}
                  {referral.reward_status === 'approved' && (
                    <button
                      onClick={() => updateStatus(referral.id, 'paid')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Markeren als betaald
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Rewards Management Component
function RewardsManagement() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchRewards = async () => {
    try {
      const data = await api.get('/rewards', token);
      setRewards(data.rewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Beloningen Overzicht</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bedrag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beschrijving
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reward.customer_name}</div>
                    <div className="text-sm text-gray-500">{reward.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(reward.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reward.type === 'credit' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {reward.type === 'credit' ? 'Tegoed' : 'Contant'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reward.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    reward.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reward.status === 'paid' ? 'Uitbetaald' : 
                     reward.status === 'approved' ? 'Goedgekeurd' : 'In behandeling'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {reward.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(reward.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ activeTab, setActiveTab }) {
  const { logout, user } = useAuth();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'customers', name: 'Klanten', icon: Users },
    { id: 'referrals', name: 'Referrals', icon: UserPlus },
    { id: 'rewards', name: 'Beloningen', icon: Gift }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Bebsy Referral Systeem</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-4">Welkom, {user?.username}</span>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'customers':
        return <CustomersManagement />;
      case 'referrals':
        return <ReferralsManagement />;
      case 'rewards':
        return <RewardsManagement />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}

export default App;
