import React, { useState } from 'react';

// Landing Page Component
function LandingPage({ onLogin }) {
  const [email, setEmail] = useState('');

  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const buttonStyle = {
    background: '#e74c3c',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '10px',
    transition: 'transform 0.3s, box-shadow 0.3s'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    border: '2px solid white'
  };

  const featureCardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  };

  const features = [
    {
      icon: '🔗',
      title: 'Unieke Referral Links',
      description: 'Genereer persoonlijke verwijzingslinks en deel ze met vrienden en familie'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Volg je verwijzingen en verdiensten in real-time met gedetailleerde rapporten'
    },
    {
      icon: '🎁',
      title: 'Geweldige Beloningen',
      description: 'Verdien kortingen, gratis excursies en exclusieve VIP-behandelingen'
    },
    {
      icon: '💰',
      title: 'Automatische Uitbetalingen',
      description: 'Ontvang je verdiende beloningen automatisch op je account'
    },
    {
      icon: '📱',
      title: 'Mobiel Vriendelijk',
      description: 'Beheer je verwijzingen overal en altijd via je smartphone'
    },
    {
      icon: '🛡️',
      title: 'Veilig & Betrouwbaar',
      description: 'Je gegevens zijn volledig beveiligd met de nieuwste encryptietechnologie'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Actieve Gebruikers' },
    { number: '€50,000+', label: 'Uitgekeerde Beloningen' },
    { number: '25,000+', label: 'Succesvolle Verwijzingen' },
    { number: '4.9★', label: 'Gebruikerswaardering' }
  ];

  return (
    <div style={{fontFamily: 'Arial, sans-serif', lineHeight: '1.6'}}>
      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px'}}>
          <div style={{display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>
            <img 
              src="/bebsy-logo.png" 
              alt="Bebsy Logo" 
              style={{
                height: '35px',
                width: 'auto',
                marginRight: '10px',
                objectFit: 'contain'
              }}
            />
            Bebsy
          </div>
          <div>
            <a href="#features" style={{margin: '0 20px', textDecoration: 'none', color: '#2c3e50'}}>Features</a>
            <a href="#how-it-works" style={{margin: '0 20px', textDecoration: 'none', color: '#2c3e50'}}>Hoe het werkt</a>
            <a href="#contact" style={{margin: '0 20px', textDecoration: 'none', color: '#2c3e50'}}>Contact</a>
            <button 
              style={{...buttonStyle, padding: '10px 20px', fontSize: '14px'}}
              onClick={onLogin}
            >
              Inloggen
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{...heroStyle, marginTop: '70px'}}>
        <div style={{maxWidth: '800px'}}>
          <h1 style={{fontSize: '48px', marginBottom: '20px', fontWeight: 'bold'}}>
            Verdien Beloningen Door Te Verwijzen
          </h1>
          <p style={{fontSize: '22px', marginBottom: '40px', opacity: 0.9}}>
            Het slimste verwijzingssysteem voor jouw bedrijf. Deel je unieke link, verwijs vrienden en verdien geweldige beloningen!
          </p>
          <div style={{marginBottom: '40px'}}>
            <button 
              style={buttonStyle} 
              onClick={onLogin}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} 
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start Nu Gratis
            </button>
            <button 
              style={secondaryButtonStyle} 
              onClick={onLogin}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} 
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Bekijk Demo
            </button>
          </div>
          
          {/* Email Signup */}
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto'}}>
            <p style={{marginBottom: '15px', fontSize: '16px'}}>Ontvang updates over nieuwe features:</p>
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                type="email" 
                placeholder="Je email adres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px'
                }}
              />
              <button style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Aanmelden
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{background: '#f8f9fa', padding: '60px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center'}}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{fontSize: '36px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '10px'}}>
                  {stat.number}
                </div>
                <div style={{fontSize: '16px', color: '#7f8c8d'}}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{padding: '80px 20px', background: 'white'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h2 style={{fontSize: '36px', color: '#2c3e50', marginBottom: '20px'}}>
              Waarom Kiezen Voor Bebsy?
            </h2>
            <p style={{fontSize: '18px', color: '#7f8c8d', maxWidth: '600px', margin: '0 auto'}}>
              Ontdek alle krachtige features die jouw verwijzingservaring naar een hoger niveau tillen
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={featureCardStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{fontSize: '48px', marginBottom: '20px'}}>
                  {feature.icon}
                </div>
                <h3 style={{fontSize: '20px', color: '#2c3e50', marginBottom: '15px'}}>
                  {feature.title}
                </h3>
                <p style={{color: '#7f8c8d', lineHeight: '1.6'}}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{background: '#f8f9fa', padding: '80px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '36px', color: '#2c3e50', marginBottom: '60px'}}>
            Hoe Werkt Het?
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px'}}>
            <div>
              <div style={{
                background: '#e74c3c',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                1
              </div>
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Registreer Je Account</h3>
              <p style={{color: '#7f8c8d'}}>Maak gratis een account aan en krijg direct toegang tot je persoonlijke dashboard</p>
            </div>
            
            <div>
              <div style={{
                background: '#27ae60',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                2
              </div>
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Deel Je Link</h3>
              <p style={{color: '#7f8c8d'}}>Krijg je unieke verwijzingslink en deel deze met vrienden via social media of email</p>
            </div>
            
            <div>
              <div style={{
                background: '#3498db',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                3
              </div>
              <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>Verdien Beloningen</h3>
              <p style={{color: '#7f8c8d'}}>Ontvang automatisch beloningen voor elke succesvolle verwijzing die je doet</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', marginBottom: '20px'}}>
            Klaar Om Te Beginnen?
          </h2>
          <p style={{fontSize: '18px', marginBottom: '40px', opacity: 0.9}}>
            Sluit je aan bij duizenden tevreden gebruikers en start vandaag nog met het verdienen van beloningen
          </p>
          <button 
            style={{
              ...buttonStyle,
              fontSize: '20px',
              padding: '18px 40px'
            }}
            onClick={onLogin}
          >
            Start Nu Gratis - Geen Kosten
          </button>
          <p style={{fontSize: '14px', marginTop: '20px', opacity: 0.7}}>
            Geen creditcard vereist • 30 dagen geld-terug-garantie
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: '#2c3e50', color: 'white', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>
            <img 
              src="/bebsy-logo.png" 
              alt="Bebsy Logo" 
              style={{
                height: '35px',
                width: 'auto',
                marginRight: '10px',
                objectFit: 'contain'
              }}
            />
            Bebsy
          </div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap'}}>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Privacy</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Voorwaarden</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Support</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Contact</a>
          </div>
          <p style={{opacity: 0.7, margin: 0}}>
            © 2025 Bebsy Referral System. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Dashboard Components
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

// Dashboard App Component
function DashboardApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navStyle = {
    background: '#2c3e50',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center'
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
          <img 
            src="/bebsy-logo.png" 
            alt="Bebsy Logo" 
            style={{
              height: '40px',
              width: 'auto',
              marginRight: '15px',
              objectFit: 'contain'
            }}
          />
          <h1 style={{margin: 0, fontSize: '28px'}}>Bebsy Referral System</h1>
        </div>
        <p style={{margin: '5px 0 0 0', opacity: 0.8}}>Uw professionele verwijzingsplatform</p>
      </header>

      {/* Navigation */}
      <nav style={navStyle}>
        <div style={{display: 'flex'}}>
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
        </div>
        <button 
          style={{...buttonStyle, background: '#e74c3c', margin: '0 15px'}}
          onClick={onLogout}
        >
          Uitloggen
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

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'dashboard') {
    return <DashboardApp onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={handleLogin} />;
}

export default App;
