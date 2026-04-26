import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Home, Calendar, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export default function MyPenthouseReqTab({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const deleteRequest = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Voulez-vous vraiment annuler et supprimer cette réservation ?")) {
      try {
        await deleteDoc(doc(db, 'penthouseRequests', id));
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'annulation de la réservation.");
      }
    }
  };

  if (requests.length === 0) return null;

  return (
    <motion.div key="my-penthouse-req" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-[#9300c4] pl-4">MES RÉSERVATIONS PENTHOUSE</h2>
       
       <div className="grid grid-cols-1 gap-6">
         {requests.map((req) => {
           const conf = req.configuration;
           const isExpanded = expandedId === req.id;
           
           return (
             <div key={req.id} className="border border-white/10 bg-[#0a0a0a] relative overflow-hidden flex flex-col rounded shadow-xl">
               
               {/* Header Summary */}
               <div 
                 className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                 onClick={() => setExpandedId(isExpanded ? null : req.id)}
               >
                 <div className="flex-1">
                   <div className="flex items-center gap-4 mb-2">
                     <Home className="w-5 h-5 text-[#9300c4]" />
                     <h3 className="font-oswald text-xl text-white uppercase tracking-wider">Penthouse de Maître</h3>
                     <span className={`px-2 py-0.5 text-xs font-oswald tracking-widest uppercase border rounded ${
                       req.status === 'pending' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                       req.status === 'approved' ? 'border-green-500 text-green-500 bg-green-500/10' :
                       'border-red-500 text-red-500 bg-red-500/10'
                     }`}>
                       {req.status === 'pending' ? 'En Cours d\'Analyse' : req.status === 'approved' ? 'Validation Accordée' : 'Demande Refusée'}
                     </span>
                   </div>
                   
                   <div className="flex items-center gap-4 text-sm font-sans text-gray-400 mt-3">
                     <div className="flex items-center gap-1.5 bg-black px-3 py-1.5 rounded border border-white/5">
                       <Calendar className="w-4 h-4 text-[#9300c4]" />
                       <span>{new Date(conf.startDate).toLocaleDateString('fr-FR')} - {new Date(conf.endDate).toLocaleDateString('fr-FR')} ({conf.totalNights} nuit{conf.totalNights > 1 && 's'})</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="text-left md:text-right flex-1 md:flex-none">
                     <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-1">Total Séjour</p>
                     <p className="font-oswald text-2xl text-white tracking-wider">${(conf.totalPrice || conf.nightlyPrice * conf.totalNights).toLocaleString()}</p>
                   </div>
                   <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/5">
                     {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                   </button>
                 </div>
               </div>

               {/* Expanded Details */}
               <AnimatePresence>
                 {isExpanded && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden border-t border-white/5 bg-black"
                   >
                     {req.status === 'rejected' && req.rejectionReason && (
                       <div className="p-4 mx-6 mt-6 bg-red-500/10 border border-red-500/30 rounded flex flex-col gap-1">
                         <span className="font-oswald text-red-500 text-xs tracking-widest uppercase font-bold">Motif du Refus</span>
                         <p className="font-sans text-sm text-red-200">{req.rejectionReason}</p>
                       </div>
                     )}
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-oswald text-xs tracking-widest uppercase text-gray-500 mb-4 pb-2 border-b border-white/10">Configuration</h4>
                          
                          <div className="flex items-center justify-between bg-[#111] p-3 rounded mb-2 border border-white/5">
                            <span className="font-sans text-sm text-gray-300">Style: <span className="text-white font-medium">{conf.style?.name}</span></span>
                            <span className="font-mono text-xs text-amber-500">{conf.style?.pricePerNight === 0 ? 'Standard' : `+$${conf.style?.pricePerNight?.toLocaleString()}/nuit`}</span>
                          </div>
                          
                          {conf.addons?.length > 0 ? (
                            <div className="space-y-2 mt-4">
                              {conf.addons.map((a: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-[#111] p-3 rounded border border-white/5">
                                  <div className="flex items-center gap-2">
                                    <Plus className="w-3 h-3 text-[#9300c4]" />
                                    <span className="font-sans text-sm text-gray-300">{a.name}</span>
                                  </div>
                                  <span className="font-mono text-xs text-amber-500">+${(a.pricePerNight || a.price)?.toLocaleString()}/nuit</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="font-sans text-sm text-gray-500 italic mt-4">Aucun module additionnel.</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                           <h4 className="font-oswald text-xs tracking-widest uppercase text-gray-500 mb-4 pb-2 border-b border-white/10">Aperçu Principal</h4>
                           <div className="relative rounded overflow-hidden h-40 border border-white/10 shrink-0">
                               <img src="https://static.wikia.nocookie.net/gtawiki/images/f/fe/MasterPenthouse-GTAO-Options-MasterPenthouse.png/revision/latest/scale-to-width-down/1000?cb=20210110105607" alt="Suite" className="w-full h-full object-cover" />
                           </div>
                           
                           {/* Addons images gallery miniature */}
                           {conf.addons?.length > 0 && (
                             <div className="flex gap-2 mt-2 overflow-x-auto pb-2 custom-scrollbar">
                               {conf.addons.map((a: any) => {
                                  const imgMatch = a.images ? a.images[0] : a.image;
                                  return imgMatch ? (
                                    <div key={a.id} className="w-20 h-16 shrink-0 rounded overflow-hidden border border-white/10" title={a.name}>
                                      <img src={imgMatch} alt={a.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : null;
                               })}
                             </div>
                           )}
                           
                           <div className="mt-auto pt-4 flex justify-between items-center text-sm font-sans border-t border-white/5">
                             <div className="flex flex-col gap-1">
                               <span className="text-gray-400">Tarif par nuit : <span className="text-white">${conf.nightlyPrice?.toLocaleString()}</span></span>
                               <span className="text-gray-400 text-xs">Demandé le {new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
                             </div>
                             {req.status === 'pending' && (
                               <button 
                                 onClick={(e) => deleteRequest(req.id, e)}
                                 className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors uppercase font-oswald text-xs tracking-widest rounded"
                               >
                                 <Trash2 className="w-3 h-3" /> Annuler
                               </button>
                             )}
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
               
             </div>
           );
         })}
       </div>
    </motion.div>
  );
}
