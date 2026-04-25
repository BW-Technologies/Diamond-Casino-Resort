import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getAssetUrl } from '../../lib/utils';
import { Home, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

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

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-5 h-5 text-amber-400" />,
    approved: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    rejected: <XCircle className="w-5 h-5 text-red-400" />,
  };

  const statusLabels: Record<string, string> = {
    pending: "En Cours d'Analyse",
    approved: "Réservation Validée",
    rejected: "Demande Refusée",
  };

  const statusColors: Record<string, string> = {
    pending: 'border-amber-500/20 bg-amber-500/5',
    approved: 'border-emerald-500/20 bg-emerald-500/5',
    rejected: 'border-red-500/20 bg-red-500/5',
  };

  return (
    <motion.div key="my-penthouse-req" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Home className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-oswald uppercase tracking-widest font-black text-white">Ma Demande Penthouse</h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">Suivez l'état de votre réservation</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {requests.map((req) => {
          const config = req.configuration;
          const checkIn = config?.checkIn ? new Date(config.checkIn).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;
          const checkOut = config?.checkOut ? new Date(config.checkOut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

          return (
            <div key={req.id} className={`border rounded-xl overflow-hidden ${statusColors[req.status] || statusColors.pending}`}>
              {/* Status banner */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                {statusIcons[req.status]}
                <span className="font-oswald text-sm text-white uppercase tracking-widest">{statusLabels[req.status]}</span>
                <span className="text-xs text-gray-500 font-sans ml-auto">
                  {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="p-5">
                {/* Images of selected options */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
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
                        <div className="text-[10px] font-oswald uppercase tracking-wider text-amber-400">Option</div>
                        <div className="text-xs font-oswald text-white uppercase truncate">{a.name}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-2">Style Sélectionné</div>
                    <div className="font-sans text-sm text-gray-200">{config?.style?.name || '—'}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-2">Modules Optionnels</div>
                    {config?.addons?.length > 0 ? (
                      <ul className="space-y-1">
                        {config.addons.map((a: any, i: number) => a && (
                          <li key={i} className="font-sans text-sm text-gray-300">• {a.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-sans text-sm text-gray-500">Aucun</p>
                    )}
                  </div>
                </div>

                {/* Dates & total */}
                {checkIn && checkOut && (
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5 flex items-center gap-4 mb-4">
                    <Calendar className="w-5 h-5 text-[#9300c4] shrink-0" />
                    <div className="flex-1">
                      <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase mb-1">Séjour</div>
                      <div className="font-sans text-sm text-white">{checkIn} → {checkOut} ({config?.nights || '—'} nuit{(config?.nights || 0) > 1 ? 's' : ''})</div>
                    </div>
                  </div>
                )}

                <div className="bg-black/30 rounded-lg p-5 border border-[#9300c4]/15">
                  <div className="flex justify-between items-end">
                    <div>
                      {config?.totalPerNight && (
                        <div className="font-sans text-xs text-gray-400 mb-1">${config.totalPerNight.toLocaleString()}/nuit × {config?.nights || 1} nuits</div>
                      )}
                      <div className="font-oswald text-gray-500 text-[10px] tracking-widest uppercase">Total Estimé</div>
                    </div>
                    <div className="font-oswald text-3xl text-white tracking-wider">${(config?.totalPrice || 0).toLocaleString()}</div>
                  </div>
                </div>

                {/* Status message */}
                <div className="mt-4">
                  {req.status === 'pending' && (
                    <p className="text-xs font-sans text-amber-500/70 leading-relaxed">
                      Un membre de la direction finalise l'étude de votre dossier. Une réponse vous sera apportée sous peu.
                    </p>
                  )}
                  {req.status === 'approved' && (
                    <p className="text-xs font-sans text-emerald-400/70 leading-relaxed">
                      Félicitations ! Votre réservation est validée. Coordonnez votre aménagement avec la conciergerie.
                    </p>
                  )}
                  {req.status === 'rejected' && (
                    <p className="text-xs font-sans text-red-500/70 leading-relaxed">
                      Votre demande a été déclinée. Contactez la direction pour plus d'informations.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
