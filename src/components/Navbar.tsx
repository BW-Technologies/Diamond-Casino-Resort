import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { getAssetUrl } from '../lib/utils';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const navLinks = [
  { path: '/', label: 'ACCUEIL' },
  { path: '/heritage', label: 'HÉRITAGE' },
  { path: '/membership', label: 'ADHÉSION' },
  { path: '/penthouses', label: 'LE PENTHOUSE' },
  { path: '/casino', label: 'LE CASINO' },
  { path: '/events', label: 'ÉVÈNEMENTS' },
  { path: '/store', label: 'LA BOUTIQUE' },
];

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-3xl z-50 flex items-center justify-between px-6 md:px-12 transition-all border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-4 md:gap-12 w-full">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="z-50"
        >
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={getAssetUrl("/Diamond Casino & Resort 1.1.png")} alt="Diamond Casino Logo" className="h-10 md:h-16 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="items-center space-x-2 xl:space-x-4 hidden lg:flex flex-1 justify-center"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div key={link.path} variants={itemVariants}>
                <Link
                  to={link.path}
                  className="relative px-3 py-2 font-oswald text-[12px] xl:text-[13px] tracking-[0.2em] uppercase text-gray-300 transition-colors group"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:text-white font-medium'}`}>{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/5 border-b-[2px] border-[#9300c4]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* CTA Desktop */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="hidden lg:flex items-center gap-4 flex-shrink-0"
      >
         <Link to={user ? "/dashboard" : "/login"} className="px-6 py-2.5 border border-white/20 text-xs font-oswald tracking-widest hover:bg-white hover:text-black transition-all duration-500 cursor-pointer uppercase font-bold group shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] whitespace-nowrap block">
           {user ? "MON PORTAIL" : "SE CONNECTER"}
         </Link>
      </motion.div>

      {/* Mobile Menu Toggle */}
      <motion.button
        className="lg:hidden text-white z-50 p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.9 }}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-3xl z-40 flex flex-col pt-24 px-6 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 w-full">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div 
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full py-4 border-b border-white/10 font-oswald text-lg tracking-[0.2em] uppercase transition-colors ${isActive ? 'text-[#9300c4] font-bold' : 'text-gray-300 hover:text-white'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 + 0.2 }}
                className="mt-8"
              >
                <Link to={user ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="w-full block text-center px-6 py-4 border border-white/20 text-sm font-oswald tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer uppercase font-bold text-white">
                  {user ? "MON PORTAIL" : "SE CONNECTER"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
