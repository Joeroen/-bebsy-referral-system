import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';

const CustomersManagement = () => {
  // Sample data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      naam: 'Jan de Vries',
      email: 'jan.devries@email.com',
      telefoon: '+31 6 12345678',
      geboortedatum: '1985-03-15',
      adres: 'Hoofdstraat 123, Amsterdam',
      aangemaakt: '2024-01-15',
      status: 'Actief',
      verwijzingen: 3
    },
    {
      id: 2,
      naam: 'Maria Janssen',
      email: 'maria.janssen@email.com',
      telefoon: '+31 6 87654321',
      geboortedatum: '1990-07-22',
      adres: 'Kerkstraat 45, Utrecht',
      aangemaakt: '2024-02-20',
      status: 'Actief',
      verwijzingen: 1
    },
    {
      id: 3,
      naam: 'Pieter van Berg',
      email: 'pieter.vanberg@email.com',
      telefoon: '+31 6 11223344',
      geboortedatum: '1978-11-08',
      adres: 'Molenlaan 67, Rotterdam',
      aangemaakt: '2024-03-10',
      status: 'Inactief',
      verwijzingen: 0
    },
    {
      id: 4,
      naam: 'Lisa Bakker',
      email: 'lisa.bakker@email.com',
      telefoon: '+31 6 55667788',
      geboortedatum: '1995-05-14',
      adres: 'Parkweg 89, Den Haag',
      aangemaakt: '2024-04-05',
      status: 'Actief',
      verwijzingen: 5
    },
    {
      id: 5,
      naam: 'Tom Visser',
      email: 'tom.visser@email.com',
      telefoon: '+31 6 99887766',
      geboortedatum: '1982-09-30',
      adres: 'Schoolstraat 12, Eindhoven',
      aangemaakt: '2024-05-12',
      status: 'Actief',
      verwijzingen: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    telefoon: '',
    geboortedatum: '',
    adres: '',
    status: 'Actief'
  });

  // Filtered and paginated data
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefoon.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.naam || !formData.email) {
      alert('Naam en email zijn verplicht');
      return;
    }
    
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(customer =>
        customer.id === editingCustomer.id
          ? { ...customer, ...formData }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        id: Math.max(...customers.map(c => c.id)) + 1,
        ...formData,
        aangemaakt: new Date().toISOString().split('T')[0],
        verwijzingen: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      naam: '',
      email: '',
      telefoon: '',
      geboortedatum: '',
      adres: '',
      status: 'Actief'
    });
    setEditingCustomer(null);
    setShowModal(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      naam: customer.naam,
      email: customer.email,
      telefoon: customer.telefoon,
      geboortedatum: customer.geboortedatum,
      adres: customer.adres,
      status: customer.status
    });
    setShowModal(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    }
  };

  // CSV Import handler
  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newCustomers = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length && values[0]) {
          const customer = {
            id: Math.max(...customers.map(c => c.id), 0) + newCustomers.length + 1,
            naam: values[0] || '',
            email: values[1] || '',
            telefoon: values[2] || '',
            geboortedatum: values[3] || '',
            adres: values[4] || '',
            status: values[5] || 'Actief',
            aangemaakt: new Date().toISOString().split('T')[0],
            verwijzingen: 0
          };
          newCustomers.push(customer);
        }
      }
      
      setCustomers(prev => [...prev, ...newCustomers]);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  // CSV Export handler
  const handleCSVExport = () => {
    const headers = ['Naam', 'Email', 'Telefoon', 'Geboortedatum', 'Adres', 'Status', 'Aangemaakt', 'Verwijzingen'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.naam,
        customer.email,
        customer.telefoon,
        customer.geboortedatum,
        customer.adres,
        customer.status,
        customer.aangemaakt,
        customer.verwijzingen
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'klanten.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Klanten Beheer</h1>
                <p className="text-gray-600">Beheer je klanten en hun verwijzingen</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importeren
                </button>
                <button
                  onClick={handleCSVExport}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporteren
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Klant
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Zoeken op naam, email of telefoon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verwijzingen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aangemaakt</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.naam}</div>
                          <div className="text-sm text-gray-500">{customer.geboortedatum}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.telefoon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.adres}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'Actief' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.verwijzingen}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.aangemaakt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
                  Toont {((currentPage - 1) * itemsPerPage) + 1} tot {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} van {filteredCustomers.length} klanten
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editingCustomer ? 'Klant Bewerken' : 'Nieuwe Klant Toevoegen'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam *
                  </label>
                  <input
                    type="text"
                    name="naam"
                    value={formData.naam}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    name="telefoon"
                    value={formData.telefoon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Geboortedatum
                  </label>
                  <input
                    type="date"
                    name="geboortedatum"
                    value={formData.geboortedatum}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                  </label>
                  <input
                    type="text"
                    name="adres"
                    value={formData.adres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Actief">Actief</option>
                    <option value="Inactief">Inactief</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingCustomer ? 'Bijwerken' : 'Toevoegen'}
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

        {/* CSV Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">CSV Importeren</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload een CSV bestand met de volgende kolommen:<br />
                    Naam, Email, Telefoon, Geboortedatum, Adres, Status
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersManagement;
