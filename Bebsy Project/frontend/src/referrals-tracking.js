import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Award,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  AlertCircle,
  Check,
  Bell,
  BarChart3,
  FileText,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';

const ReferralsTracking = () => {
  // Sample data
  const [referrals, setReferrals] = useState([
    {
      id: 1,
      referenceCode: 'REF-2024-001',
      referrerName: 'Jan de Vries',
      referrerId: 1,
      prospectName: 'Emma Bakker',
      prospectEmail: 'emma.bakker@email.com',
      prospectPhone: '+31 6 12345678',
      service: 'Thuiszorg Pakket Premium',
      status: 'In Behandeling',
      dateSubmitted: '2024-06-15',
      dateApproved: null,
      dateCompleted: null,
      bookingReference: null,
      rewardAmount: 150,
      conversionValue: 2400,
      notes: 'Interesse in weekendservice',
      timeline: [
        { date: '2024-06-15', status: 'Ingediend', description: 'Verwijzing ontvangen' },
        { date: '2024-06-16', status: 'In Behandeling', description: 'Contact opgenomen met prospect' }
      ]
    },
    {
      id: 2,
      referenceCode: 'REF-2024-002',
      referrerName: 'Maria Janssen',
      referrerId: 2,
      prospectName: 'Tom van Dijk',
      prospectEmail: 'tom.vandijk@email.com',
      prospectPhone: '+31 6 87654321',
      service: 'Schoonmaak Service',
      status: 'Goedgekeurd',
      dateSubmitted: '2024-06-10',
      dateApproved: '2024-06-12',
      dateCompleted: null,
      bookingReference: 'BK-2024-0156',
      rewardAmount: 75,
      conversionValue: 890,
      notes: 'Wekelijkse schoonmaak gewenst',
      timeline: [
        { date: '2024-06-10', status: 'Ingediend', description: 'Verwijzing ontvangen' },
        { date: '2024-06-11', status: 'In Behandeling', description: 'Prospect gecontacteerd' },
        { date: '2024-06-12', status: 'Goedgekeurd', description: 'Service afspraak gemaakt' }
      ]
    },
    {
      id: 3,
      referenceCode: 'REF-2024-003',
      referrerName: 'Pieter van Berg',
      referrerId: 3,
      prospectName: 'Lisa de Wit',
      prospectEmail: 'lisa.dewit@email.com',
      prospectPhone: '+31 6 11223344',
      service: 'Thuiszorg Pakket Basis',
      status: 'Voltooid',
      dateSubmitted: '2024-05-25',
      dateApproved: '2024-05-27',
      dateCompleted: '2024-06-05',
      bookingReference: 'BK-2024-0142',
      rewardAmount: 100,
      conversionValue: 1650,
      notes: 'Succesvol afgerond, tevreden klant',
      timeline: [
        { date: '2024-05-25', status: 'Ingediend', description: 'Verwijzing ontvangen' },
        { date: '2024-05-26', status: 'In Behandeling', description: 'Prospect gecontacteerd' },
        { date: '2024-05-27', status: 'Goedgekeurd', description: 'Contract getekend' },
        { date: '2024-06-05', status: 'Voltooid', description: 'Service gestart en beloning uitbetaald' }
      ]
    },
    {
      id: 4,
      referenceCode: 'REF-2024-004',
      referrerName: 'Lisa Bakker',
      referrerId: 4,
      prospectName: 'Mark Visser',
      prospectEmail: 'mark.visser@email.com',
      prospectPhone: '+31 6 55667788',
      service: 'Kinderopvang',
      status: 'Afgewezen',
      dateSubmitted: '2024-06-08',
      dateApproved: null,
      dateCompleted: null,
      bookingReference: null,
      rewardAmount: 0,
      conversionValue: 0,
      notes: 'Prospect niet geïnteresseerd na contact',
      timeline: [
        { date: '2024-06-08', status: 'Ingediend', description: 'Verwijzing ontvangen' },
        { date: '2024-06-09', status: 'In Behandeling', description: 'Contact opgenomen' },
        { date: '2024-06-10', status: 'Afgewezen', description: 'Prospect niet geïnteresseerd' }
      ]
    }
  ]);

  const [customers] = useState([
    { id: 1, naam: 'Jan de Vries' },
    { id: 2, naam: 'Maria Janssen' },
    { id: 3, naam: 'Pieter van Berg' },
    { id: 4, naam: 'Lisa Bakker' }
  ]);

  const [services] = useState([
    'Thuiszorg Pakket Premium',
    'Thuiszorg Pakket Basis',
    'Schoonmaak Service',
    'Kinderopvang',
    'Tuinonderhoud',
    'Huishoudelijke Hulp'
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedReferrals, setSelectedReferrals] = useState([]);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    referrerName: '',
    referrerId: '',
    prospectName: '',
    prospectEmail: '',
    prospectPhone: '',
    service: '',
    notes: ''
  });

  // Analytics calculations
  const analytics = useMemo(() => {
    const total = referrals.length;
    const completed = referrals.filter(r => r.status === 'Voltooid').length;
    const pending = referrals.filter(r => r.status === 'In Behandeling').length;
    const approved = referrals.filter(r => r.status === 'Goedgekeurd').length;
    const rejected = referrals.filter(r => r.status === 'Afgewezen').length;
    
    const conversionRate = total > 0 ? (completed / total * 100) : 0;
    const totalRewards = referrals.reduce((sum, r) => sum + r.rewardAmount, 0);
    const totalValue = referrals.reduce((sum, r) => sum + r.conversionValue, 0);
    
    return {
      total,
      completed,
      pending,
      approved,
      rejected,
      conversionRate,
      totalRewards,
      totalValue
    };
  }, [referrals]);

  // Filtering logic
  const filteredReferrals = useMemo(() => {
    return referrals.filter(referral => {
      const matchesSearch = 
        referral.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.prospectEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || referral.status === statusFilter;
      const matchesCustomer = !customerFilter || referral.referrerId === parseInt(customerFilter);
      
      const matchesDateRange = 
        (!dateRange.start || referral.dateSubmitted >= dateRange.start) &&
        (!dateRange.end || referral.dateSubmitted <= dateRange.end);
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesDateRange;
    });
  }, [referrals, searchTerm, statusFilter, customerFilter, dateRange]);

  const paginatedReferrals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReferrals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReferrals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);

  // Notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.referrerName || !formData.prospectName || !formData.prospectEmail || !formData.service) {
      showNotification('Vul alle verplichte velden in', 'error');
      return;
    }

    const newReferral = {
      id: Math.max(...referrals.map(r => r.id)) + 1,
      referenceCode: `REF-${new Date().getFullYear()}-${String(referrals.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'In Behandeling',
      dateSubmitted: new Date().toISOString().split('T')[0],
      dateApproved: null,
      dateCompleted: null,
      bookingReference: null,
      rewardAmount: 0,
      conversionValue: 0,
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'Ingediend',
          description: 'Verwijzing ontvangen'
        }
      ]
    };

    setReferrals(prev => [...prev, newReferral]);
    resetForm();
    showNotification('Verwijzing succesvol toegevoegd');
  };

  const resetForm = () => {
    setFormData({
      referrerName: '',
      referrerId: '',
      prospectName: '',
      prospectEmail: '',
      prospectPhone: '',
      service: '',
      notes: ''
    });
    setShowModal(false);
  };

  // Status management
  const updateReferralStatus = (referralId, newStatus) => {
    setReferrals(prev => prev.map(referral => {
      if (referral.id === referralId) {
        const updatedReferral = {
          ...referral,
          status: newStatus
        };

        // Update dates based on status
        if (newStatus === 'Goedgekeurd' && !referral.dateApproved) {
          updatedReferral.dateApproved = new Date().toISOString().split('T')[0];
        } else if (newStatus === 'Voltooid' && !referral.dateCompleted) {
          updatedReferral.dateCompleted = new Date().toISOString().split('T')[0];
          updatedReferral.rewardAmount = getRewardAmount(referral.service);
          updatedReferral.conversionValue = getConversionValue(referral.service);
        }

        // Add timeline entry
        updatedReferral.timeline = [
          ...referral.timeline,
          {
            date: new Date().toISOString().split('T')[0],
            status: newStatus,
            description: getStatusDescription(newStatus)
          }
        ];

        return updatedReferral;
      }
      return referral;
    }));

    showNotification(`Status bijgewerkt naar ${newStatus}`);
  };

  const getRewardAmount = (service) => {
    const rewardMap = {
      'Thuiszorg Pakket Premium': 150,
      'Thuiszorg Pakket Basis': 100,
      'Schoonmaak Service': 75,
      'Kinderopvang': 125,
      'Tuinonderhoud': 80,
      'Huishoudelijke Hulp': 60
    };
    return rewardMap[service] || 50;
  };

  const getConversionValue = (service) => {
    const valueMap = {
      'Thuiszorg Pakket Premium': 2400,
      'Thuiszorg Pakket Basis': 1650,
      'Schoonmaak Service': 890,
      'Kinderopvang': 1850,
      'Tuinonderhoud': 1200,
      'Huishoudelijke Hulp': 750
    };
    return valueMap[service] || 500;
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      'In Behandeling': 'Status bijgewerkt naar in behandeling',
      'Goedgekeurd': 'Verwijzing goedgekeurd',
      'Voltooid': 'Service gestart en beloning uitbetaald',
      'Afgewezen': 'Verwijzing afgewezen'
    };
    return descriptions[status] || 'Status bijgewerkt';
  };

  // Bulk operations
  const handleBulkStatusUpdate = (newStatus) => {
    selectedReferrals.forEach(id => {
      updateReferralStatus(id, newStatus);
    });
    setSelectedReferrals([]);
    setShowBulkActions(false);
  };

  // Export functionality
  const handleExport = () => {
    const headers = [
      'Referentie Code', 'Verwijzer', 'Prospect Naam', 'Prospect Email', 
      'Service', 'Status', 'Datum Ingediend', 'Beloning', 'Conversie Waarde'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredReferrals.map(referral => [
        referral.referenceCode,
        referral.referrerName,
        referral.prospectName,
        referral.prospectEmail,
        referral.service,
        referral.status,
        referral.dateSubmitted,
        referral.rewardAmount,
        referral.conversionValue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verwijzingen-rapport.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Rapport geëxporteerd');
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Behandeling': 'bg-yellow-100 text-yellow-800',
      'Goedgekeurd': 'bg-blue-100 text-blue-800',
      'Voltooid': 'bg-green-100 text-green-800',
      'Afgewezen': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'In Behandeling': <Clock className="w-4 h-4" />,
      'Goedgekeurd': <CheckCircle className="w-4 h-4" />,
      'Voltooid': <Award className="w-4 h-4" />,
      'Afgewezen': <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verwijzingen Tracking</h1>
                <p className="text-gray-600">Beheer en volg alle verwijzingen en hun status</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Verwijzing
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totaal</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Behandeling</p>
                    <p className="text-2xl font-bold text-yellow-600">{analytics.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Goedgekeurd</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.approved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Voltooid</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.completed}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversie</p>
                    <p className="text-2xl font-bold text-indigo-600">{analytics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Beloningen</p>
                    <p className="text-2xl font-bold text-purple-600">€{analytics.totalRewards}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totale Waarde</p>
                    <p className="text-2xl font-bold text-green-700">€{analytics.totalValue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Zoeken op referentie code, verwijzer, prospect..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Alle statussen</option>
                      <option value="In Behandeling">In Behandeling</option>
                      <option value="Goedgekeurd">Goedgekeurd</option>
                      <option value="Voltooid">Voltooid</option>
                      <option value="Afgewezen">Afgewezen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verwijzer</label>
                    <select
                      value={customerFilter}
                      onChange={(e) => setCustomerFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Alle verwijzers</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.naam}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum vanaf</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum tot</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedReferrals.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-700">
                {selectedReferrals.length} verwijzing(en) geselecteerd
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('Goedgekeurd')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Afgewezen')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Afwijzen
                </button>
                <button
                  onClick={() => setSelectedReferrals([])}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Deselecteren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReferrals.length === paginatedReferrals.length && paginatedReferrals.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReferrals(paginatedReferrals.map(r => r.id));
                        } else {
                          setSelectedReferrals([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verwijzing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verwijzer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prospect</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beloning</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReferrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReferrals.includes(referral.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReferrals(prev => [...prev, referral.id]);
                          } else {
                            setSelectedReferrals(prev => prev.filter(id => id !== referral.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{referral.referenceCode}</div>
                        <div className="text-sm text-gray-500">
                          {referral.bookingReference && `Boeking: ${referral.bookingReference}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{referral.referrerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{referral.prospectName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {referral.prospectEmail}
                        </div>
                        {referral.prospectPhone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {referral.prospectPhone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{referral.service}</div>
                      {referral.notes && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{referral.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(referral.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <select
                          value={referral.status}
                          onChange={(e) => updateReferralStatus(referral.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="In Behandeling">In Behandeling</option>
                          <option value="Goedgekeurd">Goedgekeurd</option>
                          <option value="Voltooid">Voltooid</option>
                          <option value="Afgewezen">Afgewezen</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {referral.dateSubmitted}
                      </div>
                      {referral.dateCompleted && (
                        <div className="text-sm text-green-600 mt-1">
                          Voltooid: {referral.dateCompleted}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        €{referral.rewardAmount}
                      </div>
                      {referral.conversionValue > 0 && (
                        <div className="text-sm text-gray-500">
                          Waarde: €{referral.conversionValue}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReferral(referral);
                            setShowTimelineModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Timeline bekijken"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReferral(referral);
                            setFormData({
                              referrerName: referral.referrerName,
                              referrerId: referral.referrerId,
                              prospectName: referral.prospectName,
                              prospectEmail: referral.prospectEmail,
                              prospectPhone: referral.prospectPhone,
                              service: referral.service,
                              notes: referral.notes
                            });
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Bewerken"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Toont {((currentPage - 1) * itemsPerPage) + 1} tot {Math.min(currentPage * itemsPerPage, filteredReferrals.length)} van {filteredReferrals.length} verwijzingen
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedReferral ? 'Verwijzing Bewerken' : 'Nieuwe Verwijzing Toevoegen'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verwijzer *
                    </label>
                    <select
                      name="referrerId"
                      value={formData.referrerId}
                      onChange={(e) => {
                        const selectedCustomer = customers.find(c => c.id === parseInt(e.target.value));
                        setFormData(prev => ({
                          ...prev,
                          referrerId: e.target.value,
                          referrerName: selectedCustomer ? selectedCustomer.naam : ''
                        }));
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Selecteer verwijzer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.naam}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Selecteer service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Prospect Informatie</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prospect Naam *
                    </label>
                    <input
                      type="text"
                      name="prospectName"
                      value={formData.prospectName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Voer de naam van de prospect in"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="prospectEmail"
                        value={formData.prospectEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="prospect@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        name="prospectPhone"
                        value={formData.prospectPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+31 6 12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notities
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Aanvullende informatie over de verwijzing..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {selectedReferral ? 'Bijwerken' : 'Toevoegen'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Modal */}
        {showTimelineModal && selectedReferral && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Verwijzing Timeline</h2>
                  <p className="text-sm text-gray-600">{selectedReferral.referenceCode}</p>
                </div>
                <button
                  onClick={() => setShowTimelineModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Referral Details Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Verwijzing Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Verwijzer:</span> {selectedReferral.referrerName}</div>
                      <div><span className="text-gray-600">Prospect:</span> {selectedReferral.prospectName}</div>
                      <div><span className="text-gray-600">Service:</span> {selectedReferral.service}</div>
                      <div><span className="text-gray-600">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReferral.status)}`}>
                          {selectedReferral.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Informatie</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedReferral.prospectEmail}
                      </div>
                      {selectedReferral.prospectPhone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedReferral.prospectPhone}
                        </div>
                      )}
                      {selectedReferral.bookingReference && (
                        <div><span className="text-gray-600">Boeking:</span> {selectedReferral.bookingReference}</div>
                      )}
                    </div>
                  </div>
                </div>
                {selectedReferral.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Notities</h3>
                    <p className="text-sm text-gray-600">{selectedReferral.notes}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Status Timeline</h3>
                <div className="space-y-4">
                  {selectedReferral.timeline.map((entry, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.status === 'Voltooid' ? 'bg-green-100' :
                          entry.status === 'Goedgekeurd' ? 'bg-blue-100' :
                          entry.status === 'Afgewezen' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {getStatusIcon(entry.status)}
                        </div>
                        {index < selectedReferral.timeline.length - 1 && (
                          <div className="w-0.5 h-6 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{entry.status}</h4>
                          <span className="text-xs text-gray-500">{entry.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              {selectedReferral.status === 'Voltooid' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">€{selectedReferral.rewardAmount}</div>
                      <div className="text-xs text-green-700">Beloning</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">€{selectedReferral.conversionValue}</div>
                      <div className="text-xs text-blue-700">Conversie Waarde</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round((selectedReferral.rewardAmount / selectedReferral.conversionValue) * 100)}%
                      </div>
                      <div className="text-xs text-purple-700">ROI</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowTimelineModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsTracking;
                  
