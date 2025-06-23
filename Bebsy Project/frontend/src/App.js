import React, { useState, useEffect } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  // Voeg dit toe:
  useEffect(() => {
    document.title = "Bebsy - Deel je Reisrvaring";
  }, []);

  // Je bestaande code blijft hetzelfde...
  if (currentPage === 'dashboard') {
    return <Dashboard onBack={() => setCurrentPage('landing')} />;
  }

  return <LandingPage onLogin={() => setCurrentPage('dashboard')} />;
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
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px'}}>
          <div style={{
            fontFamily: 'Oleo Script Swash Caps, cursive',
            fontSize: '32px',
            color: '#1E0A46',
            display: 'flex',
            alignItems: 'center'
          }}>
            Bebsy
            <span style={{color: '#8C4BD7', marginLeft: '5px', fontSize: '24px'}}>✈</span>
          </div>
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
              Mijn Code Ophalen
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        height: '70vh',
        background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1544925248-120b99b2eea2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#8b5cf6',
          borderRadius: '20px',
          padding: '60px',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 20px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Deel jouw mooie Bebsy ervaring
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'white',
            marginBottom: '40px',
            opacity: 0.95
          }}>
            Help jouw vrienden en familie ook van zo'n prachtige reis te genieten. Jullie profiteren allebei van mooie kortingen!
          </p>
          <button 
            style={{
              background: 'white',
              color: '#8b5cf6',
              border: 'none',
              borderRadius: '25px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={onLogin}
          >
            Krijg mijn persoonlijke code
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding: '100px 20px', background: '#f8fafc'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '42px', fontWeight: 'bold', color: '#1a202c', marginBottom: '20px'}}>
            Samen delen, samen besparen
          </h2>
          <p style={{fontSize: '20px', color: '#718096', marginBottom: '80px', maxWidth: '600px', margin: '0 auto 80px'}}>
            Onze klanten hebben al veel vrienden geholpen van mooie reizen te genieten
          </p>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px'}}>
            {/* Card 1 */}
            <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
              <div style={{height: '250px', position: 'relative'}}>
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Stedentrips"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Stedentrips
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px'}}>
                  Deel je reisherinneringen
                </h3>
                <p style={{fontSize: '16px', color: '#718096', lineHeight: '1.6'}}>
                  Vertel over jouw geweldige stedentrip naar Rome, Barcelona of Parijs. Jouw verhalen inspireren anderen.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
              <div style={{height: '250px', position: 'relative'}}>
                <img 
                  src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Rondreis"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Rondreis
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px'}}>
                  Ontdek samen nieuwe plekken
                </h3>
                <p style={{fontSize: '16px', color: '#718096', lineHeight: '1.6'}}>
                  Van romantische rondreis door Toscane tot avontuurlijke fly & drive in IJsland - er is voor ieder wat wils.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
              <div style={{height: '250px', position: 'relative'}}>
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Kwaliteit"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Kwaliteit
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px'}}>
                  Ervaar Bebsy kwaliteit
                </h3>
                <p style={{fontSize: '16px', color: '#718096', lineHeight: '1.6'}}>
                  Jouw vrienden krijgen dezelfde zorgvuldige begeleiding en persoonlijke service waar jij zo tevreden over bent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '42px', fontWeight: 'bold', color: 'white', marginBottom: '24px'}}>
            Klaar om te delen?
          </h2>
          <p style={{fontSize: '20px', color: 'white', marginBottom: '40px', opacity: 0.9}}>
            Krijg jouw persoonlijke referral code en help vrienden van geweldige reizen te genieten
          </p>
          <button 
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '25px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={onLogin}
          >
            Mijn Code Ophalen
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: '#1a202c', padding: '60px 20px', color: 'white'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{
            fontFamily: 'Oleo Script Swash Caps, cursive',
            fontSize: '32px',
            color: '#8b5cf6',
            marginBottom: '30px'
          }}>
            Bebsy ✈
          </div>
          <p style={{fontSize: '16px', color: '#a0aec0', marginBottom: '30px'}}>
            Deel de mooiste reiservaringen met vrienden en familie
          </p>
          <div style={{borderTop: '1px solid #4a5568', paddingTop: '30px'}}>
            <p style={{fontSize: '14px', color: '#718096'}}>
              © 2024 Bebsy. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Dashboard({ onBack }) {
  return (
    <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
      <h1 style={{color: '#8b5cf6', marginBottom: '30px'}}>Dashboard</h1>
      <p style={{fontSize: '18px', marginBottom: '30px'}}>Welkom! Hier komt jouw persoonlijke referral code.</p>
      <button 
        onClick={onBack}
        style={{
          background: '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Terug naar Home
      </button>
    </div>
  );
}

export default App;
