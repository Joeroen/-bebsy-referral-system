import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Upload, Download, Search, RefreshCw, Eye, Edit, 
  Trash2, ChevronLeft, ChevronRight, Filter, MoreVertical,
  CheckCircle, XCircle, AlertCircle, FileText, User, Mail,
  Phone, MapPin, Calendar, Hash, Copy, Check
} from 'lucide-react';

// Utility functions
const formatCurrency = (amount) => `€${parseFloat(amount || 0).toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString('nl-NL');
const formatDateTime = (date) => new Date(date).toLocaleString('nl-NL');

// Dutch translations
const t = {
  // Headers
  customerManagement: 'Klantenbeheer',
  addCustomer: 'Klant Toevoegen',
  editCustomer: 'Klant Bewerken',
  importCustomers: 'Klanten Importeren',
  exportCustomers: 'Klanten Exporteren',
  
  // Form fields
  name: 'Naam',
  email: 'E-mail',
  phone: 'Telefoon',
  address: 'Adres',
  city: 'Stad',
  postalCode: 'Postcode',
  country: 'Land',
  bebsyCustomerId: 'Bebsy Klant ID',
  referralCode: 'Referral Code',
  
  // Actions
  save: 'Opslaan',
  cancel: 'Annuleren',
  delete: 'Verwijderen',
  edit: 'Bewerken',
  view: 'Bekijken',
  search: 'Zoeken',
  filter: 'Filteren',
  refresh: 'Vernieuwen',
  import: 'Importeren',
  export: 'Exporteren',
  selectAll: 'Alles Selecteren',
  selectNone: 'Niets Selecteren',
  bulkActions: 'Bulk Acties',
  
  // Table headers
  customer: 'Klant',
  totalReferrals: 'Totaal Referrals',
  totalRewards: 'Totaal Beloningen',
  created: 'Aangemaakt',
  lastActivity: 'Laatste Activiteit',
  status: 'Status',
  actions: 'Acties',
  
  // Status
  active: 'Actief',
  inactive: 'Inactief',
  
  // Pagination
  page: 'Pagina',
  of: 'van',
  previous: 'Vorige',
  next: 'Volgende',
  rowsPerPage: 'Rijen per pagina',
  showing: 'Toont',
  to: 'tot',
  entries: 'items',
  
  // Search & Filter
  searchCustomers: 'Zoek klanten...',
  filterByStatus: 'Filter op status',
  filterByDate: 'Filter op datum',
  allStatuses: 'Alle statussen',
  
  // Import
  selectFile: 'Selecteer Bestand',
  uploadFile: 'Bestand Uploaden',
  importing: 'Importeren...',
  importCompleted: 'Import Voltooid',
  importInstructions: 'CSV moet kolommen bevatten: bebsy_customer_id, name, email',
  downloadTemplate: 'Download Sjabloon',
  
  // Messages
  loading: 'Laden...',
  noDataFound: 'Geen klanten gevonden',
  customerAdded: 'Klant succesvol toegevoegd',
  customerUpdated: 'Klant succesvol bijgewerkt',
  customerDeleted: 'Klant succesvol verwijderd',
  customersDeleted: 'Klanten succesvol verwijderd',
  confirmDelete: 'Weet je zeker dat je deze klant wilt verwijderen?',
  confirmBulkDelete: 'Weet je zeker dat je de geselecteerde klanten wilt verwijderen?',
  referralCodeCopied: 'Referral code gekopieerd',
  
  // Validation
  required: 'Dit veld is verplicht',
  invalidEmail: 'Ongeldig e-mailadres',
  emailExists: 'E-mailadres bestaat al',
  customerIdExists: 'Klant ID bestaat al',
  
  // Export
  exportSelected: 'Geselecteerde Exporteren',
  exportAll: 'Alles Exporteren',
  exportFormat: 'Export Formaat'
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

  async delete(endpoint) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Delete failed');
    }
    
    return response.json();
  },

  async uploadFile(endpoint, file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
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

// Loading Spinner Component
function LoadingSpinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-600"></div>
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

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

// Copy to Clipboard Hook
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  return { copied, copyToClipboard };
}

// Customer Modal Component
function CustomerModal({ customer, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    bebsy_customer_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'NL',
    ...customer
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    if (customer) {
      setFormData({ ...formData, ...customer });
    } else {
      setFormData({
        bebsy_customer_id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'NL'
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bebsy_customer_id?.trim()) {
      newErrors.bebsy_customer_id = t.required;
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = t.required;
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (customer?.id) {
        await api.put(`/customers/${customer.id}`, formData);
        showNotification(t.customerUpdated, 'success');
      } else {
        await api.post('/customers', formData);
        showNotification(t.customerAdded, 'success');
      }
      onSave();
      onClose();
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {customer ? t.editCustomer : t.addCustomer}
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.bebsyCustomerId} *
                </label>
                <input
                  type="text"
                  name="bebsy_customer_id"
                  value={formData.bebsy_customer_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.bebsy_customer_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="CUST001"
                />
                {errors.bebsy_customer_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.bebsy_customer_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jan Jansen"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="jan@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+31 6 12345678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.address}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Straatnaam 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.city}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amsterdam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.postalCode}
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 AB"
                />
              </div>
            </div>

            {customer?.referral_code && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.referralCode}
                </label>
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-lg">
                    {customer.referral_code}
                  </code>
                  <CopyButton text={customer.referral_code} />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? t.loading : t.save}
              </button>
            </div>
          </div>
        </div>
      </div>
      {NotificationComponent}
    </>
  );
}

// Copy Button Component
function CopyButton({ text }) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const { showNotification, NotificationComponent } = useNotification();

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      showNotification(t.referralCodeCopied, 'success');
    }
  };

  return (
    <>
      <button
        onClick={handleCopy}
        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
        title="Kopiëren"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </button>
      {NotificationComponent}
    </>
  );
}

// Import Modal Component
function ImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const { showNotification, NotificationComponent } = useNotification();

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const data = await api.uploadFile('/customers/import', file);
      setProgress(100);
      setResult(data);
      
      if (data.imported > 0) {
        showNotification(`${data.imported} klanten succesvol geïmporteerd`, 'success');
        onSuccess();
      }
      
      if (data.errors && data.errors.length > 0) {
        showNotification(`${data.errors.length} fouten tijdens import`, 'warning');
      }
    } catch (error) {
      setResult({ error: error.message });
      showNotification('Import mislukt', 'error');
    } finally {
      clearInterval(progressInterval);
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'bebsy_customer_id,name,email\nCUST001,Jan Jansen,jan@example.com\nCUST002,Maria Smit,maria@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'klanten_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setImporting(false);
    setProgress(0);
    setResult(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{t.importCustomers}</h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instructies:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t.importInstructions}</li>
                <li>• Maximaal 1000 klanten per import</li>
                <li>• Bestaande klanten worden overgeslagen</li>
              </ul>
              <button
                onClick={downloadTemplate}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t.downloadTemplate}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.selectFile}
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t.importing}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {result && (
              <div className={`p-4 rounded-lg ${result.error ? 'bg-red-50' : 'bg-green-50'}`}>
                {result.error ? (
                  <div className="text-red-700">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    {result.error}
                  </div>
                ) : (
                  <div className="text-green-700">
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                    {t.importCompleted}: {result.imported} geïmporteerd, {result.skipped} overgeslagen
                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-2 text-sm">
                        <strong>Fouten:</strong>
                        <ul className="mt-1 list-disc list-inside">
                          {result.errors.slice(0, 3).map((error, index) => (
                            <li key={index}>{error.error}</li>
                          ))}
                          {result.errors.length > 3 && (
                            <li>... en {result.errors.length - 3} meer</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? t.importing : t.import}
              </button>
            </div>
          </div>
        </div>
      </div>
      {NotificationComponent}
    </>
  );
}

// Customer Table Component
function CustomerTable({ 
  customers, 
  loading, 
  selectedCustomers, 
  onSelectCustomer, 
  onSelectAll, 
  onEditCustomer, 
  onDeleteCustomer 
}) {
  if (loading) {
    return <LoadingSpinner text="Klanten laden..." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length && customers.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.customer}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.referralCode}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.totalReferrals}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.totalRewards}
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
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => onSelectCustomer(customer.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                    <div className="text-xs text-gray-400">{customer.bebsy_customer_id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {customer.referral_code}
                  </span>
                  <CopyButton text={customer.referral_code} />
                </div>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title={t.edit}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t.noDataFound}</p>
        </div>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ pagination, onPageChange }) {
  if (pagination.pages <= 1) return null;

  return (
    <div className="px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        {t.showing} {((pagination.page - 1) * pagination.limit) + 1} {t.to} {Math.min(pagination.page * pagination.limit, pagination.total)} {t.of} {pagination.total} {t.entries}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="flex items-center px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t.previous}
        </button>
        
        <div className="flex space-x-1">
          {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className="flex items-center px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          {t.next}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

// Bulk Actions Component
function BulkActions({ selectedCount, onExport, onDelete }) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-800">
          {selectedCount} klanten geselecteerd
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            {t.exportSelected}
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Customer Management Component
export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const data = await api.get(`/customers?page=${page}&search=${searchTerm}&limit=20`);
      setCustomers(data.customers || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (error) {
      showNotification('Fout bij laden klanten', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSelectedCustomers([]);
    fetchCustomers(1, search);
  };

  const handlePageChange = (page) => {
    fetchCustomers(page, search);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === customers.length 
        ? [] 
        : customers.map(c => c.id)
    );
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm(t.confirmDelete)) return;

    try {
      await api.delete(`/customers/${customerId}`);
      showNotification(t.customerDeleted, 'success');
      fetchCustomers(pagination.page, search);
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    } catch (error) {
      showNotification('Fout bij verwijderen klant', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(t.confirmBulkDelete)) return;

    try {
      await Promise.all(selectedCustomers.map(id => api.delete(`/customers/${id}`)));
      showNotification(t.customersDeleted, 'success');
      setSelectedCustomers([]);
      fetchCustomers(pagination.page, search);
    } catch (error) {
      showNotification('Fout bij verwijderen klanten', 'error');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const params = selectedCustomers.length > 0 
        ? `?format=${format}&ids=${selectedCustomers.join(',')}`
        : `?format=${format}`;
      
      const response = await fetch(`http://localhost:3001/api/export/customers${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `klanten-export-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showNotification('Export succesvol gedownload', 'success');
    } catch (error) {
      showNotification('Fout bij exporteren', 'error');
    }
  };

  const handleModalSave = () => {
    setEditingCustomer(null);
    setShowAddModal(false);
    fetchCustomers(pagination.page, search);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.customerManagement}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.addCustomer}
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t.import}
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            {t.export}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.searchCustomers}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            {t.search}
          </button>
          <button
            onClick={() => fetchCustomers(pagination.page, search)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions 
        selectedCount={selectedCustomers.length}
        onExport={() => handleExport('csv')}
        onDelete={handleBulkDelete}
      />

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <CustomerTable
          customers={customers}
          loading={loading}
          selectedCustomers={selectedCustomers}
          onSelectCustomer={handleSelectCustomer}
          onSelectAll={handleSelectAll}
          onEditCustomer={(customer) => {
            setEditingCustomer(customer);
            setShowAddModal(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />

        {/* Pagination */}
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      {/* Modals */}
      <CustomerModal
        customer={editingCustomer}
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCustomer(null);
        }}
        onSave={handleModalSave}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setShowImportModal(false);
          fetchCustomers(pagination.page, search);
        }}
      />

      {NotificationComponent}
    </div>
  );
}
