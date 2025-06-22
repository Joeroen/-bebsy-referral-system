import React, { useState, useEffect } from 'react';
import { 
  Gift, DollarSign, CreditCard, Clock, CheckCircle, XCircle, 
  User, Calendar, Filter, Search, Download, Upload, RefreshCw,
  AlertCircle, TrendingUp, Euro, Plus, Eye, Edit, MoreVertical,
  ArrowUp, ArrowDown, CheckSquare, FileText, Banknote
} from 'lucide-react';

// Utility functions
const formatCurrency = (amount) => `€${parseFloat(amount || 0).toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString('nl-NL');
const formatDateTime = (date) => new Date(date).toLocaleString('nl-NL');

// Dutch translations
const t = {
  // Headers
  rewardManagement: 'Beloningen Beheer',
  pendingRewards: 'Openstaande Beloningen',
  rewardHistory: 'Beloningen Geschiedenis',
  paymentTracking: 'Betaal Overzicht',
  
  // Reward statuses
  pending: 'In behandeling',
  approved: 'Goedgekeurd',
  paid: 'Uitbetaald',
  cancelled: 'Geannuleerd',
  
  // Reward types
  credit: 'Tegoed',
  cash: 'Contant',
  
  // Actions
  approve: 'Goedkeuren',
  reject: 'Afwijzen',
  markAsPaid: 'Markeren als betaald',
  processPayment: 'Betaling Verwerken',
  bulkApprove: 'Bulk Goedkeuren',
  bulkPay: 'Bulk Uitbetalen',
  export: 'Exporteren',
  refresh: 'Vernieuwen',
  filter: 'Filteren',
  search: 'Zoeken',
  
  // Table headers
  customer: 'Klant',
  amount: 'Bedrag',
  type: 'Type',
  status: 'Status',
  description: 'Beschrijving',
  referral: 'Referral',
  created: 'Aangemaakt',
  processed: 'Verwerkt',
  actions: 'Acties',
  
  // Statistics
  totalPending: 'Totaal Openstaand',
  totalApproved: 'Totaal Goedgekeurd',
  totalPaid: 'Totaal Uitbetaald',
  monthlyPayouts: 'Maandelijkse Uitbetalingen',
  averageReward: 'Gemiddelde Beloning',
  
  // Filters
  allTypes: 'Alle Types',
  allStatuses: 'Alle Statussen',
  dateFrom: 'Van Datum',
  dateTo: 'Tot Datum',
  
  // Messages
  loading: 'Laden...',
  noRewards: 'Geen beloningen gevonden',
  rewardApproved: 'Beloning goedgekeurd',
  rewardRejected: 'Beloning afgewezen',
  rewardPaid: 'Beloning gemarkeerd als betaald',
  bulkActionCompleted: 'Bulk actie voltooid',
  confirmApprove: 'Weet je zeker dat je deze beloning wilt goedkeuren?',
  confirmReject: 'Weet je zeker dat je deze beloning wilt afwijzen?',
  confirmPaid: 'Weet je zeker dat je deze beloning als betaald wilt markeren?',
  confirmBulkApprove: 'Weet je zeker dat je alle geselecteerde beloningen wilt goedkeuren?',
  confirmBulkPay: 'Weet je zeker dat je alle geselecteerde beloningen als betaald wilt markeren?',
  
  // Form fields
  customerName: 'Klant Naam',
  rewardAmount: 'Beloning Bedrag',
  rewardType: 'Beloning Type',
  rewardDescription: 'Beschrijving',
  paymentReference: 'Betaling Referentie',
  paymentMethod: 'Betaling Methode',
  notes: 'Notities',
  
  // Payment methods
  bankTransfer: 'Bankoverschrijving',
  creditSystem: 'Tegoed Systeem',
  cash: 'Contant',
  voucher: 'Voucher',
  
  // Bulk actions
  selectAll: 'Alles Selecteren',
  selectNone: 'Niets Selecteren',
  selectedItems: 'geselecteerde items',
  
  // Quick stats
  thisMonth: 'Deze Maand',
  lastMonth: 'Vorige Maand',
  growth: 'Groei',
  totalRewards: 'Totaal Beloningen'
};

// API functions
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
  },

  async put(endpoint, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  async post(endpoint, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }
};

// Notification Hook
function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const NotificationComponent = notification ? (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
      notification.type === 'error' ? 'bg-red-500 text-white' :
      notification.type === 'success' ? 'bg-green-500 text-white' :
      notification.type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  ) : null;

  return { showNotification, NotificationComponent };
}

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
function StatsCard({ title, value, icon: Icon, color, trend, isLoading }) {
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
                {trend.value}
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

// Reward Status Badge Component
function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'paid':
        return DollarSign;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const Icon = getStatusIcon(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
      <Icon className="h-3 w-3 mr-1" />
      {t[status] || status}
    </span>
  );
}

// Type Badge Component
function TypeBadge({ type }) {
  const getTypeStyle = (type) => {
    switch (type) {
      case 'credit':
        return 'bg-blue-100 text-blue-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return CreditCard;
      case 'cash':
        return Banknote;
      default:
        return Gift;
    }
  };

  const Icon = getTypeIcon(type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyle(type)}`}>
      <Icon className="h-3 w-3 mr-1" />
      {t[type] || type}
    </span>
  );
}

// Rewards Table Component
function RewardsTable({ 
  rewards, 
  loading, 
  selectedRewards, 
  onSelectReward, 
  onSelectAll, 
  onStatusChange 
}) {
  const handleStatusChange = (rewardId, newStatus) => {
    const confirmMessage = newStatus === 'approved' ? t.confirmApprove :
                          newStatus === 'cancelled' ? t.confirmReject :
                          newStatus === 'paid' ? t.confirmPaid : '';
    
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    
    onStatusChange(rewardId, newStatus);
  };

  if (loading) {
    return <LoadingSpinner text="Beloningen laden..." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedRewards.length === rewards.length && rewards.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.customer}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.amount}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.type}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.status}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.description}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.created}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rewards.map((reward) => (
            <tr key={reward.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedRewards.includes(reward.id)}
                  onChange={() => onSelectReward(reward.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{reward.customer_name}</div>
                    <div className="text-sm text-gray-500">{reward.customer_email}</div>
                    {reward.referral_code && (
                      <div className="text-xs text-blue-600">Code: {reward.referral_code}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{formatCurrency(reward.amount)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TypeBadge type={reward.type} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={reward.status} />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate" title={reward.description}>
                  {reward.description || '-'}
                </div>
                {reward.new_customer_email && (
                  <div className="text-xs text-gray-500">
                    Referral: {reward.new_customer_email}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(reward.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {reward.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(reward.id, 'approved')}
                        className="text-green-600 hover:text-green-900 p-1"
                        title={t.approve}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(reward.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900 p-1"
                        title={t.reject}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {reward.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(reward.id, 'paid')}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title={t.markAsPaid}
                    >
                      <DollarSign className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rewards.length === 0 && (
        <div className="text-center py-8">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t.noRewards}</p>
        </div>
      )}
    </div>
  );
}

// Bulk Actions Component
function BulkActions({ selectedCount, onBulkApprove, onBulkPay, onExport }) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-purple-800">
          {selectedCount} {t.selectedItems}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onBulkApprove}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {t.bulkApprove}
          </button>
          <button
            onClick={onBulkPay}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            {t.bulkPay}
          </button>
          <button
            onClick={onExport}
            className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            {t.export}
          </button>
        </div>
      </div>
    </div>
  );
}

// Filters Component
function RewardsFilters({ filters, onFiltersChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.search}
          </label>
          <input
            type="text"
            placeholder="Zoek klant..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.status}
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.allStatuses}</option>
            <option value="pending">{t.pending}</option>
            <option value="approved">{t.approved}</option>
            <option value="paid">{t.paid}</option>
            <option value="cancelled">{t.cancelled}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.type}
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.allTypes}</option>
            <option value="credit">{t.credit}</option>
            <option value="cash">{t.cash}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.dateFrom}
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.dateTo}
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => onFiltersChange({})}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          Filters wissen
        </button>
      </div>
    </div>
  );
}

// Main Rewards Management Component
export default function RewardsManagement() {
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRewards, setSelectedRewards] = useState([]);
  const [filters, setFilters] = useState({});
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchRewards();
    fetchStats();
  }, [filters]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const data = await api.get(`/rewards?${params.toString()}`);
      setRewards(data.rewards || []);
    } catch (error) {
      showNotification('Fout bij laden beloningen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats data - replace with real API call
      const mockStats = {
        totalPending: rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
        totalApproved: rewards.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0),
        totalPaid: rewards.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
        averageReward: rewards.length > 0 ? rewards.reduce((sum, r) => sum + r.amount, 0) / rewards.length : 0
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (rewardId, newStatus) => {
    try {
      await api.put(`/rewards/${rewardId}/status`, { status: newStatus });
      showNotification(
        newStatus === 'approved' ? t.rewardApproved :
        newStatus === 'cancelled' ? t.rewardRejected :
        newStatus === 'paid' ? t.rewardPaid :
        'Status bijgewerkt',
        'success'
      );
      fetchRewards();
      fetchStats();
      setSelectedRewards(prev => prev.filter(id => id !== rewardId));
    } catch (error) {
      showNotification('Fout bij bijwerken status', 'error');
    }
  };

  const handleSelectReward = (rewardId) => {
    setSelectedRewards(prev => 
      prev.includes(rewardId) 
        ? prev.filter(id => id !== rewardId)
        : [...prev, rewardId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRewards(
      selectedRewards.length === rewards.length 
        ? [] 
        : rewards.map(r => r.id)
    );
  };

  const handleBulkApprove = async () => {
    if (!window.confirm(t.confirmBulkApprove)) return;

    try {
      await Promise.all(
        selectedRewards.map(id => api.put(`/rewards/${id}/status`, { status: 'approved' }))
      );
      showNotification(t.bulkActionCompleted, 'success');
      setSelectedRewards([]);
      fetchRewards();
      fetchStats();
    } catch (error) {
      showNotification('Fout bij bulk goedkeuring', 'error');
    }
  };

  const handleBulkPay = async () => {
    if (!window.confirm(t.confirmBulkPay)) return;

    try {
      await Promise.all(
        selectedRewards.map(id => api.put(`/rewards/${id}/status`, { status: 'paid' }))
      );
      showNotification(t.bulkActionCompleted, 'success');
      setSelectedRewards([]);
      fetchRewards();
      fetchStats();
    } catch (error) {
      showNotification('Fout bij bulk uitbetaling', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const params = selectedRewards.length > 0 
        ? `?ids=${selectedRewards.join(',')}`
        : '';
      
      const response = await fetch(`http://localhost:3001/api/export/rewards${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beloningen-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showNotification('Export succesvol gedownload', 'success');
    } catch (error) {
      showNotification('Fout bij exporteren', 'error');
    }
  };

  const statCards = [
    {
      title: t.totalPending,
      value: formatCurrency(stats?.totalPending || 0),
      icon: Clock,
      color: 'yellow',
      trend: { direction: 'up', value: '+12%' }
    },
    {
      title: t.totalApproved,
      value: formatCurrency(stats?.totalApproved || 0),
      icon: CheckCircle,
      color: 'blue',
      trend: { direction: 'up', value: '+8%' }
    },
    {
      title: t.totalPaid,
      value: formatCurrency(stats?.totalPaid || 0),
      icon: DollarSign,
      color: 'green',
      trend: { direction: 'up', value: '+15%' }
    },
    {
      title: t.averageReward,
      value: formatCurrency(stats?.averageReward || 0),
      icon: TrendingUp,
      color: 'purple',
      trend: { direction: 'up', value: '+5%' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.rewardManagement}</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchRewards}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.refresh}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            {t.export}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatsCard
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

      {/* Filters */}
      <RewardsFilters filters={filters} onFiltersChange={setFilters} />

      {/* Bulk Actions */}
      <BulkActions 
        selectedCount={selectedRewards.length}
        onBulkApprove={handleBulkApprove}
        onBulkPay={handleBulkPay}
        onExport={handleExport}
      />

      {/* Rewards Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <RewardsTable
          rewards={rewards}
          loading={loading}
          selectedRewards={selectedRewards}
          onSelectReward={handleSelectReward}
          onSelectAll={handleSelectAll}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Snelle Statistieken</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Openstaande beloningen:</span>
              <span className="font-semibold text-yellow-600">
                {rewards.filter(r => r.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Goedgekeurde beloningen:</span>
              <span className="font-semibold text-blue-600">
                {rewards.filter(r => r.status === 'approved').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uitbetaalde beloningen:</span>
              <span className="font-semibold text-green-600">
                {rewards.filter(r => r.status === 'paid').length}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm font-medium text-gray-900">Totaal beloningen:</span>
              <span className="font-bold text-gray-900">{rewards.length}</span>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recente Uitbetalingen</h3>
          <div className="space-y-4">
            {rewards
              .filter(r => r.status === 'paid')
              .slice(0, 5)
              .map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reward.customer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(reward.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(reward.amount)}</p>
                    <p className="text-xs text-gray-500">{t[reward.type]}</p>
                  </div>
                </div>
              ))}
            {rewards.filter(r => r.status === 'paid').length === 0 && (
              <p className="text-gray-500 text-center py-4">Nog geen uitbetalingen</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Rewards Queue */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t.pendingRewards}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {rewards.filter(r => r.status === 'pending').length} openstaand
              </span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {rewards
              .filter(r => r.status === 'pending')
              .slice(0, 10)
              .map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reward.customer_name}</p>
                      <p className="text-sm text-gray-500">{reward.customer_email}</p>
                      <p className="text-xs text-gray-400">{formatDate(reward.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(reward.amount)}</p>
                      <TypeBadge type={reward.type} />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(reward.id, 'approved')}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title={t.approve}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(reward.id, 'cancelled')}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title={t.reject}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {rewards.filter(r => r.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">Geen openstaande beloningen</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {NotificationComponent}
    </div>
  );
}
