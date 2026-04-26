import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Check, X, Clock, Trash2, Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function PenthouseRequestsTab({ userData }: { userData: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // States for Rejection Modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // States for Generic Errors (e.g. overlap)
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'penthouseRequests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setRequests(arr);
    });
    return () => unsub();
  }, []);

  const approveRequest = async (req: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setErrorStatus(null);
    
    // Conflict check
    const newStart = new Date(req.configuration.startDate).getTime();
    const newEnd = new Date(req.configuration.endDate).getTime();
    
    const hasOverlap = requests.some(r => {
      if (r.id === req.id || r.status !== 'approved') return false;
      const existingStart = new Date(r.configuration.startDate).getTime();
      const existingEnd = new Date(r.configuration.endDate).getTime();
      // Returns true if date ranges overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasOverlap) {
      setErrorStatus(`Impossible d'approuver la réservation de ${req.userName}. Les dates sélectionnées entrent en conflit avec une location existante du Penthouse.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'penthouseRequests', req.id), { status: 'approved', updatedAt: Date.now(), rejectionReason: null });
    } catch (err) {
      console.error(err);
      setErrorStatus("Une erreur est survenue lors de l'approbation.");
    }
  };

  const openRejectionModal = (reqId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRejectingRequestId(reqId);
    setRejectionReason('');
    setRejectionModalOpen(true);
  };

  const confirmRejection = async () => {
    if (!rejectingRequestId) return;
    try {
      await updateDoc(doc(db, 'penthouseRequests', rejectingRequestId), { 
        status: 'rejected', 
        updatedAt: Date.now(),
        rejectionReason: rejectionReason.trim() || 'Aucune raison spécifiée.'
      });
      setRejectionModalOpen(false);
      setRejectingRequestId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du refus.");
    }
  };

  const revertToPending = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await updateDoc(doc(db, 'penthouseRequests', id), { status: 'pending', updatedAt: Date.now(), rejectionReason: null });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRequest = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      try {
        await deleteDoc(doc(db, 'penthouseRequests', id));
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <motion.div key="penthouse-requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white border-l-4 border-[#9300c4] pl-4">DEMANDES PENTHOUSE</h2>
       </div>

       <AnimatePresence>
         {errorStatus && (
           <motion.div 
             initial={{ opacity: 0, y: -10 }} 
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, y: -10 }}
             className="mb-8 p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-4 rounded"
           >
             <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
             <div>
               <h4 className="font-oswald uppercase tracking-widest text-red-500 text-sm font-bold mb-1">CONFLIT DÉTECTÉ</h4>
               <p className="font-sans text-sm text-red-200">{errorStatus}</p>
             </div>
             <button onClick={() => setErrorStatus(null)} className="ml-auto text-red-500/50 hover:text-red-500 transition-colors p-1">
               <X className="w-4 h-4" />
             </button>
           </motion.div>
         )}
       </AnimatePresence>
       
       {requests.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black">
           <Home className="w-12 h-12 text-gray-500 mb-4" />
           <p className="font-oswald text-gray-400 tracking-widest uppercase">Aucune demande pour le moment.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 gap-6">
           {requests.map((req) => {
             const conf = req.configuration;
             const isExpanded = expandedId === req.id;
             
             return (
               <div key={req.id} className="border border-white/10 bg-[#0a0a0a] relative overflow-hidden flex flex-col rounded shadow-xl">
                 
                 {req.status === 'pending' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />}
                 {req.status === 'approved' && <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl pointer-events-none" />}
                 {req.status === 'rejected' && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />}

                 {/* Header Summary */}
                 <div 
                   className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer hover:bg-white/5 transition-colors relative z-10"
                   onClick={() => setExpandedId(isExpanded ? null : req.id)}
                 >
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-oswald text-xl text-white uppercase tracking-wider">{req.userName}</h3>
                       <span className="text-xs text-gray-500 font-sans hidden sm:inline-block">- {req.userEmail}</span>
                       <span className={`px-2 py-0.5 text-[10px] font-oswald tracking-widest uppercase border rounded ${
                         req.status === 'pending' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                         req.status === 'approved' ? 'border-green-500 text-green-500 bg-green-500/10' :
                         'border-red-500 text-red-500 bg-red-500/10'
                       }`}>
                         {req.status === 'pending' ? 'En Attente' : req.status === 'approved' ? 'Approuvé' : 'Refusé'}
                       </span>
                     </div>
                     
                     <div className="flex flex-wrap items-center gap-4 text-sm font-sans text-gray-400 mt-3">
                       <span className="text-xs font-mono">
                         {new Date(req.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <div className="flex items-center gap-1.5 bg-black px-3 py-1 rounded border border-white/5">
                         <Calendar className="w-4 h-4 text-[#9300c4]" />
                         <span className="text-xs">
                           {conf.startDate ? new Date(conf.startDate).toLocaleDateString('fr-FR') : '?'} - {conf.endDate ? new Date(conf.endDate).toLocaleDateString('fr-FR') : '?'} ({conf.totalNights || 1} nuit{conf.totalNights > 1 && 's'})
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                     <div className="text-left md:text-right flex-1 md:flex-none">
                       <p className="font-oswald text-gray-500 text-xs tracking-widest uppercase mb-1">Montant Total</p>
                       <p className="font-oswald text-2xl text-white tracking-wider">${(conf.totalPrice || conf.nightlyPrice * (conf.totalNights || 1) || 0).toLocaleString()}</p>
                     </div>
                     <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/5 flex-shrink-0">
                       {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                     </button>
                   </div>
                 </div>

                 {/* Expanded Content with Admin actions & Configuration */}
                 <AnimatePresence>
                   {isExpanded && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden border-t border-white/5 bg-black relative z-10"
                     >
                       <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                          
                          {/* Col 1: Config list */}
                          <div className="md:col-span-1">
                            <h4 className="font-oswald text-xs tracking-widest uppercase text-[#9300c4] mb-4 pb-2 border-b border-white/10">Configuration Souhaitée</h4>
                            
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
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                               <p className="text-xs text-gray-400 flex justify-between">
                                 <span>Tarif par nuit calculé :</span>
                                 <span className="font-mono text-white">${conf.nightlyPrice?.toLocaleString()}</span>
                               </p>
                            </div>
                          </div>
                          
                          {/* Col 2: Images preview */}
                          <div className="md:col-span-1 flex flex-col">
                             <h4 className="font-oswald text-xs tracking-widest uppercase text-gray-500 mb-4 pb-2 border-b border-white/10">Aperçu Visuel</h4>
                             <div className="relative rounded overflow-hidden h-32 border border-white/10 shrink-0">
                                 <img src="https://static.wikia.nocookie.net/gtawiki/images/f/fe/MasterPenthouse-GTAO-Options-MasterPenthouse.png/revision/latest/scale-to-width-down/1000?cb=20210110105607" alt="Suite" className="w-full h-full object-cover" />
                             </div>
                             
                             {conf.addons?.length > 0 && (
                               <div className="flex flex-wrap gap-2 mt-2">
                                 {conf.addons.map((a: any) => {
                                    const imgMatch = a.images ? a.images[0] : a.image;
                                    return imgMatch ? (
                                      <div key={a.id} className="w-16 h-12 shrink-0 rounded overflow-hidden border border-white/10" title={a.name}>
                                        <img src={imgMatch} alt={a.name} className="w-full h-full object-cover" />
                                      </div>
                                    ) : null;
                                 })}
                               </div>
                             )}
                          </div>

                          {/* Col 3: Actions */}
                          <div className="md:col-span-1 flex flex-col md:border-l md:border-white/10 md:pl-6">
                            <h4 className="font-oswald text-xs tracking-widest uppercase text-gray-500 mb-4 pb-2 border-b border-white/10">Actions Administratives</h4>
                            
                            {userData.role === 'patron' ? (
                              <div className="flex flex-col gap-3">
                                {req.status === 'pending' && (
                                  <>
                                    <button onClick={(e) => approveRequest(req, e)} className="flex items-center gap-2 justify-center px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-oswald text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-colors rounded">
                                      <Check className="w-4 h-4" /> Approuver la Réservation
                                    </button>
                                    <button onClick={(e) => openRejectionModal(req.id, e)} className="flex items-center gap-2 justify-center px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-oswald text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors rounded">
                                      <X className="w-4 h-4" /> Refuser
                                    </button>
                                  </>
                                )}
                                {(req.status === 'approved' || req.status === 'rejected') && (
                                  <>
                                    {req.status === 'rejected' && req.rejectionReason && (
                                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-sans mb-2">
                                        <span className="font-bold">Motif de refus :</span> {req.rejectionReason}
                                      </div>
                                    )}
                                    <button onClick={(e) => revertToPending(req.id, e)} className="flex items-center gap-2 justify-center px-4 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-oswald text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-colors rounded">
                                      <Clock className="w-4 h-4" /> Remettre en attente
                                    </button>
                                  </>
                                )}
                                
                                <div className="mt-auto pt-4 border-t border-white/5">
                                  <button onClick={(e) => deleteRequest(req.id, e)} className="w-full flex items-center gap-2 justify-center px-4 py-2 mt-2 text-gray-500 font-oswald text-sm uppercase tracking-widest border border-white/5 hover:border-red-500/50 hover:text-red-500 transition-colors rounded">
                                    <Trash2 className="w-4 h-4" /> Supprimer Définitivement
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="px-4 py-3 rounded bg-white/5 text-gray-500 font-oswald text-sm uppercase tracking-widest text-center border border-white/5">
                                Accès Lecture Seule
                              </div>
                            )}
                          </div>

                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
               </div>
             );
           })}
         </div>
       )}

       {/* Rejection Modal */}
       <AnimatePresence>
         {rejectionModalOpen && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
           >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-[#050505] border border-red-500/30 p-8 w-full max-w-lg shadow-2xl relative"
             >
               <button onClick={() => setRejectionModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                 <X className="w-5 h-5" />
               </button>
               <h3 className="text-2xl font-oswald uppercase tracking-widest font-black text-red-500 mb-2">Refuser la réservation</h3>
               <p className="text-gray-400 text-sm font-sans mb-6">Veuillez indiquer le motif du refus. Celui-ci sera partagé au client.</p>
               
               <textarea 
                 value={rejectionReason}
                 onChange={(e) => setRejectionReason(e.target.value)}
                 placeholder="Ex: Les dates sont indisponibles, le client n'a pas les fonds..."
                 className="w-full bg-black border border-white/20 text-white p-4 font-sans text-sm focus:outline-none focus:border-red-500 transition-colors resize-none mb-6 h-32"
               />
               
               <div className="flex gap-4">
                 <button onClick={() => setRejectionModalOpen(false)} className="flex-1 py-3 text-white border border-white/20 font-oswald text-sm tracking-widest uppercase hover:bg-white/10 transition-colors">
                   Annuler
                 </button>
                 <button onClick={confirmRejection} className="flex-1 py-3 bg-red-500/20 text-red-500 font-bold border border-red-500/30 font-oswald text-sm tracking-widest uppercase hover:bg-red-500 hover:text-white transition-colors">
                   Confirmer le Refus
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </motion.div>
  );
}

