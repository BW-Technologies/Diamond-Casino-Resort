import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function AccountingTab({
  transactions,
  expandedTxId, setExpandedTxId,
  getUserNameById,
  handleDeleteTransaction,
  handleWeeklyClose,
  handleAddTransaction,
  accType, setAccType,
  accNature, setAccNature,
  accCategory, setAccCategory,
  accAmount, setAccAmount,
  accAssocExpense, setAccAssocExpense,
  accMemberId, setAccMemberId,
  usersList,
  totalCA, totalDepenses, benefice
}: any) {
  return (
    <motion.div key="accounting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <div className="flex justify-between items-center mb-8 border-l-4 border-[#9300c4] pl-4">
         <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white">COMPTABILITÉ HEBDOMADAIRE</h2>
         <button onClick={handleWeeklyClose} className="border border-white/20 bg-white hover:bg-transparent text-black hover:text-white px-6 py-2 font-oswald text-sm tracking-widest uppercase transition-all">
           Clôturer Semaine
         </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="border border-white/10 bg-black p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl" />
           <p className="text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-2">Chiffre d'affaires</p>
           <p className="text-3xl font-oswald font-bold text-green-400 tracking-wider">${totalCA.toLocaleString()}</p>
         </div>
         <div className="border border-white/10 bg-black p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl" />
           <p className="text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-2">Dépenses & Frais</p>
           <p className="text-3xl font-oswald font-bold text-red-500 tracking-wider">${totalDepenses.toLocaleString()}</p>
         </div>
         <div className="border border-white/10 bg-[#9300c4]/10 p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#9300c4]/20 blur-3xl" />
           <p className="text-[10px] font-oswald text-fuchsia-300 tracking-[0.2em] uppercase mb-2">Bénéfice Net</p>
           <p className="text-3xl font-oswald font-bold text-white tracking-wider">${benefice.toLocaleString()}</p>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2">
           <div className="w-full overflow-x-auto border border-white/10 bg-black">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Type</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Détails</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Montant</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.map((t: any) => (
                   <React.Fragment key={t.id}>
                     <tr onClick={() => setExpandedTxId(expandedTxId === t.id ? null : t.id)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                       <td className="p-4">
                         <span className={`px-2 py-1 text-[10px] font-oswald tracking-widest uppercase border ${
                           t.type === 'recette' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'
                         }`}>
                           {t.type}
                         </span>
                       </td>
                       <td className="p-4">
                         <p className="font-sans text-gray-200">{t.nature}</p>
                         <p className="font-sans text-gray-500 text-xs mt-1">{t.category}</p>
                       </td>
                       <td className="p-4">
                         <p className={`font-oswald font-bold tracking-wider ${t.type === 'recette' ? 'text-green-400' : 'text-red-400'}`}>
                           {t.type === 'recette' ? '+' : '-'}${t.amount.toLocaleString()}
                         </p>
                         {t.associatedExpense && (
                           <p className="font-sans text-red-500 text-[10px] mt-1 pr-4">Frais liés: -${t.associatedExpense.toLocaleString()}</p>
                         )}
                       </td>
                       <td className="p-4 text-right flex items-center justify-end gap-3 text-red-500 hover:text-red-400 transition-colors">
                          {expandedTxId === t.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />}
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteTransaction(t.id); }} className="p-2 border border-white/10 hover:border-red-500/40">
                            <X className="w-4 h-4" />
                          </button>
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
                 {transactions.length === 0 && (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-sans">Aucune transaction cette semaine.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>

         <div className="xl:col-span-1">
           <div className="border border-white/20 bg-[#0a0a0a] p-8 sticky top-0">
             <h3 className="text-lg font-oswald uppercase tracking-widest font-black text-white mb-6">SAISIR TRANSACTION</h3>

             <form onSubmit={handleAddTransaction} className="space-y-4">
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Type d'opération</label>
                 <select value={accType} onChange={e => setAccType(e.target.value as any)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors appearance-none">
                   <option value="recette">Recette (Entrée)</option>
                   <option value="depense">Dépense (Sortie)</option>
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Nature / Nom</label>
                 <input required type="text" value={accNature} onChange={e => setAccNature(e.target.value)} placeholder="Ex: Vente Penthouse, Salaire..." className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Catégorie</label>
                 <input required type="text" value={accCategory} onChange={e => setAccCategory(e.target.value)} placeholder="Ex: Immobilier, Salaire, Restauration..." className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Montant ($)</label>
                 <input required type="number" step="0.01" value={accAmount} onChange={e => setAccAmount(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               {accType === 'recette' && (
                 <>
                   <div>
                     <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Dépense associée (Optionnel)</label>
                     <input type="number" step="0.01" value={accAssocExpense} onChange={e => setAccAssocExpense(e.target.value)} placeholder="Ex: Frais de transaction" className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Membre impliqué (Optionnel)</label>
                     <select value={accMemberId} onChange={e => setAccMemberId(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors appearance-none">
                       <option value="">-- Aucun --</option>
                       {usersList.map((u: any) => (
                         <option key={u.uid} value={u.uid}>{u.displayName} ({u.role})</option>
                       ))}
                     </select>
                   </div>
                 </>
               )}
               
               <button type="submit" className="w-full border border-[#9300c4] bg-[#9300c4]/10 text-white font-oswald uppercase tracking-widest text-sm py-3 mt-4 hover:bg-[#9300c4] transition-all duration-300">
                 ENREGISTRER
               </button>
             </form>
           </div>
         </div>
       </div>
    </motion.div>
  );
}
