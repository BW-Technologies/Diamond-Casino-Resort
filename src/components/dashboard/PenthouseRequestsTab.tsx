import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Home, Check, X, Clock, Trash2, Calendar } from 'lucide-react';

export default function PenthouseRequestsTab({ userData }: { userData: any }) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'penthouseRequests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setRequests(arr);
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'penthouseRequests', id), { status: newStatus, updatedAt: Date.now() });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRequest = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      try {
        await deleteDoc(doc(db, 'penthouseRequests', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <motion.div key="penthouse-requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-[#9300c4] pl-4">DEMANDES PENTHOUSE</h2>
       
       {requests.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black rounded-xl">
           <Home className="w-12 h-12 text-gray-500 mb-4" />
           <p className="font-oswald text-gray-400 tracking-widest uppercase">Aucune demande pour le moment.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 gap-8">
           {requests.map((req) => (
             <div key={req.id} className="border border-white/10 bg-black p-8 relative overflow-hidden flex flex-col xl:flex-row gap-8 rounded-xl shadow-2xl">
               {req.status === 'pending' && <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none" />}
               {req.status === 'approved' && <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl pointer-events-none" />}
               {req.status === 'rejected' && <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl pointer-events-none" />}
               
               <div className="flex-1 relative z-10">
                 <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-white/10">
                   <h3 className="font-oswald text-2xl text-white uppercase tracking-wider">{req.userName}</h3>
                   <span className="text-sm text-gray-400 font-sans">{req.userEmail}</span>
                   <span className={`px-3 py-1 text-[10px] font-oswald tracking-widest uppercase border rounded ${
                     req.status === 'pending' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                     req.status === 'approved' ? 'border-green-500 text-green-500 bg-green-500/10' :
                     'border-red-500 text-red-500 bg-red-500/10'
                   }`}>
                     {req.status === 'pending' ? 'En Attente' : req.status === 'approved' ? 'Approuvé' : 'Refusé'}
                   </span>
                   <span className="text-xs text-gray-600 font-sans ml-auto">
                     Demande le {new Date(req.createdAt).toLocaleString('fr-FR')}
                   </span>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                   <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                     <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Dates</p>
                     <p className="font-sans text-sm text-white">Du: {req.configuration.startDate ? new Date(req.configuration.startDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                     <p className="font-sans text-sm text-white">Au: {req.configuration.endDate ? new Date(req.configuration.endDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                     <p className="font-oswald text-amber-500 text-sm mt-2">{req.configuration.nights || 1} Nuit(s)</p>
                   </div>
                   
                   <div className="bg-white/5 p-4 rounded-lg border border-white/5 col-span-2 flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-2">Style</p>
                        <p className="font-sans text-base text-white mb-2">{req.configuration.style?.name}</p>
                        {req.configuration.style?.image && (
                           <div className="h-12 w-full overflow-hidden rounded border border-white/20">
                              <img src={req.configuration.style.image} alt={req.configuration.style.name} className="w-full h-full object-cover" />
                           </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-2">Modules ({req.configuration.addons?.length || 0})</p>
                        {req.configuration.addons?.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                             {req.configuration.addons.map((a: any, i: number) => (
                               <div key={i} className="group relative w-16 h-16 rounded overflow-hidden border border-white/20 cursor-help">
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
                 <div className="mb-6">
                   <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-1">Montant Total du Séjour</p>
                   <p className="font-oswald text-4xl text-white tracking-wider">${req.configuration.totalPrice?.toLocaleString()}</p>
                   <p className="font-sans text-sm text-gray-500 mt-1">Soit ${req.configuration.nightlyPrice?.toLocaleString()} / nuit</p>
                 </div>
                 
                 <div className="flex flex-col gap-3 mt-auto">
                   {userData.role === 'patron' ? (
                     <>
                       {req.status === 'pending' && (
                         <>
                           <button onClick={() => updateStatus(req.id, 'approved')} className="flex items-center gap-2 justify-center px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-oswald text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all rounded">
                             <Check className="w-4 h-4" /> Approuver
                           </button>
                           <button onClick={() => updateStatus(req.id, 'rejected')} className="flex items-center gap-2 justify-center px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-oswald text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded">
                             <X className="w-4 h-4" /> Refuser
                           </button>
                         </>
                       )}
                       {(req.status === 'approved' || req.status === 'rejected') && (
                         <button onClick={() => updateStatus(req.id, 'pending')} className="flex items-center gap-2 justify-center px-4 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-oswald text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all rounded">
                           <Clock className="w-4 h-4" /> Remettre en attente
                         </button>
                       )}
                       <button onClick={() => deleteRequest(req.id)} className="flex items-center gap-2 justify-center px-4 py-3 mt-4 text-gray-500 font-oswald text-sm uppercase tracking-widest border border-transparent hover:border-red-500/50 hover:text-red-500 transition-all rounded">
                         <Trash2 className="w-4 h-4" /> Supprimer la demande
                       </button>
                     </>
                   ) : (
                     <div className="px-4 py-3 bg-white/5 text-gray-500 font-oswald text-sm uppercase tracking-widest text-center border border-white/5 rounded">
                       Lecture Seule
                     </div>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
    </motion.div>
  );
}
