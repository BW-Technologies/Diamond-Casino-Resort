import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

export default function ProfileTab({
  userData,
  profilePhoto, setProfilePhoto,
  handleSaveProfilePhoto,
  profileSaveStatus
}: any) {
  return (
    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-8 border-l-4 border-[#9300c4] pl-4">MON PROFIL</h2>
       
       <div className="max-w-2xl border border-white/10 bg-black p-8 md:p-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#9300c4]/5 blur-3xl" />
         
         <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
            <div className="flex flex-col items-center gap-4 shrink-0">
               <div className="w-32 h-32 rounded-full border-2 border-white/20 overflow-hidden bg-zinc-900 relative group">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
                  ) : userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-oswald text-4xl">
                      {userData?.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                     <Camera className="w-8 h-8 text-white" />
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
               <div>
                 <p className="text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Identité Diamond</p>
                 <p className="font-oswald text-2xl text-white tracking-wider">{userData?.displayName}</p>
                 <p className="font-sans text-sm text-[#9300c4] uppercase mt-1">Accréditation: {userData?.role}</p>
                 {userData?.role === 'vip' && userData?.vipTier && (
                   <p className="font-sans text-sm text-yellow-500 uppercase mt-1">Niveau: {userData.vipTier}</p>
                 )}
               </div>

               <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">URL Photo de profil (Optionnel)</label>
                 <input type="text" value={profilePhoto} onChange={e => setProfilePhoto(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:outline-none focus:border-white transition-colors" />
               </div>

               <div className="pt-4 border-t border-white/10">
                 <button onClick={handleSaveProfilePhoto} className="border border-[#9300c4] bg-[#9300c4]/10 text-white font-oswald uppercase tracking-widest text-sm px-8 py-3 hover:bg-[#9300c4] transition-all duration-300">
                    METTRE À JOUR
                 </button>
                 {profileSaveStatus && <p className="mt-4 font-sans text-sm text-green-400">{profileSaveStatus}</p>}
               </div>
            </div>
         </div>
       </div>
    </motion.div>
  );
}
