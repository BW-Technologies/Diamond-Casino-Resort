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
       <div className="max-w-4xl border border-white/10 bg-black p-8 md:p-12 mb-8">
         <h3 className="font-oswald text-xl uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">Adhésions Générales</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
         </div>

         <h3 className="font-oswald text-xl uppercase tracking-widest text-[#9300c4] mb-6 border-b border-white/10 pb-4">Configuration Penthouse (Prix par nuit ou unitaire)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Prix de Base / Nuit</label>
              <input type="text" value={prices.penthouseNight} onChange={e=>setPrices({...prices, penthouseNight: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Style Vibrant (Supplément)</label>
              <input type="text" value={prices.penthouseStyleVibrant} onChange={e=>setPrices({...prices, penthouseStyleVibrant: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Style Sharp (Supplément)</label>
              <input type="text" value={prices.penthouseStyleSharp} onChange={e=>setPrices({...prices, penthouseStyleSharp: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Espace Lounge (Nuit)</label>
              <input type="text" value={prices.penthouseLounge} onChange={e=>setPrices({...prices, penthouseLounge: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Salle de Médias (Nuit)</label>
              <input type="text" value={prices.penthouseMedia} onChange={e=>setPrices({...prices, penthouseMedia: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Spa Privé (Nuit)</label>
              <input type="text" value={prices.penthouseSpa} onChange={e=>setPrices({...prices, penthouseSpa: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Espace Bar & Arcade (Nuit)</label>
              <input type="text" value={prices.penthouseBar} onChange={e=>setPrices({...prices, penthouseBar: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Croupier Privé (Nuit)</label>
              <input type="text" value={prices.penthouseDealer} onChange={e=>setPrices({...prices, penthouseDealer: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Bureau Sécurisé (Nuit)</label>
              <input type="text" value={prices.penthouseOffice} onChange={e=>setPrices({...prices, penthouseOffice: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Suite d'invités (Nuit)</label>
              <input type="text" value={prices.penthouseGuest} onChange={e=>setPrices({...prices, penthouseGuest: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Garage Privé VIP (Nuit)</label>
              <input type="text" value={prices.penthouseGarage} onChange={e=>setPrices({...prices, penthouseGarage: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#9300c4] transition-colors" />
            </div>
         </div>

         <h3 className="font-oswald text-xl uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4 mt-8">Services de Conciergerie (Unitaire)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Members Party</label>
              <input type="text" value={prices.conciergeParty} onChange={e=>setPrices({...prices, conciergeParty: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Service Voiturier</label>
              <input type="text" value={prices.conciergeValet} onChange={e=>setPrices({...prices, conciergeValet: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Service Champagne</label>
              <input type="text" value={prices.conciergeChampagne} onChange={e=>setPrices({...prices, conciergeChampagne: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Service de Nettoyage</label>
              <input type="text" value={prices.conciergeCleaning} onChange={e=>setPrices({...prices, conciergeCleaning: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Limousine Casino</label>
              <input type="text" value={prices.conciergeLimo} onChange={e=>setPrices({...prices, conciergeLimo: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="block font-oswald text-gray-400 text-sm tracking-widest uppercase mb-2">Hélicoptère</label>
              <input type="text" value={prices.conciergeHeli} onChange={e=>setPrices({...prices, conciergeHeli: e.target.value})} className="w-full bg-black border border-white/20 text-white px-4 py-3 font-sans focus:outline-none focus:border-white transition-colors" />
            </div>
         </div>

         <div className="mt-8 border-t border-white/10 pt-8">
           <button onClick={handleSavePrices} className="border border-white bg-white text-black font-oswald uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-all duration-300">
              SAUVEGARDER LES TARIFS
           </button>
           {savePriceStatus && <p className="mt-4 font-sans text-sm text-green-400">{savePriceStatus}</p>}
         </div>
       </div>
    </motion.div>
  );
}
