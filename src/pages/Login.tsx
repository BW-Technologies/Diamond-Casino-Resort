import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getAssetUrl } from '../lib/utils';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError("Identifiants incorrects ou compte inexistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-112px)] bg-black">
      {/* Image Panel */}
      <div className="hidden md:flex w-1/2 relative bg-zinc-900 border-r border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img 
          src={getAssetUrl("/737cf9b61dd8310c144cf2305ca75aa6f1dfc331.jpg")} 
          alt="Diamond Casino Interior" 
          className="w-full h-full object-cover grayscale opacity-60"
        />
        <div className="absolute bottom-12 left-12 z-20">
          <img src={getAssetUrl("/Diamond Casino & Resort 1.1.png")} alt="Logo" className="w-48 mb-6 drop-shadow-2xl" />
          <h2 className="font-oswald text-3xl text-white uppercase tracking-widest font-black leading-tight border-l-4 border-[#9300c4] pl-4">
            ACCÈS EMPLOYÉS<br/>& VIP SEULEMENT
          </h2>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Subtle patterned background or glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9300c4]/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-12">
            <h1 className="font-oswald text-4xl text-white uppercase tracking-widest font-black mb-2">CONNEXION</h1>
            <p className="text-gray-400 font-sans tracking-wide">Veuillez vous authentifier pour accéder à votre portail.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-oswald text-gray-400 tracking-[0.2em] uppercase mb-2">EMAIL OR IDENTIFIANT</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-oswald text-gray-400 tracking-[0.2em] uppercase mb-2">MOT DE PASSE</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-500 font-sans text-sm p-3 border border-red-500/30 bg-red-500/10">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full border border-white text-white font-oswald uppercase tracking-widest py-4 mt-8 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "AUTHENTIFICATION..." : "ACCÉDER AU PORTAIL"}
            </button>
            
            <p className="text-xs text-center text-gray-600 mt-6 font-sans">
              L'accès à ce portail est strictement surveillé. Toute tentative d'intrusion sera signalée au LSPD.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
