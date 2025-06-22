import React, { useState } from 'react';

// Simple Dashboard Component
function Dashboard() {
  return (
    <div style={{padding: '20px', background: '#f8f9fa', borderRadius: '8px', margin: '20px 0'}}>
      <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>📊 Dashboard</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#e74c3c', margin: '0 0 10px 0'}}>Totaal Verwijzingen</h3>
          <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>156</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#27ae60', margin: '0 0 10px 0'}}>Actieve Klanten</h3>
          <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>89</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#3498db', margin: '0 0 10px 0'}}>Maandelijkse Omzet</h3>
          <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>€12,450</p>
        </div>
      </div>
    </div>
  );
}

// Simple Customers Component
function Customers() {
  const customers = [
    { id: 1, name: 'Jan de Vries', email: 'jan@email.nl', verwijzingen: 5, status: 'Actief' },
    { id: 2, name: 'Maria Jansen', email: 'maria@email.nl', verwijzingen: 3, status: 'Actief' },
    { id: 3, name: 'Piet Bakker', email: 'piet@email.nl', verwijzingen: 8, status: 'VIP' }
  ];

  return (
    <div style={{padding: '20px'}}>
      <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>👥 Klanten Beheer</h2>
      <div style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: '#ecf0f1'}}>
            <tr>
              <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Naam</th>
              <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Email</th>
              <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Verwijzingen</th>
              <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>{customer.name}</td>
                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>{customer.email}</td>
                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>{customer.verwijzingen}</td>
                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: customer.status === 'VIP' ? '#e74c3c' : '#27ae60',
                    color: 'white'
                  }}>
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple Rewards Component
function Rewards() {
  return (
    <div style={{padding: '20px'}}>
      <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>🎁 Beloningen</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#e67e22'}}>Korting Voucher</h3>
          <p>10% korting op volgende boeking</p>
          <p style={{color: '#7f8c8d'}}>Voor 3+ verwijzingen</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#9b59b6'}}>Gratis Excursie</h3>
          <p>Gratis dagexcursie naar keuze</p>
          <p style={{color: '#7f8c8d'}}>Voor 5+ verwijzingen</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{color: '#e74c3c'}}>VIP Pakket</h3>
          <p>Complete VIP behandeling</p>
          <p style={{color: '#7f8c8d'}}>Voor 10+ verwijzingen</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navStyle = {
    background: '#2c3e50',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    padding: '15px 25px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#34495e'
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#ecf0f1'}}>
      {/* Header */}
      <header style={{background: '#2c3e50', color: 'white', padding: '20px', textAlign: 'center'}}>
        <h1 style={{margin: 0, fontSize: '28px'}}>🌍 Bebsy Referral System</h1>
        <p style={{margin: '5px 0 0 0', opacity: 0.8}}>Uw professionele verwijzingsplatform</p>
      </header>

      {/* Navigation */}
      <nav style={navStyle}>
        <button 
          style={activeTab === 'dashboard' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          style={activeTab === 'customers' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveTab('customers')}
        >
          👥 Klanten
        </button>
        <button 
          style={activeTab === 'rewards' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveTab('rewards')}
        >
          🎁 Beloningen
        </button>
      </nav>

      {/* Main Content */}
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'rewards' && <Rewards />}
      </main>

      {/* Footer */}
      <footer style={{background: '#34495e', color: 'white', textAlign: 'center', padding: '20px', marginTop: '40px'}}>
        <p style={{margin: 0}}>© 2025 Bebsy Referral System - Professioneel verwijzingsbeheer</p>
      </footer>
    </div>
  );
}

export default App;
