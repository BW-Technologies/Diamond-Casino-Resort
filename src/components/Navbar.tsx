import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { getAssetUrl } from '../lib/utils';

const navLinks = [
  { path: '/', label: 'ACCUEIL' },
  { path: '/heritage', label: 'HÉRITAGE' },
  { path: '/membership', label: 'ADHÉSION' },
  { path: '/penthouses', label: 'LE PENTHOUSE' },
  { path: '/casino', label: 'LE CASINO' },
  { path: '/store', label: 'LA BOUTIQUE' },
];

export default function Navbar() {
  const location = useLocation();

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
      className="fixed top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-md z-50 flex items-center justify-between px-12 transition-all border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-12 w-full">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
        >
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={getAssetUrl("/Diamond Casino & Resort 1.1.png")} alt="Diamond Casino Logo" className="h-14 md:h-16 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex items-center space-x-4 hidden lg:flex flex-1 justify-center"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div key={link.path} variants={itemVariants}>
                <Link
                  to={link.path}
                  className="relative px-4 py-2 font-oswald text-[13px] tracking-[0.2em] uppercase text-gray-300 transition-colors group"
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
      
      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="hidden lg:flex items-center gap-4"
      >
         <div className="px-6 py-2.5 border border-white/20 text-xs font-oswald tracking-widest hover:bg-white hover:text-black transition-all duration-500 cursor-pointer uppercase font-bold group shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.8)]">
           SE CONNECTER
         </div>
      </motion.div>
    </motion.nav>
  );
}
