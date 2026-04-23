import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const navLinks = [
  { path: '/', label: 'ACCUEIL' },
  { path: '/membership', label: 'ADHÉSION' },
  { path: '/penthouses', label: 'LES PENTHOUSES' },
  { path: '/casino', label: 'LE CASINO' },
  { path: '/store', label: 'LA BOUTIQUE' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 h-28 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-between px-12 transition-all border-b border-white/5"
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="./Diamond Casino & Resort 1.png" alt="Diamond Casino Logo" className="h-24 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
        </Link>
        <div className="flex items-center space-x-4 hidden md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 font-oswald text-[14px] tracking-[0.15em] uppercase text-gray-200 transition-colors group"
              >
                <span className={`relative z-10 ${isActive ? 'text-white font-bold' : 'group-hover:text-white font-medium'}`}>{link.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/5 border-b-[3px] border-[#9300c4]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* CTA or status indicator */}
      <div className="hidden lg:flex items-center gap-4">
         <div className="px-5 py-2 border border-white/20 text-xs font-oswald tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer uppercase font-bold group">
           SE CONNECTER
         </div>
      </div>
    </motion.nav>
  );
}
