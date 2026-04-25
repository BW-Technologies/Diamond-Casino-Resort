import React from 'react';
import { motion } from 'motion/react';
import { Shield, Star, Car, Key, CreditCard, UserCircle } from 'lucide-react';

export default function OverviewTab({ userData, triggerConcierge }: { userData: any, triggerConcierge: (msg: string) => void }) {
  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <div className="flex items-center gap-6 mb-12">
         {userData.photoURL ? (
            <img src={userData.photoURL} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#9300c4]/50" />
         ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-white/10 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-gray-500" />
            </div>
         )}
         <div>
           <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-widest font-black text-white mb-2">BIENVENUE, {userData.displayName}</h1>
           <p className="text-gray-400 font-sans font-light">Ravi de vous revoir au Diamond Casino & Resort.</p>
         </div>
       </div>

       {(userData.role === 'patron' || userData.role === 'employe') && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="border border-white/10 bg-black p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#9300c4]/10 blur-3xl group-hover:bg-[#9300c4]/20 transition-all" />
             <Shield className="w-8 h-8 text-[#9300c4] mb-4" />
             <h3 className="text-xl font-oswald uppercase tracking-widest font-bold text-white mb-2">SYSTÈME SÉCURISÉ</h3>
             <p className="text-gray-400 font-sans text-sm">Le réseau de la direction est actif. Vous avez accès au répertoire de la clientèle et à la gestion de crise. Pour toute alerte en salle, contactez la sécurité.</p>
           </div>
           <div className="border border-white/10 bg-black p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all" />
             <Star className="w-8 h-8 text-amber-500 mb-4" />
             <h3 className="text-xl font-oswald uppercase tracking-widest font-bold text-white mb-2">PROTOCOLES VIP</h3>
             <p className="text-gray-400 font-sans text-sm">Préparez-vous aux arrivées par hélicoptère. Assurez-vous que les suites d'invités sont prêtes pour les membres Diamond actuels.</p>
           </div>
         </div>
       )}

       {(userData.role === 'vip' || userData.role === 'client') && (
         <div className="space-y-8">
           <div className="border border-white/10 bg-black p-8 md:p-12">
             <h3 className="text-2xl font-oswald uppercase tracking-widest font-black text-white mb-6 border-l-4 border-[#9300c4] pl-4">VOS PRIVILÈGES</h3>
             {userData.role === 'vip' ? (
               <p className="font-sans text-gray-400 leading-relaxed max-w-3xl">En tant que membre Platinum/Diamond, vos accès vous permettent de réquisitionner nos services les plus exclusifs en temps réél. Vous pouvez commander un chauffeur, privatiser une table haute-limite ou demander votre agent d'entretien personnel à tout moment.</p>
             ) : (
               <p className="font-sans text-gray-400 leading-relaxed max-w-3xl">Votre adhésion standard vous octroie l'accès immédiat à tous nos bars, boîtes de nuit et tables de jeu du rez-de-chaussée. Pour élever vos privilèges, veuillez contacter l'accueil afin de visiter un Penthouse VIP.</p>
             )}
           </div>

           {userData.role === 'vip' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button onClick={() => triggerConcierge("Le service de voiturier a été notifié. Votre véhicule vous attend.")} className="border border-white/10 bg-black p-6 hover:bg-white/5 transition-all text-left group">
                 <Car className="w-6 h-6 text-gray-400 group-hover:text-white mb-4" />
                 <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-white mb-2">GÉRONIMO VOITURIER</h4>
                 <p className="font-sans text-xs text-gray-500">Préparer un véhicule en surface.</p>
               </button>
               <button onClick={() => triggerConcierge("Le Spa du penthouse a été lancé. Température 38°C.")} className="border border-white/10 bg-black p-6 hover:bg-white/5 transition-all text-left group">
                 <Key className="w-6 h-6 text-gray-400 group-hover:text-white mb-4" />
                 <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-white mb-2">SERVICES PENTHOUSE</h4>
                 <p className="font-sans text-xs text-gray-500">Activer les installations de la suite.</p>
               </button>
               <button onClick={() => triggerConcierge("Le carré VIP du Music Locker a été privatisé à votre nom.")} className="border border-white/10 bg-black p-6 hover:bg-white/5 transition-all text-left group">
                 <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-white mb-4" />
                 <h4 className="font-oswald uppercase tracking-widest text-sm font-bold text-white mb-2">RÉSERVATION NIGHTCLUB</h4>
                 <p className="font-sans text-xs text-gray-500">Demander un accès au carré VIP.</p>
               </button>
             </div>
           )}
         </div>
       )}
    </motion.div>
  );
}
