import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCircle, Edit2, Ban, Trash2 } from 'lucide-react';

export default function DirectoryTab({ 
  userData, 
  usersList, 
  openEditUser, 
  handleRevokeUser,
  handleDeleteUser,
  handleCreateUser,
  createName, setCreateName,
  createEmail, setCreateEmail,
  createPassword, setCreatePassword,
  createRole, setCreateRole,
  createVipTier, setCreateVipTier,
  createStatus, createLoading
}: any) {
  return (
    <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-[#9300c4] pl-4">RÉPERTOIRE DIAMOND</h2>
       
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2">
           <div className="w-full overflow-x-auto border border-white/10 bg-black">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Identité</th>
                   <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal">Rôle</th>
                   {userData.role === 'patron' && <th className="p-4 font-oswald text-xs uppercase tracking-widest text-gray-400 font-normal text-right">Actions</th>}
                 </tr>
               </thead>
               <tbody>
                 {usersList.map((usr: any) => (
                   <tr key={usr.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="p-4 flex items-center gap-4">
                       {usr.photoURL ? (
                         <img src={usr.photoURL} alt="" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                       ) : (
                         <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                           <UserCircle className="w-5 h-5 text-gray-500" />
                         </div>
                       )}
                       <div>
                         <p className="font-sans text-gray-200">{usr.displayName}</p>
                         <p className="font-sans text-gray-500 text-xs mt-1">{usr.email}</p>
                       </div>
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-1 text-[10px] font-oswald tracking-widest uppercase border ${
                         usr.role === 'patron' ? 'border-[#9300c4] text-[#9300c4] bg-[#9300c4]/10' :
                         usr.role === 'vip' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                         usr.role === 'employe' ? 'border-blue-500 text-blue-500 bg-blue-500/10' :
                         usr.role === 'banni' ? 'border-red-500 text-red-500 bg-red-500/10' :
                         'border-gray-500 text-gray-500 bg-gray-500/10'
                       }`}>
                         {usr.role} {usr.role === 'vip' && usr.vipTier ? `(${usr.vipTier})` : ''}
                       </span>
                     </td>
                     {userData.role === 'patron' && (
                       <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-3">
                            <button onClick={(e) => { e.stopPropagation(); openEditUser(usr); }} className="p-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/40 transition-all" title="Éditer">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {usr.role !== 'banni' && usr.uid !== userData.uid && (
                              <button onClick={(e) => { e.stopPropagation(); handleRevokeUser(usr); }} className="p-2 border border-white/10 text-red-500 hover:text-red-400 hover:border-red-500/40 transition-all" title="Bannir">
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            {usr.uid !== userData.uid && (
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(usr); }} className="p-2 border border-white/10 text-red-500/50 hover:text-red-500 hover:border-red-500/40 transition-all" title="Supprimer Definitvement">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                         </div>
                       </td>
                     )}
                   </tr>
                 ))}
                 {usersList.length === 0 && (
                   <tr><td colSpan={userData.role === 'patron' ? 3 : 2} className="p-8 text-center text-gray-500 font-sans">Aucun enregistrement.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>

         {userData.role === 'patron' && (
           <div className="xl:col-span-1">
             <div className="border border-white/20 bg-[#0a0a0a] p-8 sticky top-0">
               <h3 className="text-lg font-oswald uppercase tracking-widest font-black text-white mb-4">CRÉER COMPTE</h3>
               <p className="font-sans text-xs text-gray-400 mb-6 font-light">Enregistrez de nouvelles accréditations dans le réseau.</p>

               <form onSubmit={handleCreateUser} className="space-y-4">
                 <div>
                   <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Nom Complet</label>
                   <input required type="text" value={createName} onChange={e => setCreateName(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Email</label>
                   <input required type="email" value={createEmail} onChange={e => setCreateEmail(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Mot De Passe</label>
                   <input required type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Rôle</label>
                   <select value={createRole} onChange={e => setCreateRole(e.target.value as any)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors appearance-none">
                     <option value="client">Client Standard</option>
                     <option value="vip">Client VIP</option>
                     <option value="employe">Employé (Accès Exécutif)</option>
                   </select>
                 </div>
                 {createRole === 'vip' && (
                   <div>
                     <label className="block text-[10px] font-oswald text-amber-500 tracking-[0.2em] uppercase mb-1">Abonnement VIP</label>
                     <select value={createVipTier} onChange={e => setCreateVipTier(e.target.value as any)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors appearance-none">
                       <option value="silver">Silver</option>
                       <option value="gold">Gold</option>
                       <option value="diamond">Diamond</option>
                     </select>
                   </div>
                 )}
                 {createStatus && (
                   <div className={`p-3 border text-xs font-sans mt-4 ${createStatus.type === 'success' ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                     {createStatus.msg}
                   </div>
                 )}
                 <button type="submit" disabled={createLoading} className="w-full border border-white bg-white text-black font-oswald uppercase tracking-widest text-sm py-3 mt-4 hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50">
                   {createLoading ? 'CRÉATION...' : 'GÉNÉRER'}
                 </button>
               </form>
             </div>
           </div>
         )}
       </div>
    </motion.div>
  );
}
