import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { Check, X, Calendar as CalendarIcon, Info, Image as ImageIcon } from 'lucide-react';

const MASTER_SUITE_IMAGE = 'https://static.wikia.nocookie.net/gtawiki/images/f/fe/MasterPenthouse-GTAO-Options-MasterPenthouse.png/revision/latest/scale-to-width-down/1000?cb=20210110105607';

export default function PenthouseConfigurator({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);
  
  const [activeStep, setActiveStep] = useState<'dates' | 'style' | 'addons' | 'summary'>('dates');
  
  // To show image preview when hovering/focusing an addon
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const [selectedStyleId, setSelectedStyleId] = useState('timeless');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const [status, setStatus] = useState<{type: 'idle' | 'loading' | 'success' | 'error', msg: string}>({ type: 'idle', msg: '' });

  const parseNum = (str: any, fallback: number) => {
    if (!str) return fallback;
    const clean = String(str).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? fallback : parsed;
  };

  const BASE_NIGHTLY_RATE = prices ? parseNum(prices.penthouseNight, 50000) : 50000;

  const STYLES = [
    { id: 'timeless', name: 'Timeless (Intemporel)', pricePerNight: 0, image: 'https://static.wikia.nocookie.net/gtawiki/images/1/1b/MasterPenthouse-GTAO-Colours-Timeless.png/revision/latest/scale-to-width-down/200?cb=20200421194804' },
    { id: 'vibrant', name: 'Vibrant (Désir)', pricePerNight: prices ? parseNum(prices.penthouseStyleVibrant, 2000) : 2000, image: 'https://static.wikia.nocookie.net/gtawiki/images/2/2c/MasterPenthouse-GTAO-Colours-Vibrant.png/revision/latest/scale-to-width-down/200?cb=20191102110145' },
    { id: 'sharp', name: 'Sharp (Éblouissant)', pricePerNight: prices ? parseNum(prices.penthouseStyleSharp, 4000) : 4000, image: 'https://static.wikia.nocookie.net/gtawiki/images/a/a8/MasterPenthouse-GTAO-Colours-Sharp.png/revision/latest/scale-to-width-down/200?cb=20200421194804' }
  ];

  const ADDONS = [
    { id: 'lounge', name: 'Espace Lounge', pricePerNight: prices ? parseNum(prices.penthouseLounge, 10000) : 10000, desc: 'Immense espace de vie relaxant et luxueux. Le Lounge constitue le cœur de votre Penthouse de Maître et débloque la possibilité d\'ajouter un espace bar, un spa, une salle multimédia, un croupier ou un bureau de direction.', images: ['https://static.wikia.nocookie.net/gtawiki/images/f/f4/MasterPenthouse-GTAO-Options-LoungeArea.png/revision/latest/scale-to-width-down/1000?cb=20210110105627'] },
    { id: 'media', name: 'Salle de Médias', pricePerNight: prices ? parseNum(prices.penthouseMedia, 5000) : 5000, desc: 'Un véritable cinéma privé avec un écran géant incurvé, des sièges premium ultra-confortables et un système son surround à couper le souffle pour visionner vos films ou jouer dans des conditions optimales.', images: ['https://static.wikia.nocookie.net/gtawiki/images/0/0a/MasterPenthouse-GTAO-Options-MediaRoom.png/revision/latest/scale-to-width-down/1000?cb=20210110105647'], requiresLounge: true },
    { id: 'bar', name: 'Espace Bar & Arcade', pricePerNight: prices ? parseNum(prices.penthouseBar, 6000) : 6000, desc: 'Donnez vie à vos soirées avec un bar complet géré par un mixologue professionnel. L\'espace inclut également d\'authentiques bornes d\'arcade rétro.', images: ['https://static.wikia.nocookie.net/gtawiki/images/e/eb/MasterPenthouse-GTAO-Options-BarandPartyHub.png/revision/latest/scale-to-width-down/1000?cb=20210110105827'], requiresLounge: true },
    { id: 'spa', name: 'Spa Privé', pricePerNight: prices ? parseNum(prices.penthouseSpa, 15000) : 15000, desc: 'Votre propre sanctuaire en plein ciel : un jacuzzi à débordement avec vue sur Los Santos, un sauna sec et des masseurs disponibles à toute heure.', images: ['https://static.wikia.nocookie.net/gtawiki/images/c/c8/MasterPenthouse-GTAO-Options-Spa.png/revision/latest/scale-to-width-down/1000?cb=20210110105715'], requiresLounge: true },
    { id: 'croupier', name: 'Croupier Privé', pricePerNight: prices ? parseNum(prices.penthouseDealer, 12000) : 12000, desc: 'Ne descendez plus dans la salle de jeux. Une véritable table de casino (Blackjack / Poker) installée chez vous, avec un croupier à votre disposition exclusive.', images: ['https://static.wikia.nocookie.net/gtawiki/images/1/1e/MasterPenthouse-GTAO-Options-PrivateDealer.png/revision/latest/scale-to-width-down/1000?cb=20210110105845'], requiresLounge: true },
    { id: 'office', name: 'Bureau Sécurisé', pricePerNight: prices ? parseNum(prices.penthouseOffice, 8000) : 8000, desc: 'Dirigez vos affaires en toute confidentialité. Comprend un ordinateur avec accès au réseau sécurisé SecuroServ, un navigateur privé, un coffre-fort mural dissimulé et une armoire de stockage d\'armes.', images: ['https://static.wikia.nocookie.net/gtawiki/images/a/a7/MasterPenthouse-GTAO-Options-Office.png/revision/latest/scale-to-width-down/1000?cb=20210110105902'], requiresLounge: true },
    { id: 'guest', name: 'Suite d\'invités', pricePerNight: prices ? parseNum(prices.penthouseGuest, 7000) : 7000, desc: 'Le summum de l\'hospitalité. Une luxueuse chambre séparée avec lit king size, dressing et salle de bain en marbre pour accueillir confortablement vos VIPs.', images: ['https://static.wikia.nocookie.net/gtawiki/images/3/3f/MasterPenthouse-GTAO-Options-ExtraBedroom.png/revision/latest/scale-to-width-down/1000?cb=20210110105920'] },
    { id: 'garage', name: 'Garage Privé VIP', pricePerNight: prices ? parseNum(prices.penthouseGarage, 2000) : 2000, desc: 'Stationnez jusqu\'à 10 de vos plus précieux véhicules dans les sous-sols ultra-sécurisés du The Diamond. Un service de conciergerie automobile est inclus.', images: ['https://static.wikia.nocookie.net/gtawiki/images/9/96/MasterPenthouse-GTAO-Options-Garage.png/revision/latest/scale-to-width-down/1000?cb=20210110105936'] }
  ];

  useEffect(() => {
    import('firebase/firestore').then(({ doc, getDoc }) => {
      getDoc(doc(db, 'settings', 'membership')).then(pDoc => {
        if(pDoc.exists()) setPrices(pDoc.data());
      });
    });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        import('firebase/firestore').then(({ doc, getDoc }) => {
          getDoc(doc(db, 'users', currentUser.uid)).then(d => {
            if (d.exists()) setUserData(d.data());
          });
        });
      }
    });
    return () => unsub();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveStep('dates');
      setSelectedStyleId(STYLES[0].id);
      setSelectedAddons([]);
      setStartDate('');
      setEndDate('');
      setHoveredImage(null);
      setStatus({ type: 'idle', msg: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      const nextAddons = selectedAddons.filter(a => a !== id);
      if (id === 'lounge') {
        const dependentIds = ['media', 'bar', 'spa', 'croupier', 'office'];
        setSelectedAddons(nextAddons.filter(a => !dependentIds.includes(a)));
      } else {
        setSelectedAddons(nextAddons);
      }
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1;
  };

  const totalNights = calculateDays();
  const addonsPricePerNight = selectedAddons.reduce((acc, currentId) => {
    const addon = ADDONS.find(a => a.id === currentId);
    return acc + (addon ? addon.pricePerNight : 0);
  }, 0);
  
  const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];
  const nightlyTotal = BASE_NIGHTLY_RATE + currentStyle.pricePerNight + addonsPricePerNight;
  const grandTotal = nightlyTotal * (totalNights || 1);

  const handleSubmit = async () => {
    if (!user) {
      setStatus({ type: 'error', msg: 'Vous devez être connecté.' });
      return;
    }
    if (!startDate || !endDate) {
      setStatus({ type: 'error', msg: 'Veuillez sélectionner vos dates de séjour.' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Envoi en cours...' });
    try {
      const configuration = {
        startDate,
        endDate,
        totalNights,
        style: currentStyle,
        addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)),
        nightlyPrice: nightlyTotal,
        totalPrice: grandTotal
      };

      await addDoc(collection(db, 'penthouseRequests'), {
        userId: user.uid,
        userName: user.displayName || 'Utilisateur inconnu',
        userEmail: user.email,
        configuration,
        status: 'pending',
        createdAt: Date.now()
      });
      
      setStatus({ type: 'success', msg: 'Demande envoyée avec succès.' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Erreur lors de l\'envoi de la demande.' });
    }
  };

  const hasAccess = userData && (userData.role === 'patron' || userData.role === 'employe' || userData.vipTier === 'diamond');

  const steps = [
    { id: 'dates', name: 'DATES' },
    { id: 'style', name: 'THÈME' },
    { id: 'addons', name: 'MODULES VIP' },
    { id: 'summary', name: 'RÉSUMÉ' }
  ];

  let displayImage = MASTER_SUITE_IMAGE;
  if (hoveredImage) displayImage = hoveredImage;
  else if (activeStep === 'style') displayImage = currentStyle.image;
  else if (activeStep === 'addons' && selectedAddons.length > 0) {
      const lastAddon = ADDONS.find(a => a.id === selectedAddons[selectedAddons.length - 1]);
      if (lastAddon) displayImage = lastAddon.images[0];
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex justify-center items-center p-0 md:p-6 lg:p-10"
      >
         {!hasAccess ? (
           <div className="w-full max-w-xl bg-[#111] border border-white/10 p-12 text-center rounded relative">
             <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
               <X className="w-8 h-8 text-red-500" />
             </div>
             <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white mb-4">ACCÈS REFUSÉ</h2>
             <p className="font-sans text-gray-400 mb-8 leading-relaxed">
               La réservation du Penthouse de Maître est un privilège strictement réservé aux membres <strong className="text-amber-500">VIP Diamond</strong>. Veuillez vous rapprocher de la direction ou améliorer votre statut d'adhésion.
             </p>
             <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white text-white hover:text-black font-oswald tracking-widest uppercase transition-colors">
               Fermer
             </button>
           </div>
         ) : (
           <div className="w-full h-full max-w-[1400px] md:max-h-[85vh] bg-[#0a0a0a] md:rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative border border-white/10">
            
            {/* LEFT PANEL: CONFIGURATION */}
            <div className="w-full md:w-1/2 flex flex-col bg-[#0a0a0a] z-20 shrink-0 border-r border-white/5 relative">
               
               {/* Fixed Header */}
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black sticky top-0 shrink-0 z-30">
                 <div>
                   <h1 className="font-oswald text-2xl uppercase tracking-widest font-black text-white">THE DIAMOND</h1>
                   <p className="font-sans text-xs text-amber-500 uppercase tracking-widest mt-1">Éditeur de Penthouse</p>
                 </div>
                 {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                      <X className="w-5 h-5" />
                    </button>
                  )}
               </div>

               {/* Step Navigation */}
               <div className="flex border-b border-white/5 shrink-0 bg-[#111]">
                 {steps.map((stp, i) => (
                   <button 
                     key={stp.id}
                     onClick={() => setActiveStep(stp.id as any)}
                     className={`flex-1 py-4 px-2 text-center text-xs font-oswald uppercase tracking-widest transition-colors border-b-2 ${activeStep === stp.id ? 'border-[#9300c4] text-[#9300c4] bg-[#9300c4]/5' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
                   >
                     <span className="hidden sm:inline mr-1 opacity-50">{i + 1}.</span>{stp.name}
                   </button>
                 ))}
               </div>

               {/* Scrollable Content Area */}
               <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* STEP 1: DATES */}
                      {activeStep === 'dates' && (
                        <div className="space-y-8 max-w-md mx-auto">
                           <div className="text-center mb-8">
                             <h2 className="font-oswald text-3xl text-white uppercase tracking-widest mb-2 font-bold">VOS DATES DE SÉJOUR</h2>
                             <p className="text-gray-400 font-sans text-sm">Le Penthouse n'est loué qu'à un seul membre VIP à la fois. Sécurisez vos dates dès maintenant.</p>
                           </div>
                           
                           <div className="space-y-6">
                              <div>
                                <label className="block text-xs font-oswald text-gray-400 uppercase tracking-widest mb-2">Arrivée</label>
                                <div className="relative group">
                                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-[#9300c4] transition-colors" />
                                  <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-black border border-white/10 text-white px-12 py-4 font-sans text-sm outline-none focus:border-[#9300c4] transition-colors rounded-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-oswald text-gray-400 uppercase tracking-widest mb-2">Départ</label>
                                <div className="relative group">
                                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-[#9300c4] transition-colors" />
                                  <input 
                                    type="date" 
                                    min={startDate}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-black border border-white/10 text-white px-12 py-4 font-sans text-sm outline-none focus:border-[#9300c4] transition-colors rounded-none"
                                  />
                                </div>
                              </div>
                           </div>

                           {startDate && endDate && (
                             <div className="bg-[#111] p-6 border border-white/5 text-center mt-8">
                               <p className="font-oswald text-gray-400 tracking-widest uppercase text-sm mb-1">DURÉE DU SÉJOUR :</p>
                               <p className="font-oswald text-3xl text-amber-500">{totalNights} NUIT{totalNights > 1 ? 'S' : ''}</p>
                             </div>
                           )}

                           <button 
                             onClick={() => setActiveStep('style')}
                             disabled={!startDate || !endDate}
                             className="w-full mt-4 py-4 bg-white text-black font-oswald uppercase tracking-widest font-black hover:bg-[#9300c4] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             SUIVANT : THÈME
                           </button>
                        </div>
                      )}

                      {/* STEP 2: STYLE */}
                      {activeStep === 'style' && (
                        <div className="space-y-6">
                           <div className="mb-8">
                             <h2 className="font-oswald text-3xl text-white uppercase tracking-widest mb-2 font-bold">THÈME DE COULEURS</h2>
                             <p className="text-gray-400 font-sans text-sm">Les matériaux, l'éclairage ambiant et le mobilier seront adaptés à votre sélection dans toute la suite.</p>
                           </div>

                           <div className="grid grid-cols-1 gap-4">
                             {STYLES.map(style => (
                               <button
                                 key={style.id}
                                 onClick={() => setSelectedStyleId(style.id)}
                                 className={`w-full flex items-center p-4 border transition-all ${selectedStyleId === style.id ? 'border-[#9300c4] bg-[#9300c4]/10' : 'border-white/10 bg-black hover:border-white/30'}`}
                               >
                                 <div className="w-24 h-16 shrink-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden border border-white/5 mr-6 relative">
                                    <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                                    {selectedStyleId === style.id && <div className="absolute inset-0 border-2 border-[#9300c4]"></div>}
                                 </div>
                                 <div className="text-left flex-1">
                                   <div className="flex items-center justify-between mb-1">
                                      <span className={`font-oswald uppercase tracking-widest text-lg ${selectedStyleId === style.id ? 'text-white' : 'text-gray-300'}`}>{style.name}</span>
                                      {selectedStyleId === style.id && <Check className="w-5 h-5 text-[#9300c4]" />}
                                   </div>
                                   <span className="font-sans text-sm text-amber-500/80">{style.pricePerNight === 0 ? 'Inclus par défaut' : `+$${style.pricePerNight.toLocaleString()}/nuit`}</span>
                                 </div>
                               </button>
                             ))}
                           </div>

                           <button 
                             onClick={() => setActiveStep('addons')}
                             className="w-full mt-8 py-4 bg-white text-black font-oswald uppercase tracking-widest font-black hover:bg-[#9300c4] hover:text-white transition-colors"
                           >
                             SUIVANT : MODULES VIP
                           </button>
                        </div>
                      )}

                      {/* STEP 3: ADDONS */}
                      {activeStep === 'addons' && (
                        <div className="space-y-6">
                           <div className="mb-6">
                             <h2 className="font-oswald text-3xl text-white uppercase tracking-widest mb-2 font-bold">MODULES & EXTENSIONS</h2>
                             <p className="text-gray-400 font-sans text-sm leading-relaxed mb-4">
                               Façonnez le Penthouse selon vos besoins. <br />
                               <strong className="text-white">Note :</strong> L'Espace Lounge est le cœur structurel du Penthouse et est requis pour ajouter d'autres modules de divertissement ou d'affaires.
                             </p>
                           </div>

                           <div className="flex flex-col gap-4">
                             {ADDONS.map(addon => {
                               const isSelected = selectedAddons.includes(addon.id);
                               const isLocked = addon.requiresLounge && !selectedAddons.includes('lounge');

                               return (
                                 <div 
                                   key={addon.id} 
                                   onMouseEnter={() => setHoveredImage(addon.images[0])}
                                   onMouseLeave={() => setHoveredImage(null)}
                                   className={`border p-5 transition-all ${isSelected ? 'border-amber-500 bg-amber-500/5' : isLocked ? 'border-white/5 bg-black/50 opacity-60' : 'border-white/10 bg-black hover:border-white/30'} flex flex-col sm:flex-row gap-5 items-start sm:items-center`}
                                 >
                                    <div className="flex-1">
                                       <div className="flex items-center gap-3 mb-2">
                                          <h3 className={`font-oswald text-xl tracking-wider uppercase font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>{addon.name}</h3>
                                          <span className="font-mono text-xs text-gray-400 px-2 py-1 bg-white/5 border border-white/10 uppercase tracking-wider">+${addon.pricePerNight.toLocaleString()} / nuit</span>
                                       </div>
                                       <p className="font-sans text-sm text-gray-400 leading-relaxed mb-3">{addon.desc}</p>
                                       
                                       {isLocked && (
                                         <p className="text-red-400 text-xs font-sans bg-red-500/10 px-3 py-2 border border-red-500/20 inline-block mb-3">
                                            <span className="font-bold">Module verrouillé :</span> Nécessite l'Espace Lounge.
                                         </p>
                                       )}
                                    </div>
                                    
                                    <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                                      <button
                                        onClick={() => !isLocked && toggleAddon(addon.id)}
                                        disabled={isLocked}
                                        className={`w-full sm:w-40 py-3 font-oswald text-sm uppercase tracking-widest transition-colors ${
                                          isLocked ? 'bg-black border border-gray-800 text-gray-600 cursor-not-allowed' :
                                          isSelected ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' : 'bg-white text-black hover:bg-amber-500 hover:text-white'
                                        }`}
                                      >
                                        {isSelected ? 'RETIRER' : isLocked ? 'VERROUILLÉ' : 'AJOUTER'}
                                      </button>
                                    </div>
                                 </div>
                               );
                             })}
                           </div>

                           <button 
                             onClick={() => setActiveStep('summary')}
                             className="w-full mt-8 py-4 bg-white text-black font-oswald uppercase tracking-widest font-black hover:bg-[#9300c4] hover:text-white transition-colors"
                           >
                             SUIVANT : RÉSUMÉ
                           </button>
                        </div>
                      )}

                      {/* STEP 4: SUMMARY */}
                      {activeStep === 'summary' && (
                         <div className="space-y-8 max-w-lg mx-auto">
                            <div className="text-center mb-8">
                              <h2 className="font-oswald text-3xl text-white uppercase tracking-widest mb-2 font-bold">RÉSUMÉ ET VALIDATION</h2>
                              <p className="text-gray-400 font-sans text-sm">Vérifiez toutes les informations de votre demande de location VIP.</p>
                            </div>

                            <div className="bg-[#111] border border-white/10 p-6 space-y-4">
                               <div className="flex justify-between border-b border-white/5 pb-4">
                                  <span className="font-oswald text-gray-400 uppercase tracking-widest">Base PENTHOUSE DE MAÎTRE</span>
                                  <span className="font-mono text-white">${BASE_NIGHTLY_RATE.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between border-b border-white/5 pb-4">
                                  <span className="font-oswald text-gray-400 uppercase tracking-widest">Thème : {currentStyle.name}</span>
                                  <span className="font-mono text-white">+{currentStyle.pricePerNight === 0 ? '0' : currentStyle.pricePerNight.toLocaleString()}</span>
                               </div>
                               
                               {selectedAddons.length > 0 && (
                                 <div className="pt-2 border-b border-white/5 pb-4">
                                   <p className="font-oswald text-[#9300c4] uppercase tracking-widest mb-3 text-sm font-bold">Modules Ajoutés :</p>
                                   <div className="space-y-2">
                                     {selectedAddons.map(id => {
                                       const addon = ADDONS.find(a => a.id === id);
                                       if(!addon) return null;
                                       return (
                                          <div key={id} className="flex justify-between text-sm">
                                            <span className="font-sans text-gray-300">- {addon.name}</span>
                                            <span className="font-mono text-amber-500/80">+${addon.pricePerNight.toLocaleString()}</span>
                                          </div>
                                       );
                                     })}
                                   </div>
                                 </div>
                               )}
                               
                               <div className="pt-4 flex justify-between items-end">
                                 <div>
                                   <span className="font-oswald text-amber-500 uppercase tracking-widest font-bold text-lg">TOTAL PAR NUIT</span>
                                 </div>
                                 <span className="font-oswald text-3xl text-white">${nightlyTotal.toLocaleString()}</span>
                               </div>
                            </div>

                            <div className="bg-[#111] border-l-4 border-amber-500 p-6 flex justify-between items-center">
                               <div>
                                 <p className="font-oswald text-sm text-gray-400 tracking-widest uppercase mb-1">Facturation Totale Estimée</p>
                                 <p className="font-sans text-xs text-gray-500">Pour un séjour de {totalNights} nuit{totalNights > 1 ? 's' : ''}</p>
                               </div>
                               <span className="font-oswald text-4xl text-amber-500 font-bold">${grandTotal.toLocaleString()}</span>
                            </div>

                            {status.msg && (
                              <div className={`p-4 text-sm font-sans rounded border ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#9300c4]/10 text-[#9300c4] border-[#9300c4]/20'}`}>
                                {status.msg}
                              </div>
                            )}

                            <button 
                              onClick={handleSubmit}
                              disabled={status.type === 'loading' || status.type === 'success'}
                              className="w-full bg-[#9300c4] text-white py-5 font-oswald font-black text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              SOUMETTRE LA DEMANDE
                            </button>
                         </div>
                      )}
                    </motion.div>
                 </AnimatePresence>
               </div>

               {/* Bottom Total Bar (Always visible) */}
               <div className="fixed md:absolute bottom-0 left-0 w-full p-6 bg-black border-t border-white/10 shrink-0 z-40 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                  <div>
                    <p className="font-oswald text-xs text-gray-500 tracking-widest uppercase mb-1">TOTAL / NUIT</p>
                    <p className="font-oswald text-2xl text-white">${nightlyTotal.toLocaleString()}</p>
                  </div>
                  {(totalNights > 0 && startDate && endDate) && (
                    <div className="text-right">
                      <p className="font-oswald text-xs text-amber-500 tracking-widest uppercase mb-1">SÉJOUR COMPLET</p>
                      <p className="font-oswald text-2xl text-amber-500">${grandTotal.toLocaleString()}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* RIGHT PANEL: IMMERSIVE PREVIEW */}
            <div className="hidden md:flex flex-1 relative bg-black items-center justify-center overflow-hidden z-10 p-12">
               {/* Vignette effect */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 opacity-50"></div>
               
               <AnimatePresence mode="wait">
                  <motion.div
                    key={displayImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                     <img src={displayImage} alt="Aperçu" className="w-full h-full object-cover object-center" />
                  </motion.div>
               </AnimatePresence>

               {/* Contextual overlay text */}
               <div className="absolute bottom-16 right-16 z-20 text-right max-w-md pointer-events-none">
                 <h3 className="font-oswald text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-4">
                   {hoveredImage 
                     ? ADDONS.find(a => a.images.includes(hoveredImage))?.name 
                     : activeStep === 'style' 
                         ? currentStyle.name 
                         : 'SUITE DE MAÎTRE'}
                 </h3>
                 <p className="font-sans text-lg text-gray-200 drop-shadow-md leading-relaxed">
                   {hoveredImage 
                     ? ADDONS.find(a => a.images.includes(hoveredImage))?.desc.substring(0, 100) + '...'
                     : activeStep === 'style' 
                         ? "Revêtez la Suite à votre image avec l'un de nos thèmes haut de gamme."
                         : "Le summum du luxe à Los Santos. Profitez d'une vue imprenable et d'un confort inégalé."}
                 </p>
               </div>
            </div>

          </div>
         )}
      </motion.div>
    </AnimatePresence>
  );
}
