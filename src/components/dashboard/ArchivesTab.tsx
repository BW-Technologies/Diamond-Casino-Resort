import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ArchivesTab({
  archives,
  expandedTxId, setExpandedTxId,
  getUserNameById,
  archTotalCA, archTotalDep, archBenefice
}: any) {
  return (
    <motion.div key="archives" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-gray-500 pl-4">ARCHIVES COMPTABLES</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 opacity-80">
         <div className="border border-white/10 bg-black p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 blur-3xl" />
           <p className="text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-2">Total Recettes Historiques</p>
           <p className="text-3xl font-oswald font-bold text-gray-300 tracking-wider">${archTotalCA.toLocaleString()}</p>
         </div>
         <div className="border border-white/10 bg-black p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 blur-3xl" />
           <p className="text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-2">Total Dépenses Historiques</p>
           <p className="text-3xl font-oswald font-bold text-gray-400 tracking-wider">${archTotalDep.toLocaleString()}</p>
         </div>
         <div className="border border-white/10 bg-white/5 p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl" />
           <p className="text-[10px] font-oswald text-gray-400 tracking-[0.2em] uppercase mb-2">Bénéfice Net Global</p>
           <p className="text-3xl font-oswald font-bold text-white tracking-wider">${archBenefice.toLocaleString()}</p>
         </div>
       </div>

       <div className="w-full overflow-x-auto border border-white/10 bg-black">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-white/10 bg-white/5">
               <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Date (Semaine clôturée)</th>
               <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Type</th>
               <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Détails</th>
               <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Montant</th>
             </tr>
           </thead>
           <tbody>
             {archives.map((t: any) => (
               <React.Fragment key={t.id}>
                 <tr onClick={() => setExpandedTxId(expandedTxId === t.id ? null : t.id)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                   <td className="p-4 font-sans text-gray-500 text-sm flex items-center gap-3">
                     {expandedTxId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:text-white" />}
                     {new Date(t.createdAt).toLocaleDateString()}
                   </td>
                   <td className="p-4">
                     <span className={`px-2 py-1 text-[10px] font-oswald tracking-widest uppercase border ${
                       t.type === 'recette' ? 'border-gray-500 text-gray-400 bg-white/5' : 'border-gray-600 text-gray-500 bg-white/5'
                     }`}>
                       {t.type}
                     </span>
                   </td>
                   <td className="p-4">
                     <p className="font-sans text-gray-400">{t.nature}</p>
                     <p className="font-sans text-gray-600 text-xs mt-1">{t.category}</p>
                   </td>
                   <td className="p-4">
                     <p className="font-oswald font-bold tracking-wider text-gray-300">
                       {t.type === 'recette' ? '+' : '-'}${t.amount.toLocaleString()}
                     </p>
                     {t.associatedExpense && (
                       <p className="font-sans text-gray-600 text-[10px] mt-1 pr-4">Frais liés: -${t.associatedExpense.toLocaleString()}</p>
                     )}
                   </td>
                 </tr>
                 {expandedTxId === t.id && (
                   <tr className="bg-white/5 border-b border-white/10">
                     <td colSpan={4} className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           <div>
                             <p className="text-[10px] font-oswald text-gray-500 tracking-widest uppercase mb-1">Date exacte</p>
                             <p className="font-sans text-sm text-gray-300">{new Date(t.createdAt).toLocaleString()}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-oswald text-gray-500 tracking-widest uppercase mb-1">Membre impliqué</p>
                             <p className="font-sans text-sm text-fuchsia-400">{t.associatedMemberId ? getUserNameById(t.associatedMemberId) : 'N/A'}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-oswald text-gray-500 tracking-widest uppercase mb-1">ID Transaction</p>
                             <p className="font-sans text-xs text-gray-500 font-mono">{t.id}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-oswald text-gray-500 tracking-widest uppercase mb-1">Statut d'archive</p>
                             <p className="font-sans text-sm text-gray-300">{t.archived ? 'Archivé' : 'Semaine en cours'}</p>
                           </div>
                        </div>
                     </td>
                   </tr>
                 )}
               </React.Fragment>
             ))}
             {archives.length === 0 && (
               <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-sans">Aucune archive disponible.</td></tr>
             )}
           </tbody>
         </table>
       </div>
    </motion.div>
  );
}
