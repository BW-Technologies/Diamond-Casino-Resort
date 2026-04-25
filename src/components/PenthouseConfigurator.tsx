import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { Check, X, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

const STYLES = [
  { id: 'sharp', name: 'Sharp (Épuré)', pricePerNight: 0, image: 'https://static.wikia.nocookie.net/gtawiki/images/a/a8/MasterPenthouse-GTAO-Colours-Sharp.png/revision/latest/scale-to-width-down/200?cb=20200421194804' },
  { id: 'timeless', name: 'Timeless (Intemporel)', pricePerNight: 2000, image: 'https://static.wikia.nocookie.net/gtawiki/images/1/1b/MasterPenthouse-GTAO-Colours-Timeless.png/revision/latest/scale-to-width-down/200?cb=20200421194804' },
  { id: 'vibrant', name: 'Vibrant (Vibrant)', pricePerNight: 5000, image: 'https://static.wikia.nocookie.net/gtawiki/images/2/2c/MasterPenthouse-GTAO-Colours-Vibrant.png/revision/latest/scale-to-width-down/200?cb=20191102110145' }
];

const ADDONS = [
  { id: 'lounge', name: 'Espace Lounge & Arcade', pricePerNight: 10000, desc: 'Bornes d\'arcade, bar complet et espace de vie.', images: ['https://static.wikia.nocookie.net/gtawiki/images/f/f4/MasterPenthouse-GTAO-Options-LoungeArea.png/revision/latest/scale-to-width-down/1000?cb=20210110105627', 'https://static.wikia.nocookie.net/gtawiki/images/e/eb/MasterPenthouse-GTAO-Options-BarandPartyHub.png/revision/latest/scale-to-width-down/1000?cb=20210110105827'] },
  { id: 'media', name: 'Salle de Médias', pricePerNight: 8000, desc: 'Cinéma privé avec écran géant incurvé.', images: ['https://static.wikia.nocookie.net/gtawiki/images/0/0a/MasterPenthouse-GTAO-Options-MediaRoom.png/revision/latest/scale-to-width-down/1000?cb=20210110105647'] },
  { id: 'spa', name: 'Spa Privé', pricePerNight: 15000, desc: 'Jacuzzi avec vue, sauna et thérapeutes.', images: ['https://static.wikia.nocookie.net/gtawiki/images/c/c8/MasterPenthouse-GTAO-Options-Spa.png/revision/latest/scale-to-width-down/1000?cb=20210110105715'] },
  { id: 'croupier', name: 'Croupier Privé', pricePerNight: 20000, desc: 'Table de Blackjack/Poker 24h/24.', images: ['https://static.wikia.nocookie.net/gtawiki/images/1/1e/MasterPenthouse-GTAO-Options-PrivateDealer.png/revision/latest/scale-to-width-down/1000?cb=20210110105845'] },
  { id: 'office', name: 'Bureau Sécurisé', pricePerNight: 5000, desc: 'Accès SecuroServ, coffre-fort mural et armurerie.', images: ['https://static.wikia.nocookie.net/gtawiki/images/a/a7/MasterPenthouse-GTAO-Options-Office.png/revision/latest/scale-to-width-down/1000?cb=20210110105902'] },
  { id: 'guest', name: 'Suite d\'invités', pricePerNight: 10000, desc: 'Chambre séparée avec salle de bain en marbre.', images: ['https://static.wikia.nocookie.net/gtawiki/images/3/3f/MasterPenthouse-GTAO-Options-ExtraBedroom.png/revision/latest/scale-to-width-down/1000?cb=20210110105920'] },
  { id: 'garage', name: 'Garage Privé', pricePerNight: 5000, desc: '10 places de parking avec service voiturier.', images: ['https://static.wikia.nocookie.net/gtawiki/images/9/96/MasterPenthouse-GTAO-Options-Garage.png/revision/latest/scale-to-width-down/1000?cb=20210110105936'] }
];

export default function PenthouseConfigurator({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [baseNightlyRate, setBaseNightlyRate] = useState<number>(50000); // Int number for math
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [status, setStatus] = useState<{type: 'idle' | 'loading' | 'success' | 'error', msg: string}>({ type: 'idle', msg: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const memDoc = await getDoc(doc(db, 'settings', 'membership'));
        if (memDoc.exists() && memDoc.data().penthouseNight) {
          // parse string like "$50,000" to number
          const numStr = memDoc.data().penthouseNight.replace(/[^0-9]/g, '');
          if (numStr) setBaseNightlyRate(parseInt(numStr, 10));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    });
    return () => unsub();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setSelectedStyle(STYLES[0]);
      setSelectedAddons([]);
      setStartDate('');
      setEndDate('');
      setStatus({ type: 'idle', msg: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const addonsNightlyTotal = selectedAddons.reduce((acc, currentId) => {
    const addon = ADDONS.find(a => a.id === currentId);
    return acc + (addon ? addon.pricePerNight : 0);
  }, 0);
  
  const totalNightlyPrice = baseNightlyRate + selectedStyle.pricePerNight + addonsNightlyTotal;

  const calculateNights = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = (e.getTime() - s.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalStayPrice = totalNightlyPrice * nights;

  const menuSteps = [
    { title: "SUITE DE MAÎTRE", type: 'intro' },
    { title: "DATES DU SÉJOUR", type: 'dates' },
    { title: "STYLE ET DÉCORATION", type: 'style' },
    ...ADDONS.map(a => ({ title: a.name.toUpperCase(), type: 'addon', addonId: a.id })),
    { title: "RÉSUMÉ", type: 'summary' }
  ];

  const handleSubmit = async () => {
    if (!user || !userData) {
      setStatus({ type: 'error', msg: 'Vous devez être connecté.' });
      return;
    }
    if (userData.role !== 'vip' && userData.role !== 'patron' && userData.role !== 'employe' && !userData.isVip) {
      setStatus({ type: 'error', msg: 'Seuls les membres VIP (Gold, Diamond) peuvent configurer et demander un Penthouse.' });
      return;
    }
    if (!startDate || !endDate) {
      setStatus({ type: 'error', msg: 'Veuillez sélectionner vos dates de séjour.' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Envoi de votre réservation...' });
    try {
      const configuration = {
        style: selectedStyle,
        addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)),
        nightlyPrice: totalNightlyPrice,
        totalPrice: totalStayPrice, // We store total price
        startDate,
        endDate,
        nights
      };

      await addDoc(collection(db, 'penthouseRequests'), {
        userId: user.uid,
        userName: userData.displayName || 'Utilisateur inconnu',
        userEmail: user.email,
        configuration,
        status: 'pending',
        createdAt: Date.now()
      });
      
      setStatus({ type: 'success', msg: 'Demande envoyée ! Vous pouvez suivre son statut dans votre Espace VIP.' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Une erreur est survenue lors de l\'envoi.' });
    }
  };

  const renderStepContent = () => {
    const stepDef = menuSteps[activeStep];
    
    if (stepDef.type === 'intro') {
      return (
        <motion.div key="intro" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="flex flex-col h-full bg-black relative p-8 md:p-16 overflow-y-auto w-full">
           <div className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none">
             <img src="https://static.wikia.nocookie.net/gtawiki/images/f/fe/MasterPenthouse-GTAO-Options-MasterPenthouse.png/revision/latest/scale-to-width-down/1000?cb=20210110105607" alt="bg" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
           </div>
           
           <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-center min-h-full">
             <div className="mb-4 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-[#9300c4]"></div>
                <span className="font-oswald text-[#9300c4] uppercase tracking-[0.3em] text-sm">Bienvenue au sommet</span>
             </div>
             <h2 className="font-oswald text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-8">
               PENTHOUSE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9300c4] to-amber-500">DE MAÎTRE</span>
             </h2>
             
             <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 border border-white/10 shadow-2xl relative">
                <img src="https://static.wikia.nocookie.net/gtawiki/images/f/fe/MasterPenthouse-GTAO-Options-MasterPenthouse.png/revision/latest/scale-to-width-down/1000?cb=20210110105607" alt="Intro" className="w-full h-full object-cover" />
             </div>
             
             <p className="font-sans text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl font-light">
               Concevez l'espace le plus exclusif de Los Santos au gré de vos envies. Du mobilier aux espaces récréatifs, chaque détail a été pensé pour offrir un standard de luxe inégalé.
             </p>
             
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl inline-block max-w-sm">
                <p className="font-oswald text-sm text-gray-400 uppercase tracking-widest mb-1">Prix de location de base (Par Nuit)</p>
                <p className="font-oswald text-4xl text-white tracking-widest">${baseNightlyRate.toLocaleString()}</p>
             </div>
           </div>
        </motion.div>
      );
    }

    if (stepDef.type === 'dates') {
      return (
        <motion.div key="dates" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="flex flex-col h-full bg-black relative p-8 md:p-16 overflow-y-auto w-full">
           <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col justify-center min-h-full">
             <div className="mb-4 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-amber-500"></div>
                <span className="font-oswald text-amber-500 uppercase tracking-[0.3em] text-sm">Disponibilités</span>
             </div>
             <h2 className="font-oswald text-5xl font-black uppercase tracking-tight text-white mb-12">
               DATES DU <span className="text-[#9300c4]">SÉJOUR</span>
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                 <label className="block font-oswald text-gray-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Date d'arrivée</label>
                 <input 
                   type="date" 
                   value={startDate} 
                   onChange={(e) => setStartDate(e.target.value)}
                   className="w-full bg-black/50 border border-white/20 text-white p-4 font-sans focus:border-[#9300c4] outline-none rounded-lg" 
                   min={new Date().toISOString().split('T')[0]}
                 />
               </div>
               <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                 <label className="block font-oswald text-gray-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Date de départ</label>
                 <input 
                   type="date" 
                   value={endDate} 
                   onChange={(e) => setEndDate(e.target.value)}
                   className="w-full bg-black/50 border border-white/20 text-white p-4 font-sans focus:border-[#9300c4] outline-none rounded-lg" 
                   min={startDate || new Date().toISOString().split('T')[0]}
                 />
               </div>
             </div>

             {startDate && endDate && (
               <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-12 text-center bg-[#9300c4]/10 border border-[#9300c4]/30 p-8 rounded-xl inline-block mx-auto">
                 <p className="font-oswald text-amber-500 uppercase tracking-widest text-xl">Durée du séjour</p>
                 <p className="font-oswald text-white text-5xl font-black mt-2">{nights} Nuit{nights > 1 ? 's' : ''}</p>
               </motion.div>
             )}
           </div>
        </motion.div>
      );
    }
    
    if (stepDef.type === 'style') {
      return (
        <motion.div key="style" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="flex flex-col h-full bg-black relative p-8 md:p-16 overflow-y-auto w-full">
          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <h2 className="font-oswald text-5xl font-black uppercase tracking-tight text-white mb-4">
              CHOISISSEZ VOTRE <span className="text-[#9300c4]">STYLE</span>
            </h2>
            <p className="font-sans text-gray-400 mb-12 max-w-2xl text-lg">La couleur est la clé de voûte de toute décoration d'intérieur. Sélectionnez la palette qui reflète au mieux votre personnalité.</p>
            
            <div className="flex flex-col gap-6">
              {STYLES.map(style => (
                <div 
                  key={style.id} 
                  onClick={() => setSelectedStyle(style)}
                  className={`group relative cursor-pointer border-2 transition-all rounded-xl overflow-hidden bg-black flex flex-col md:flex-row ${selectedStyle.id === style.id ? 'border-[#9300c4] ring-4 ring-[#9300c4]/20' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="md:w-1/3 flex items-center justify-center p-8 bg-black/40 backdrop-blur-md z-10 border-b md:border-b-0 md:border-r border-white/10">
                    <div className="text-center md:text-left w-full">
                      <p className="font-oswald tracking-widest uppercase text-3xl font-black text-white mb-2 group-hover:text-[#9300c4] transition-colors">{style.name}</p>
                      <p className="font-oswald text-lg text-amber-500 tracking-widest">{style.pricePerNight === 0 ? 'Gratuit' : `+$${style.pricePerNight.toLocaleString()} / Nuit`}</p>
                    </div>
                  </div>
                  <div className="md:w-2/3 h-32 md:h-48 relative overflow-hidden flex items-center justify-center bg-[#111]">
                     {/* Scale up to fit nicely without stretching weirdly, object-cover takes care of it */}
                    <img src={style.image} alt={style.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  
                  {selectedStyle.id === style.id && (
                    <div className="absolute top-4 left-4 md:top-1/2 md:-translate-y-1/2 md:right-auto md:left-4 z-20 bg-[#9300c4] text-white p-2 rounded-full shadow-[0_0_20px_rgba(147,0,196,0.5)]">
                      <Check className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (stepDef.type === 'addon') {
      const addon = ADDONS.find(a => a.id === stepDef.addonId)!;
      const isSelected = selectedAddons.includes(addon.id);
      return (
        <motion.div key={addon.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="flex flex-col h-full bg-black relative p-8 md:p-16 overflow-y-auto w-full">
           <div className="relative z-10 max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
             <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="md:w-1/2 w-full">
                 <div className="mb-4 flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-[#9300c4]"></div>
                    <span className="font-oswald text-[#9300c4] uppercase tracking-[0.3em] text-sm">Aménagement Optionnel</span>
                 </div>
                 <h2 className="font-oswald text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none">
                   {addon.name}
                 </h2>
                 <p className="font-sans text-gray-300 text-xl leading-relaxed mb-8 font-light">{addon.desc}</p>
                 
                 <div className="bg-white/5 border border-white/10 p-6 rounded-xl inline-block mb-12 backdrop-blur-sm">
                   <p className="font-oswald text-amber-500 text-sm tracking-widest uppercase mb-1">Supplément journalier</p>
                   <p className="font-oswald text-4xl text-white tracking-widest">+$${addon.pricePerNight.toLocaleString()} <span className="text-xl text-gray-500">/ NUIT</span></p>
                 </div>
                 
                 <div>
                   <button 
                     onClick={() => toggleAddon(addon.id)}
                     className={`w-full md:w-auto px-10 py-5 rounded-lg border-2 font-oswald text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl ${isSelected ? 'border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'border-[#9300c4] bg-[#9300c4]/10 text-white hover:bg-[#9300c4] hover:shadow-[0_0_30px_rgba(147,0,196,0.6)]'}`}
                   >
                     {isSelected ? <><X className="w-6 h-6" /> RETIRER L'OPTION</> : <><Check className="w-6 h-6" /> SÉLECTIONNER L'OPTION</>}
                   </button>
                 </div>
               </div>
               
               <div className="md:w-1/2 w-full flex flex-col gap-4">
                 {addon.images.map((img, idx) => (
                    <div key={idx} className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={img} alt={addon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                 ))}
               </div>
             </div>
           </div>
        </motion.div>
      );
    }
    
    if (stepDef.type === 'summary') {
      return (
        <motion.div key="summary" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="flex flex-col h-full bg-black relative p-8 md:p-16 overflow-y-auto w-full">
          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <h2 className="font-oswald text-5xl font-black uppercase tracking-tight text-[#9300c4] mb-12 text-center">RÉSUMÉ DE LA RÉSERVATION</h2>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 mb-12 border-b border-white/10 pb-12">
                <div>
                   <h3 className="font-oswald text-gray-500 tracking-[0.2em] uppercase text-sm mb-4">Dates du Séjour</h3>
                   <div className="bg-white/5 rounded-lg p-4 font-sans text-white text-lg">
                     {startDate ? new Date(startDate).toLocaleDateString('fr-FR') : 'Non défini'} <br/>
                     <span className="text-[#9300c4]">au</span> <br/>
                     {endDate ? new Date(endDate).toLocaleDateString('fr-FR') : 'Non défini'}
                   </div>
                   <p className="font-oswald text-amber-500 mt-2 tracking-widest">{nights} Nuit(s)</p>
                </div>
                <div>
                  <h3 className="font-oswald text-gray-500 tracking-[0.2em] uppercase text-sm mb-4">Détails Journaliers</h3>
                  <div className="space-y-3 font-sans text-base">
                    <div className="flex justify-between items-center text-gray-300">
                      <span>Suite de Maître (Base)</span>
                      <span className="font-mono text-white">${baseNightlyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                      <span>Style: {selectedStyle.name}</span>
                      <span className="font-mono text-white">{selectedStyle.pricePerNight === 0 ? 'Inclus' : `+$${selectedStyle.pricePerNight.toLocaleString()}`}</span>
                    </div>
                    {selectedAddons.map(id => {
                      const addon = ADDONS.find(a => a.id === id)!;
                      return (
                        <div key={id} className="flex justify-between items-center text-amber-500/80">
                          <span>{addon.name}</span>
                          <span className="font-mono text-amber-500">+$${addon.pricePerNight.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-oswald text-sm text-gray-500 uppercase tracking-[0.3em] mb-2">COÛT TOTAL ESTIMÉ DU SÉJOUR</p>
                <p className="font-oswald text-6xl md:text-7xl font-black text-white tracking-tight mb-8">
                  ${totalStayPrice.toLocaleString()}
                </p>
                <div className="bg-[#9300c4]/10 text-[#9300c4] px-6 py-2 rounded-full font-oswald tracking-widest text-sm mb-8 border border-[#9300c4]/30">
                  SOIT ${totalNightlyPrice.toLocaleString()} / NUIT
                </div>

                {status.msg && (
                  <div className={`w-full mb-8 p-6 text-sm font-sans rounded-xl text-center ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#9300c4]/10 text-[#9300c4] border border-[#9300c4]/20'}`}>
                    {status.msg}
                  </div>
                )}

                <button 
                  onClick={handleSubmit}
                  disabled={status.type === 'loading' || status.type === 'success'}
                  className="w-full max-w-md bg-gradient-to-r from-[#9300c4] to-[#600080] text-white font-oswald text-xl uppercase tracking-[0.2em] py-5 rounded-lg font-black hover:shadow-[0_0_40px_rgba(147,0,196,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONFIRMER LA RÉSERVATION
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      >
         {/* Top Header Navigation */}
         <div className="h-20 shrink-0 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-8 z-50">
            <h1 className="font-oswald text-2xl uppercase tracking-[0.3em] font-black text-white flex items-center gap-4">
              <img src="/Diamond 1.1.png" alt="Diamond" className="h-8 opacity-80" />
              THE DIAMOND <span className="text-[#9300c4] hidden md:inline">| CONFIGURATEUR</span>
            </h1>
            
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10 transition-all p-3 rounded-full flex items-center gap-2 font-oswald tracking-widest text-sm uppercase">
                <X className="w-5 h-5" /> <span className="hidden md:inline">FERMER</span>
              </button>
            )}
         </div>

         {/* Steps Progress Bar */}
         <div className="h-1 shrink-0 bg-white/5 flex">
            {menuSteps.map((_, idx) => (
              <div 
                key={idx} 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${100 / menuSteps.length}%`, 
                  backgroundColor: idx <= activeStep ? '#9300c4' : 'transparent',
                  opacity: idx === activeStep ? 1 : 0.5
                }}
              />
            ))}
         </div>

         {/* Main View Area */}
         <div className="flex-1 relative overflow-hidden bg-[#050505]">
           <div className="absolute inset-0 flex">
             <AnimatePresence mode="wait">
               {renderStepContent()}
             </AnimatePresence>
           </div>
         </div>
         
         {/* Footer Nav Controls */}
         <div className="h-24 shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 z-50">
            <button 
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-3 font-oswald uppercase tracking-widest text-base text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-3 px-6 rounded-lg hover:bg-white/5"
            >
              <ChevronLeft className="w-6 h-6" /> PRÉCÉDENT
            </button>
            
            <div className="hidden md:flex gap-4">
              {menuSteps.map((step, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveStep(i)}
                  className={`font-oswald text-xs uppercase tracking-widest transition-all ${i === activeStep ? 'text-[#9300c4] scale-110 font-bold' : 'text-gray-600 hover:text-gray-300'}`}
                >
                  {i+1}. {step.title.split(' ')[0]}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setActiveStep(Math.min(menuSteps.length - 1, activeStep + 1))}
              disabled={activeStep === menuSteps.length - 1}
              className="flex items-center gap-3 font-oswald uppercase tracking-widest text-base text-white bg-[#9300c4]/20 hover:bg-[#9300c4] border border-[#9300c4]/50 disabled:border-gray-800 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed transition-all py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(147,0,196,0.2)] hover:shadow-[0_0_25px_rgba(147,0,196,0.6)]"
            >
              SUIVANT <ChevronRight className="w-6 h-6" />
            </button>
         </div>
      </motion.div>
    </AnimatePresence>
  );
}
