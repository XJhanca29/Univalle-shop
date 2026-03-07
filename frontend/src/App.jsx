import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import univalleLogo from './assets/logo-univalle.png';

function App() {
  const [view, setView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const UNIVALLE_RED = '#cc0000';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 1. Validar dominio
      if (!user.email.endsWith('@correounivalle.edu.co')) {
        setMessage('❌ Acceso denegado: Usa tu correo institucional');
        auth.signOut();
        setLoading(false);
        return;
      }

      // 2. PREGUNTAMOS AL BACKEND: ¿Este usuario ya existe?
      const getResponse = await fetch(`http://localhost:3001/api/users/${user.email}`);

      if (getResponse.ok) {
        // EL USUARIO YA EXISTE
        const data = await getResponse.json();
        setCurrentUser({ ...user, ...data.data }); 

        // LA MAGIA: ¿Ya completó el perfil?
        if (data.data.isProfileComplete) {
          setView('shop'); // ¡Sáltate el formulario y ve a la tienda!
        } else {
          setView('onboarding'); // Le falta llenar el formulario
        }
        
      } else {
        // 3. EL USUARIO NO EXISTE (Error 404). LO CREAMOS POR PRIMERA VEZ.
        const postResponse = await fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            picture: user.photoURL,
            role: 'student'
          })
        });

        const postData = await postResponse.json();

        if (postResponse.ok) {
          setCurrentUser({ ...user, ...postData.data }); 
          setView('onboarding'); // Como es nuevo, sí o sí va al onboarding
        } else {
          setMessage(`⚠️ ${postData.message}`);
        }
      }
      
    } catch (error) {
      console.error(error);
      setMessage('❌ Error al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Limpiamos mensajes previos
    
    try {
      // Hacemos un PUT a la ruta que acabamos de crear, pasando el email en la URL
      const response = await fetch(`http://localhost:3001/api/users/${currentUser.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          phone: phone,
          address: address
        })
      });

      const data = await response.json();

      if (response.ok) {
        // ¡Éxito! Los datos se guardaron en MongoDB, pasamos a la tienda
        setView('shop');
      } else {
        setMessage(`⚠️ Error al guardar: ${data.message}`);
      }
      
    } catch (error) {
      console.error(error);
      setMessage('❌ Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VISTA 1: LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', width: '100vw', minHeight: '100vh', overflowX: 'hidden', margin: 0, padding: 0, backgroundColor: 'white' }}>
        
        <header style={{ backgroundColor: UNIVALLE_RED, color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={univalleLogo} 
              alt="Logo Universidad del Valle" 
              style={{ height: '40px', width: 'auto', display: 'block' }} 
            />
            <h1 style={{ margin: 0, fontSize: '22px' }}>Universidad del Valle</h1>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            Univalle Shop
          </div>
        </header>

        <main style={{ display: 'flex', flexWrap: 'wrap', padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', alignItems: 'center', gap: '40px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '42px', color: '#333', margin: '0 0 20px 0', lineHeight: '1.2' }}>
              Bienvenido a tu <span style={{ color: UNIVALLE_RED }}>tienda universitaria</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: '1.5' }}>
              Haz de tu vida universitaria una experiencia más sencilla. Compra, vende y descubre productos exclusivos para la comunidad académica de Univalle.
            </p>
            
            <div style={{ backgroundColor: '#f4f4f5', padding: '25px', borderRadius: '8px', borderLeft: `5px solid ${UNIVALLE_RED}` }}>
              <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', color: '#333' }}>Ingresa con tu correo institucional:</p>
              
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '14px', backgroundColor: 'white', color: '#444', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? 'Validando credenciales...' : 'Iniciar sesión con Google'}
              </button>
              {message && <div style={{ marginTop: '15px', fontSize: '14px', fontWeight: 'bold', color: message.includes('❌') ? UNIVALLE_RED : '#2e7d32' }}>{message}</div>}
            </div>
          </div>

          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Estudiantes universitarios" 
              style={{ width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
            />
          </div>
        </main>

        <section style={{ backgroundColor: '#f4f4f5', padding: '50px 40px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: `4px solid #666` }}>
            <h3 style={{ color: '#333', marginTop: 0 }}>🛍️ Compra Segura</h3>
            <ul style={{ color: '#666', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Productos exclusivos para estudiantes.</li>
              <li>Validación de usuarios con correo institucional.</li>
              <li>Entregas coordinadas en el campus.</li>
            </ul>
          </div>

          <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: `4px solid #666` }}>
            <h3 style={{ color: '#333', marginTop: 0 }}>🚀 Ayudas rápidas</h3>
            <ul style={{ color: '#666', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>¿Cómo publicar un producto?</li>
              <li>Políticas de reembolso y garantías.</li>
              <li>Soporte técnico y preguntas frecuentes.</li>
            </ul>
          </div>

          <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: `4px solid #666` }}>
            <h3 style={{ color: '#333', marginTop: 0 }}>📍 Atención y soporte</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
              ✉️ soporte.shop@correounivalle.edu.co<br/><br/>
              Si requiere atención personalizada, envíe un correo detallando su solicitud. Las entregas se realizan principalmente en el Campus Meléndez y San Fernando.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: ONBOARDING (Completar Perfil)
  // ==========================================
  if (view === 'onboarding') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#eef1f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Segoe UI", sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '450px', width: '90%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={currentUser?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
              alt="Perfil" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
              }}
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px', border: `3px solid ${UNIVALLE_RED}`, objectFit: 'cover' }} 
            />
            <h2 style={{ color: UNIVALLE_RED, margin: '0 0 5px 0' }}>¡Hola, {currentUser?.displayName?.split(' ')[0]}!</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Para proteger a nuestra comunidad, necesitamos un par de datos extra antes de que empieces a usar la tienda.</p>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Código de Estudiante</label>
              <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required placeholder="Ej. 202123456" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Teléfono / WhatsApp</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Ej. 3001234567" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Sede o Dirección (Para entregas)</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Ej. Sede Meléndez - Facultad de Ingeniería" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading} style={{ backgroundColor: UNIVALLE_RED, color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {loading ? 'Guardando...' : 'Guardar y Continuar 🚀'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 3: LA TIENDA
  // ==========================================
  if (view === 'shop') {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: UNIVALLE_RED }}>🛒 Univalle Shop</h1>
        <p>¡Perfil completado exitosamente! Aquí pronto construiremos el catálogo de productos.</p>
        <button onClick={() => { auth.signOut(); setView('landing'); }} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>Cerrar Sesión</button>
      </div>
    );
  }
}

export default App;