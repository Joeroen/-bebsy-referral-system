import React, { useState, useEffect } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    document.title = "Bebsy - Deel je Reiservaring";
    // Clean up any stray text nodes
    setTimeout(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            return node.textContent.trim() === 'html' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
      );
      let node;
      while (node = walker.nextNode()) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    }, 100);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onRegister={handleLogin} onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={() => setCurrentPage('login')} />;
}

function LoginPage({ onLogin, onBack }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Voer een geldig emailadres in';
    }
    
    if (!formData.password) {
      newErrors.password = 'Wachtwoord is verplicht';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Wachtwoord moet minimaal 6 karakters zijn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'maria@example.com' && formData.password === 'password') {
        onLogin({
          id: 1,
          name: 'Maria van den Berg',
          email: formData.email,
          referralCode: 'MARIA2025',
          totalReferrals: 12,
          totalSavings: 340
        });
      } else {
        setErrors({ general: 'Onjuiste inloggegevens. Probeer het opnieuw.' });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = (email) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false);
      alert(`Reset link verzonden naar ${email}`);
    }, 1000);
  };

  if (showForgotPassword) {
    return <ForgotPasswordPage 
      onSubmit={handleForgotPassword}
      onBack={() => setShowForgotPassword(false)}
      isLoading={isLoading}
    />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        ←
      </button>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <img 
            src="/bebsy_logo.png" 
            alt="Bebsy Logo" 
            style={{
              height: '40px',
              marginBottom: '10px'
            }}
          />
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 10px 0'
          }}>
            Welkom terug!
          </h1>
          <p style={{color: '#718096', margin: 0}}>
            Log in om je deelcode op te halen
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <div>
          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.email ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="maria@example.com"
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc2626' : '#e5e7eb'}
            />
            {errors.email && (
              <p style={{color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0'}}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{marginBottom: '30px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Wachtwoord
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.password ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#dc2626' : '#e5e7eb'}
            />
            {errors.password && (
              <p style={{color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0'}}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#9ca3af' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '20px'
            }}
          >
            {isLoading ? '🔄 Inloggen...' : '🚀 Inloggen'}
          </button>
        </div>

        {/* Footer Links */}
        <div style={{textAlign: 'center'}}>
          <button
            onClick={() => setShowForgotPassword(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginBottom: '15px'
            }}
          >
            Wachtwoord vergeten?
          </button>
          
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Nog geen account?{' '}
            <button
              onClick={() => alert('Registratie komt binnenkort!')}
              style={{
                background: 'none',
                border: 'none',
                color: '#8b5cf6',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600'
              }}
            >
              Registreer hier
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Demo Login:</strong><br/>
          Email: maria@example.com<br/>
          Wachtwoord: password
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage({ onSubmit, onBack, isLoading }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email) {
      setError('Email is verplicht');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Voer een geldig emailadres in');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
      }}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 10px 0'
          }}>
            Wachtwoord vergeten?
          </h1>
          <p style={{color: '#718096', margin: 0}}>
            Voer je emailadres in en we sturen je een reset link
          </p>
        </div>

        <div>
          <div style={{marginBottom: '30px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: error ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="maria@example.com"
            />
            {error && (
              <p style={{color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0'}}>
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#9ca3af' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {isLoading ? '📧 Verzenden...' : '📧 Reset Link Verzenden'}
          </button>
        </div>

        <div style={{textAlign: 'center'}}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Terug naar inloggen
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{color: '#1a202c', marginBottom: '20px'}}>Registratie</h1>
        <p style={{color: '#718096', marginBottom: '30px'}}>
          Registratie pagina komt binnenkort!
        </p>
        <button
          onClick={onBack}
          style={{
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            cursor: 'pointer'
          }}
        >
          ← Terug
        </button>
      </div>
    </div>
  );
}

function LandingPage({ onLogin }) {
  return (
    <div style={{fontFamily: 'Arial, sans-serif', background: '#fff'}}>
      
      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #f1f1f1'
      }}>
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px'}}>
          <img 
            src="/bebsy_logo.png" 
            alt="Bebsy Logo" 
            style={{height: '32px'}}
          />
          <div style={{display: 'flex', alignItems: 'center', gap: '40px'}}>
            <a href="#" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Over Delen</a>
            <a href="#" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Hoe het werkt</a>
            <a href="#" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Voordelen</a>
            <button 
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={onLogin}
            >
              Inloggen
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        height: '70vh',
        background: 'url("/images/positano-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.85)',
          borderRadius: '20px',
          padding: '50px 60px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 20px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(5px)'
        }}>
          <h1 style={{
            fontSize: '42px', 
            marginBottom: '25px', 
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.2'
          }}>
            "Waarom heb ik nog nooit eerder van jullie gehoord?"
          </h1>
          <p style={{
            fontSize: '20px', 
            marginBottom: '40px', 
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '1.5'
          }}>
            Dat horen we vaak. Alsof Bebsy het best bewaarde geheim van Nederland is. Tijd om daar iets aan te doen — met jouw hulp.
          </p>
          <button 
            style={{
              background: 'white',
              color: '#8b5cf6',
              border: 'none',
              borderRadius: '30px',
              padding: '18px 35px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}
            onClick={onLogin}
          >
            Start met delen
          </button>
        </div>
      </section>

      {/* Content Section */}
      <div style={{padding: '60px 20px', textAlign: 'center', background: '#f8fafc'}}>
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1a202c'}}>
          Bij Bebsy zijn onze klanten onze beste ambassadeurs
        </h2>
        <p style={{fontSize: '16px', color: '#718096', maxWidth: '600px', margin: '0 auto'}}>
          Deel jouw ervaring met vrienden of familie, en jullie profiteren allebei. Want goede tips zijn er om te delen.
        </p>
      </div>

      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;500;600;700&family=Oleo+Script+Swash+Caps&display=swap');`}
      </style>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overzicht');

  return (
    <div style={{fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc'}}>
      
      <header style={{background: 'white', padding: '40px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
          <img 
            src="/bebsy_logo.png" 
            alt="Bebsy Logo" 
            style={{height: '32px', marginRight: '20px'}}
          />
          <h1 style={{margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c'}}>
            Welkom terug, {user.name.split(' ')[0]}!
          </h1>
        </div>
        <p style={{margin: 0, color: '#718096', fontSize: '16px'}}>
          Jouw persoonlijke deelcode: <strong style={{color: '#8b5cf6'}}>{user.referralCode}</strong>
        </p>
      </header>

      <nav style={{background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.08)'}}>
        <div style={{display: 'flex'}}>
          <button 
            style={{
              background: activeTab === 'overzicht' ? '#8b5cf6' : 'none',
              color: activeTab === 'overzicht' ? 'white' : '#4a5568',
              border: 'none',
              padding: '20px 30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
            onClick={() => setActiveTab('overzicht')}
          >
            📊 Overzicht
          </button>
          <button 
            style={{
              background: activeTab === 'vrienden' ? '#8b5cf6' : 'none',
              color: activeTab === 'vrienden' ? 'white' : '#4a5568',
              border: 'none',
              padding: '20px 30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
            onClick={() => setActiveTab('vrienden')}
          >
            👥 Mijn Vrienden
          </button>
          <button 
            style={{
              background: activeTab === 'beloningen' ? '#8b5cf6' : 'none',
              color: activeTab === 'beloningen' ? 'white' : '#4a5568',
              border: 'none',
              padding: '20px 30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
            onClick={() => setActiveTab('beloningen')}
          >
            🎁 Beloningen
          </button>
        </div>
        <button 
          style={{
            background: '#dc2626', 
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            margin: '0 20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={onLogout}
        >
          Uitloggen
        </button>
      </nav>

      <main style={{maxWidth: '1400px', margin: '0 auto', padding: '40px'}}>
        {activeTab === 'overzicht' && (
          <div style={{padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>📊 Jouw Performance</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
              <div style={{background: '#f8fafc', padding: '30px', borderRadius: '16px'}}>
                <h3 style={{color: '#8b5cf6', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Vrienden Geholpen</h3>
                <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>{user.totalReferrals}</p>
              </div>
              <div style={{background: '#f8fafc', padding: '30px', borderRadius: '16px'}}>
                <h3 style={{color: '#059669', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Besparingen</h3>
                <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>€{user.totalSavings}</p>
              </div>
              <div style={{background: '#f8fafc', padding: '30px', borderRadius: '16px'}}>
                <h3 style={{color: '#dc2626', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Code</h3>
                <p style={{fontSize: '24px', fontWeight: '700', margin: 0, color: '#1a202c'}}>{user.referralCode}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'vrienden' && (
          <div style={{background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>👥 Vrienden die je hebt geholpen</h2>
            <p style={{color: '#718096', marginBottom: '20px'}}>Referral tracking functionaliteit komt binnenkort!</p>
          </div>
        )}
        
        {activeTab === 'beloningen' && (
          <div style={{background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>🎁 Jouw Beloningen</h2>
            <p style={{color: '#718096', marginBottom: '20px'}}>Beloningen systeem komt binnenkort!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
