import React from 'react';
import { motion } from 'motion/react';

export default function RatesTab({
  prices, setPrices,
  handleSavePrices,
  savePriceStatus
}: any) {
  return (
    <motion.div key="rates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-amber-500 pl-4">TARIFS ET ADHÉSIONS</h2>
       <div className="max-w-2xl border border-white/10 bg-black p-8 md:p-12">
         <div className="space-y-6">
            <div>
              <label className="block font-oswald text-gray-500 tracking-widest uppercase mb-2">Carte de Membre (Standard / Silver)</label>
              <input type="text" value={prices.silver} onChange={e=>setPrices({...prices, silver: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-amber-500 tracking-widest uppercase mb-2">Accès VIP (Gold / Penthouse)</label>
              <input type="text" value={prices.gold} onChange={e=>setPrices({...prices, gold: e.target.value})} className="w-full bg-black border border-amber-500/50 text-amber-500 px-4 py-3 font-sans focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-fuchsia-500 tracking-widest uppercase mb-2">Statut Diamond (Sur Invitation)</label>
              <input type="text" value={prices.diamond} onChange={e=>setPrices({...prices, diamond: e.target.value})} className="w-full bg-black border border-fuchsia-500/50 text-fuchsia-500 px-4 py-3 font-sans focus:outline-none focus:border-fuchsia-500 transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-[#9300c4] tracking-widest uppercase mb-2">Prix par nuit (Penthouse Base)</label>
              <input type="text" value={prices.penthouseNight} onChange={e=>setPrices({...prices, penthouseNight: e.target.value})} className="w-full bg-black border border-[#9300c4]/50 text-[#9300c4] px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            
            <button onClick={handleSavePrices} className="mt-8 border border-white bg-white text-black font-oswald uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-all duration-300">
               SAUVEGARDER LES TARIFS
            </button>
            {savePriceStatus && <p className="mt-4 font-sans text-sm text-green-400">{savePriceStatus}</p>}
         </div>
       </div>
    </motion.div>
  );
}
