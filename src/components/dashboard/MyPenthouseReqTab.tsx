import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Home, Calendar } from 'lucide-react';

export default function MyPenthouseReqTab({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'penthouseRequests'), where('userId', '==', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      setRequests(arr);
    });
    return () => unsub();
  }, [userId]);

  if (requests.length === 0) return null;

  return (
    <motion.div key="my-penthouse-req" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-amber-500 pl-4">MES DEMANDES DE PENTHOUSE</h2>
       
       <div className="grid grid-cols-1 gap-8">
         {requests.map((req) => (
           <div key={req.id} className="border border-white/10 bg-black p-8 relative overflow-hidden flex flex-col xl:flex-row gap-8 rounded-xl shadow-2xl">
             {req.status === 'pending' && <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none" />}
             {req.status === 'approved' && <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl pointer-events-none" />}
             {req.status === 'rejected' && <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl pointer-events-none" />}
             
             <div className="flex-1 relative z-10">
               <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-white/10">
                 <Home className="w-6 h-6 text-white" />
                 <h3 className="font-oswald text-2xl text-white uppercase tracking-wider">Penthouse de Maître</h3>
                 <span className={`px-4 py-1 text-xs font-oswald tracking-widest uppercase border rounded ${
                   req.status === 'pending' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                   req.status === 'approved' ? 'border-green-500 text-green-500 bg-green-500/10' :
                   'border-red-500 text-red-500 bg-red-500/10'
                 }`}>
                   {req.status === 'pending' ? 'En Cours d\'Analyse' : req.status === 'approved' ? 'Acception Validée' : 'Demande Refusée'}
                 </span>
               </div>

               <p className="font-sans text-sm text-gray-400 mb-8">
                 Demande envoyée le {new Date(req.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
               </p>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="bg-white/5 p-5 rounded-lg border border-white/5">
                   <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Dates de séjour</p>
                   <p className="font-sans text-base text-white">Du: {req.configuration.startDate ? new Date(req.configuration.startDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                   <p className="font-sans text-base text-white">Au: {req.configuration.endDate ? new Date(req.configuration.endDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                   <p className="font-oswald text-amber-500 mt-3 text-lg">{req.configuration.nights || 1} Nuit(s)</p>
                 </div>

                 <div className="bg-white/5 p-5 rounded-lg border border-white/5 col-span-2 flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                     <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-2">Style Sélectionné</p>
                     <p className="font-sans text-base text-white mb-3">{req.configuration.style?.name}</p>
                     {req.configuration.style?.image && (
                       <div className="h-16 w-full overflow-hidden rounded border border-white/20">
                          <img src={req.configuration.style.image} alt={req.configuration.style.name} className="w-full h-full object-cover" />
                       </div>
                     )}
                   </div>
                   <div className="flex-1">
                     <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-2">Modules Optionnels</p>
                     {req.configuration.addons?.length > 0 ? (
                       <div className="flex flex-wrap gap-3">
                         {req.configuration.addons.map((a: any, i: number) => (
                           <div key={i} className="group relative w-16 h-16 rounded overflow-hidden border border-white/20">
                              <img src={a.images && a.images[0] ? a.images[0] : a.image} alt={a.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] text-white text-center p-1 leading-tight">{a.name}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="font-sans text-sm text-gray-500">Aucun</p>
                     )}
                   </div>
                 </div>
               </div>
             </div>

             <div className="xl:border-l xl:border-white/10 xl:pl-8 flex flex-col justify-center shrink-0 min-w-[280px] bg-white/5 xl:bg-transparent p-6 xl:p-0 rounded-lg xl:rounded-none">
               <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-1">Montant Total Estimé</p>
               <p className="font-oswald text-4xl text-white tracking-wider">${req.configuration.totalPrice?.toLocaleString()}</p>
               <p className="font-sans text-sm text-gray-500 mt-1">Soit ${req.configuration.nightlyPrice?.toLocaleString()} / nuit</p>
               
               {req.status === 'pending' && (
                 <p className="text-sm font-sans text-amber-500/80 mt-6 leading-relaxed bg-amber-500/5 p-4 rounded border border-amber-500/10">
                   Un membre de la direction finalise l'étude de votre profil financier. Une réponse vous sera apportée sous peu.
                 </p>
               )}
               {req.status === 'approved' && (
                 <p className="text-sm font-sans text-green-400/80 mt-6 leading-relaxed bg-green-500/5 p-4 rounded border border-green-500/10">
                   Félicitations, votre demande est approuvée ! Vous pouvez désormais coordonner votre aménagement avec la conciergerie.
                 </p>
               )}
               {req.status === 'rejected' && (
                 <p className="text-sm font-sans text-red-500/80 mt-6 leading-relaxed bg-red-500/5 p-4 rounded border border-red-500/10">
                   Nous sommes au regret de vous informer que votre demande a été refusée suite à l'examen de votre profil.
                 </p>
               )}
             </div>
           </div>
         ))}
       </div>
    </motion.div>
  );
}
