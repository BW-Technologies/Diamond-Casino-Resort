import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getAssetUrl } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Check, X, Clock, Trash2, ChevronDown, ChevronUp, Calendar, Crown } from 'lucide-react';

export default function PenthouseRequestsTab({ userData }: { userData: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const statusConfig: Record<string, {label: string; color: string; bg: string; border: string}> = {
    pending: { label: 'En Attente', color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/20' },
    approved: { label: 'Approuvé', color: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
    rejected: { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-500/8', border: 'border-red-500/20' },
  };

  return (
    <motion.div key="penthouse-requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#9300c4]/10 border border-[#9300c4]/20 flex items-center justify-center">
          <Crown className="w-5 h-5 text-[#9300c4]" />
        </div>
        <div>
          <h2 className="text-2xl font-oswald uppercase tracking-widest font-black text-white">Demandes Penthouse</h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">{requests.length} demande{requests.length !== 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-white/5 bg-white/[0.01] rounded-xl">
          <Home className="w-12 h-12 text-gray-600 mb-4" />
          <p className="font-oswald text-gray-500 tracking-widest uppercase text-sm">Aucune demande pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            const sc = statusConfig[req.status] || statusConfig.pending;
            const isExpanded = expandedId === req.id;
            const config = req.configuration;
            const checkIn = config?.checkIn ? new Date(config.checkIn).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
            const checkOut = config?.checkOut ? new Date(config.checkOut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

            return (
              <div key={req.id} className="border border-white/6 bg-white/[0.015] rounded-xl overflow-hidden transition-all">
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  {/* Style thumbnail */}
                  {config?.style?.image && (
                    <img src={getAssetUrl(config.style.image)} alt="" className="w-14 h-10 rounded-md object-cover border border-white/6 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-oswald text-base text-white uppercase tracking-wider">{req.userName}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-oswald tracking-widest uppercase border rounded-full ${sc.color} ${sc.bg} ${sc.border}`}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-sans">
                      <span>{req.userEmail}</span>
                      {checkIn && checkOut && (
                        <>
                          <span className="text-white/10">·</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{checkIn} → {checkOut}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-oswald text-lg text-white tracking-wider">${(config?.totalPrice || config?.totalPerNight || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 font-sans uppercase">{config?.nights ? `${config.nights} nuits` : 'total'}</div>
                  </div>

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-2" />}
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5">
                        {/* Config images grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                          {config?.style?.image && (
                            <div className="relative rounded-lg overflow-hidden border border-white/6">
                              <img src={getAssetUrl(config.style.image)} alt={config.style.name} className="w-full aspect-video object-cover" />
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <div className="text-[10px] font-oswald uppercase tracking-wider text-[#9300c4]">Style</div>
                                <div className="text-xs font-oswald text-white uppercase">{config.style.name}</div>
                              </div>
                            </div>
                          )}
                          {config?.addons?.map((a: any, i: number) => a && (
                            <div key={i} className="relative rounded-lg overflow-hidden border border-white/6">
                              <img src={getAssetUrl(a.image)} alt={a.name} className="w-full aspect-video object-cover" />
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <div className="text-[10px] font-oswald uppercase tracking-wider text-amber-500">Option</div>
                                <div className="text-xs font-oswald text-white uppercase truncate">{a.name}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                            <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-2">Style Sélectionné</div>
                            <div className="font-sans text-sm text-gray-200">{config?.style?.name || '—'}</div>
                            {config?.style?.price > 0 && (
                              <div className="text-xs text-[#9300c4] mt-1 font-sans">+${config.style.price.toLocaleString()}/nuit</div>
                            )}
                          </div>
                          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                            <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-2">Modules Optionnels</div>
                            {config?.addons?.length > 0 ? (
                              <ul className="space-y-1">
                                {config.addons.map((a: any, i: number) => a && (
                                  <li key={i} className="font-sans text-sm text-gray-300 flex justify-between">
                                    <span>• {a.name}</span>
                                    <span className="text-[#9300c4] text-xs">+${(a.pricePerNight || a.price || 0).toLocaleString()}/nuit</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="font-sans text-sm text-gray-500">Aucun module.</p>
                            )}
                          </div>
                        </div>

                        {/* Date info */}
                        {checkIn && checkOut && (
                          <div className="bg-black/30 rounded-lg p-4 border border-white/5 mt-3 flex items-center gap-4">
                            <Calendar className="w-5 h-5 text-[#9300c4] shrink-0" />
                            <div>
                              <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-1">Séjour Prévu</div>
                              <div className="font-sans text-sm text-white">{checkIn} → {checkOut} ({config?.nights || '—'} nuit{(config?.nights || 0) > 1 ? 's' : ''})</div>
                            </div>
                            <div className="ml-auto text-right">
                              <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-1">Total</div>
                              <div className="font-oswald text-xl text-white">${(config?.totalPrice || 0).toLocaleString()}</div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {userData.role === 'patron' ? (
                            <>
                              {req.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus(req.id, 'approved')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 font-oswald text-xs uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                                    <Check className="w-3.5 h-3.5" /> Approuver
                                  </button>
                                  <button onClick={() => updateStatus(req.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-500/8 border border-red-500/20 text-red-400 font-oswald text-xs uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                    <X className="w-3.5 h-3.5" /> Refuser
                                  </button>
                                </>
                              )}
                              {(req.status === 'approved' || req.status === 'rejected') && (
                                <button onClick={() => updateStatus(req.id, 'pending')} className="flex items-center gap-2 px-4 py-2 bg-amber-500/8 border border-amber-500/20 text-amber-400 font-oswald text-xs uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-white transition-colors">
                                  <Clock className="w-3.5 h-3.5" /> Remettre en attente
                                </button>
                              )}
                              <button onClick={() => deleteRequest(req.id)} className="flex items-center gap-2 px-4 py-2 text-gray-500 font-oswald text-xs uppercase tracking-widest rounded-lg border border-transparent hover:border-red-500/30 hover:text-red-400 transition-colors ml-auto">
                                <Trash2 className="w-3.5 h-3.5" /> Supprimer
                              </button>
                            </>
                          ) : (
                            <div className="px-4 py-2 bg-white/3 text-gray-500 font-oswald text-xs uppercase tracking-widest rounded-lg border border-white/5">
                              Lecture Seule
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
    </motion.div>
  );
}
