import React, { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

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
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px'}}>
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
        background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#8b5cf6',
          borderRadius: '20px',
          padding: '50px 60px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 20px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{
            fontSize: '42px', 
            marginBottom: '25px', 
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.2'
          }}>
            Deel jouw mooie Bebsy ervaring
          </h1>
          <p style={{
            fontSize: '20px', 
            marginBottom: '40px', 
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '1.5'
          }}>
            Help jouw vrienden en familie ook van zo'n prachtige reis te genieten. Jullie profiteren allebei van mooie kortingen!
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
            Krijg mijn persoonlijke code
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{background: '#f8fafc', padding: '80px 40px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h2 style={{fontSize: '32px', color: '#1a202c', marginBottom: '20px', fontWeight: '700'}}>
              Samen delen, samen besparen
            </h2>
            <p style={{fontSize: '18px', color: '#718096'}}>
              Onze klanten hebben al veel vrienden geholpen van mooie reizen te genieten
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '40px', marginBottom: '15px'}}>✈️</div>
              <div style={{fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px'}}>1,847</div>
              <div style={{fontSize: '15px', color: '#4a5568'}}>Tevreden reizigers geholpen</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '40px', marginBottom: '15px'}}>💰</div>
              <div style={{fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px'}}>€380</div>
              <div style={{fontSize: '15px', color: '#4a5568'}}>Gemiddelde korting per persoon</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '40px', marginBottom: '15px'}}>⭐</div>
              <div style={{fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px'}}>4.9★</div>
              <div style={{fontSize: '15px', color: '#4a5568'}}>Waardering van onze service</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '40px', marginBottom: '15px'}}>🎯</div>
              <div style={{fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px'}}>89%</div>
              <div style={{fontSize: '15px', color: '#4a5568'}}>Boekt opnieuw bij Bebsy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding: '100px 40px', background: 'white'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', color: '#1a202c', marginBottom: '25px', fontWeight: '700'}}>
              Waarom je vrienden jou dankbaar zullen zijn
            </h2>
            <p style={{fontSize: '18px', color: '#718096', maxWidth: '700px', margin: '0 auto'}}>
              Jij weet al hoe fijn het is om met Bebsy te reizen. Deel die ervaring en help anderen ook van zulke mooie momenten te genieten.
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px'}}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
              <div style={{position: 'relative', height: '250px'}}>
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Stedentrips"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Stedentrips
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '22px', color: '#1a202c', marginBottom: '15px', fontWeight: '600'}}>
                  Deel je reisherinneringen
                </h3>
                <p style={{color: '#4a5568', lineHeight: '1.6'}}>
                  Vertel over jouw geweldige stedentrip naar Rome, Barcelona of Parijs. Jouw verhalen inspireren anderen.
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
              <div style={{position: 'relative', height: '250px'}}>
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Rondreis"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: '#059669',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Rondreis
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '22px', color: '#1a202c', marginBottom: '15px', fontWeight: '600'}}>
                  Ontdek samen nieuwe plekken
                </h3>
                <p style={{color: '#4a5568', lineHeight: '1.6'}}>
                  Van romantische rondreis door Toscane tot avontuurlijke fly & drive in IJsland - er is voor ieder wat wils.
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
              <div style={{position: 'relative', height: '250px'}}>
                <img 
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Kwaliteit"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Kwaliteit
                </div>
              </div>
              <div style={{padding: '30px'}}>
                <h3 style={{fontSize: '22px', color: '#1a202c', marginBottom: '15px', fontWeight: '600'}}>
                  Ervaar Bebsy kwaliteit
                </h3>
                <p style={{color: '#4a5568', lineHeight: '1.6'}}>
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
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', marginBottom: '25px', color: 'white', fontWeight: '700'}}>
            Klaar om jouw vrienden te verrassen?
          </h2>
          <p style={{fontSize: '20px', marginBottom: '50px', color: 'rgba(255,255,255,0.9)'}}>
            Log in met je Bebsy gegevens en krijg direct jouw persoonlijke deelcode
          </p>
          <button 
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '30px',
              padding: '20px 45px',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
            }}
            onClick={onLogin}
          >
            Haal mijn persoonlijke code op
          </button>
        </div>
      </section>

      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;500;600;700&family=Oleo+Script+Swash+Caps&display=swap');`}
      </style>
    </div>
  );
}

function Dashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overzicht');

  return (
    <div style={{fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc'}}>
      
      <header style={{background: 'white', padding: '40px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
          <div style={{
            fontFamily: 'Oleo Script Swash Caps, cursive', 
            fontSize: '32px', 
            color: '#1E0A46',
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px'
          }}>
            Bebsy
            <span style={{color: '#8C4BD7', marginLeft: '5px', fontSize: '24px'}}>✈</span>
          </div>
          <h1 style={{margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c'}}>Deel Dashboard</h1>
        </div>
        <p style={{margin: 0, color: '#718096', fontSize: '16px'}}>Beheer jouw persoonlijke deelcode en zie wie je hebt geholpen</p>
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
          onClick={onBack}
        >
          Uitloggen
        </button>
      </nav>

      <main style={{maxWidth: '1400px', margin: '0 auto', padding: '40px'}}>
        {activeTab === 'overzicht' && (
          <div style={{padding: '40px', background: '#f8fafc', borderRadius: '16px'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>📊 Jouw Deel Dashboard</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
              <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                <h3 style={{color: '#8b5cf6', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Vrienden Geholpen</h3>
                <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>12</p>
              </div>
              <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                <h3 style={{color: '#059669', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Besparingen</h3>
                <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>€340</p>
              </div>
              <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                <h3 style={{color: '#dc2626', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Code</h3>
                <p style={{fontSize: '24px', fontWeight: '700', margin: 0, color: '#1a202c'}}>MARIA2025</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vrienden' && (
          <div style={{background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>👥 Vrienden die je hebt geholpen</h2>
            <div style={{display: 'grid', gap: '20px'}}>
              <div style={{background: '#f8fafc', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '600', color: '#1a202c'}}>Anke van der Berg</div>
                  <div style={{color: '#4a5568', fontSize: '14px'}}>Rome Stedentrip - 15 maart 2025</div>
                </div>
                <span style={{background: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600'}}>Geboekt</span>
              </div>
              <div style={{background: '#f8fafc', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '600', color: '#1a202c'}}>Els Jansen</div>
                  <div style={{color: '#4a5568', fontSize: '14px'}}>Toscane Rondreis - Interesse</div>
                </div>
                <span style={{background: '#fef3c7', color: '#92400e', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600'}}>Bekijkt</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'beloningen' && (
          <div style={{background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>🎁 Jouw Beloningen</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
              <div style={{border: '1px solid #e2e8f0', padding: '30px', borderRadius: '16px'}}>
                <div style={{fontSize: '40px', marginBottom: '20px'}}>🏆</div>
                <h3 style={{color: '#8b5cf6', fontSize: '20px', fontWeight: '600', marginBottom: '15px'}}>€150 Reisvoucher</h3>
                <p style={{color: '#4a5568', marginBottom: '15px'}}>Voor het helpen van 5 vrienden.</p>
                <p style={{color: '#059669', fontSize: '14px', fontWeight: '600'}}>✓ Behaald!</p>
              </div>
              <div style={{border: '1px solid #e2e8f0', padding: '30px', borderRadius: '16px'}}>
                <div style={{fontSize: '40px', marginBottom: '20px'}}>🌟</div>
                <h3 style={{color: '#dc2626', fontSize: '20px', fontWeight: '600', marginBottom: '15px'}}>VIP Service</h3>
                <p style={{color: '#4a5568', marginBottom: '15px'}}>Voor 10 vrienden helpen.</p>
                <p style={{color: '#8b5cf6', fontSize: '14px', fontWeight: '600'}}>Nog 3 te gaan!</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
