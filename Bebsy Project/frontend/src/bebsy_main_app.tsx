import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Users, UserPlus, Gift, Home, LogOut
} from 'lucide-react';

// Configuration
const API_BASE = 'http://localhost:3001/api';

// Dutch translations
const translations = {
  // Navigation
  dashboard: 'Dashboard',
  customers: 'Klanten',
  referrals: 'Referrals',
  rewards: 'Beloningen',
  logout: 'Uitloggen',
  
  // Login
  loginTitle: 'Bebsy Referral Systeem',
  loginSubtitle: 'Log in op het admin dashboard',
  username: 'Gebruikersnaam',
  password: 'Wachtwoord',
  login: 'Inloggen',
  invalidCredentials: 'Ongeldige inloggegevens',
  welcome: 'Welkom',
  loading: 'Laden...'
};

// Context
const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// API Functions
export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { username, password }
    });
  },

  async get(endpoint) {
    return this.request(endpoint);
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  },

  async uploadFile(endpoint, file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  }
};

// App Provider
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.login(username, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, showNotification, loading }}>
      {children}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </AppContext.Provider>
  );
}

// Notification Component
function Notification({ message, type, onClose }) {
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Loading Component
export function LoadingSpinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-600"></div>
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

// Login Component
function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  const handleSubmit = async () => {
    if (!credentials.username || !credentials.password) return;
    
    setError('');
    setLoading(true);

    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      setError(translations.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{translations.loginTitle}</h2>
            <p className="text-gray-600 mt-2">{translations.loginSubtitle}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.username}
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.username}
                value={credentials.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.password}
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.password}
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? translations.loading : translations.login}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2">
              Username: admin<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ activeTab, setActiveTab }) {
  const { logout, user } = useApp();

  const tabs = [
    { id: 'dashboard', name: translations.dashboard, icon: Home },
    { id: 'customers', name: translations.customers, icon: Users },
    { id: 'referrals', name: translations.referrals, icon: UserPlus },
    { id: 'rewards', name: translations.rewards, icon: Gift }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{translations.loginTitle}</h1>
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
                        ? 'border-blue-500 text-gray-900 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm flex items-center rounded-t-lg transition-colors`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm text-gray-700">{translations.welcome}, {user?.username}</span>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-500 hover:text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {translations.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500'
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center min-w-0 flex-1 justify-center`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Placeholder components for other sections
function DashboardPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations.dashboard}</h2>
      <p className="text-gray-600">Dashboard component will be implemented in the next artifact.</p>
    </div>
  );
}

function CustomersPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations.customers}</h2>
      <p className="text-gray-600">Customer management component will be implemented in the next artifact.</p>
    </div>
  );
}

function ReferralsPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations.referrals}</h2>
      <p className="text-gray-600">Referral tracking component will be implemented in the next artifact.</p>
    </div>
  );
}

function RewardsPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations.rewards}</h2>
      <p className="text-gray-600">Rewards management component will be implemented in the next artifact.</p>
    </div>
  );
}

// Main Dashboard Component
function MainDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPlaceholder />;
      case 'customers':
        return <CustomersPlaceholder />;
      case 'referrals':
        return <ReferralsPlaceholder />;
      case 'rewards':
        return <RewardsPlaceholder />;
      default:
        return <DashboardPlaceholder />;
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text={translations.loading} />
      </div>
    );
  }

  return user ? <MainDashboard /> : <LoginForm />;
}

export default App;
