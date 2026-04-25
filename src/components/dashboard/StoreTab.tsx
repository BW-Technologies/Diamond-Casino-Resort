import React from 'react';
import { motion } from 'motion/react';
import { Edit2, X } from 'lucide-react';

export default function StoreTab({
  storeItems,
  storeName, setStoreName,
  storePrice, setStorePrice,
  storeImageUrl, setStoreImageUrl,
  storeDesc, setStoreDesc,
  storeEditingId, setStoreEditingId,
  handleSaveStoreItem,
  handleEditStoreItem,
  handleDeleteStoreItem
}: any) {
  return (
    <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-fuchsia-500 pl-4">GESTION DE LA BOUTIQUE</h2>
       
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2">
           <div className="w-full overflow-x-auto border border-white/10 bg-black">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Aperçu</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Nom / Description</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Prix</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {storeItems.map((item: any) => (
                   <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="p-4">
                       <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover border border-white/20" />
                     </td>
                     <td className="p-4 max-w-xs">
                       <p className="font-oswald text-gray-200 uppercase tracking-wide truncate">{item.name}</p>
                       <p className="font-sans text-gray-500 text-xs mt-1 truncate" title={item.desc}>{item.desc}</p>
                     </td>
                     <td className="p-4">
                       <span className="font-sans text-fuchsia-400 bg-white/5 py-1 px-2 rounded text-sm whitespace-nowrap">{item.price}</span>
                     </td>
                     <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEditStoreItem(item)} className="p-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/40 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteStoreItem(item.id)} className="p-2 border border-white/10 text-red-500 hover:text-red-400 hover:border-red-500/40 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {storeItems.length === 0 && (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-sans">Aucun article dans la boutique.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>

         <div className="xl:col-span-1">
           <div className="border border-white/20 bg-[#0a0a0a] p-8 sticky top-0">
             <h3 className="text-lg font-oswald uppercase tracking-widest font-black text-white mb-6">
               {storeEditingId ? 'MODIFIER ARTICLE' : 'NOUVEL ARTICLE'}
             </h3>

             <form onSubmit={handleSaveStoreItem} className="space-y-4">
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Nom de l'article</label>
                 <input required type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Prix affiché (ex: 15,000 Jetons)</label>
                 <input required type="text" value={storePrice} onChange={e => setStorePrice(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">URL de l'image</label>
                 <input required type="text" value={storeImageUrl} onChange={e => setStoreImageUrl(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>
               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Description</label>
                 <textarea required rows={3} value={storeDesc} onChange={e => setStoreDesc(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors resize-none"></textarea>
               </div>
               
               <div className="flex gap-2 mt-4">
                 {storeEditingId && (
                   <button type="button" onClick={() => { setStoreEditingId(null); setStoreName(''); setStorePrice(''); setStoreImageUrl(''); setStoreDesc(''); }} className="flex-1 border border-white/20 bg-transparent text-white font-oswald uppercase tracking-widest text-sm py-3 hover:bg-white/5 transition-all duration-300">
                     ANNULER
                   </button>
                 )}
                 <button type="submit" className="flex-[2] border border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 font-oswald uppercase tracking-widest text-sm py-3 hover:bg-fuchsia-500 hover:text-white transition-all duration-300">
                   {storeEditingId ? 'SAUVEGARDER' : 'AJOUTER'}
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
    </motion.div>
  );
}
