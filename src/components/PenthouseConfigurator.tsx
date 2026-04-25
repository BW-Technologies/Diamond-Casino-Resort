import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { getAssetUrl } from '../lib/utils';
import { Check, X, ChevronRight, ChevronLeft, Calendar, Sparkles, Crown, Star } from 'lucide-react';

/* ─── DATA ─── */
const STYLES = [
  { id: 'timeless', name: 'Timeless', subtitle: 'Élégance intemporelle', price: 0, image: '/style-timeless.png', desc: 'Des tons chauds et terreux — brun profond, beige taupe, lavande douce. Un classique indémodable qui respire la sophistication.' },
  { id: 'vibrant', name: 'Vibrant', subtitle: 'Audace chromatique', price: 5000, image: '/style-vibrant.png', desc: 'Magenta, bleu électrique, touches de jaune vif. Pour ceux qui veulent que leur intérieur reflète leur personnalité flamboyante.' },
  { id: 'sharp', name: 'Sharp', subtitle: 'Minimalisme raffiné', price: 3000, image: '/style-sharp.png', desc: 'Noir profond, chocolat, crème. Un design épuré et tranchant pour les esprits les plus affûtés de Los Santos.' },
];

const ADDONS = [
  { id: 'lounge', name: 'Espace Lounge & Arcade', pricePerNight: 10000, desc: 'Bornes d\'arcade rétro, bar complet H24 et espace de vie pour des soirées inoubliables. Personnalisez les couleurs fluo et le mobilier.', image: '/penthouse-lounge.png', image2: '/penthouse-bar.png' },
  { id: 'media', name: 'Salle de Médias', pricePerNight: 7500, desc: 'Cinéma privé avec écran géant incurvé et système THX immersif. Idéal pour les avant-premières et les réunions confidentielles.', image: '/penthouse-media.png' },
  { id: 'spa', name: 'Spa Thermal Privé', pricePerNight: 15000, desc: 'Jacuzzi avec vue panoramique sur Los Santos, sauna en cèdre et service de massage à la demande. Votre sanctuaire personnel.', image: '/penthouse-spa.png' },
  { id: 'croupier', name: 'Croupier Privé', pricePerNight: 12000, desc: 'Table de Blackjack et Poker haute limite installée dans votre salon. Un croupier professionnel à votre disposition 24h/24.', image: '/penthouse-dealer.png' },
  { id: 'office', name: 'Bureau Sécurisé', pricePerNight: 8000, desc: 'Accès SecuroServ, coffre-fort mural dissimulé et armurerie privée avec espace de modification pour vos équipements.', image: '/penthouse-office.png' },
  { id: 'guest', name: 'Suite d\'Invités', pricePerNight: 9000, desc: 'Chambre luxueuse séparée avec salle de bain en marbre et vue sur la skyline. L\'hospitalité portée à l\'art.', image: '/penthouse-guest.png' },
  { id: 'garage', name: 'Garage & Voiturier', pricePerNight: 5000, desc: '10 places de parking sécurisées avec service voiturier premium. L\'écrin parfait pour vos véhicules d\'exception.', image: '/penthouse-garage.png' },
];

const STEPS = [
  { id: 'welcome', title: 'Suite de Maître' },
  { id: 'dates', title: 'Dates de séjour' },
  { id: 'style', title: 'Style & Décoration' },
  { id: 'addons', title: 'Options Premium' },
  { id: 'summary', title: 'Récapitulatif' },
];

/* ─── HELPERS ─── */
function formatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}
function daysBetween(a: Date, b: Date) {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}
function toInputDate(d: Date) {
  return d.toISOString().split('T')[0];
}

/* ─── COMPONENT ─── */
export default function PenthouseConfigurator({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const [step, setStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [checkOut, setCheckOut] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 4); return d; });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({ type: 'idle', msg: '' });
  const [direction, setDirection] = useState(1);

  const nights = useMemo(() => daysBetween(checkIn, checkOut), [checkIn, checkOut]);

  // Base rate per night
  const basePricePerNight = 50000;
  const stylePricePerNight = selectedStyle.price;
  const addonsPricePerNight = selectedAddons.reduce((s, id) => {
    const a = ADDONS.find(x => x.id === id);
    return s + (a ? a.pricePerNight : 0);
  }, 0);
  const totalPerNight = basePricePerNight + stylePricePerNight + addonsPricePerNight;
  const grandTotal = totalPerNight * nights;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) setUserData(snap.data());
      } else setUserData(null);
    });
    return () => unsub();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedStyle(STYLES[0]);
      setSelectedAddons([]);
      setStatus({ type: 'idle', msg: '' });
      const d1 = new Date(); d1.setDate(d1.getDate() + 1);
      const d2 = new Date(); d2.setDate(d2.getDate() + 4);
      setCheckIn(d1); setCheckOut(d2);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const goTo = (idx: number) => {
    setDirection(idx > step ? 1 : -1);
    setStep(idx);
  };

  const handleSubmit = async () => {
    if (!user || !userData) { setStatus({ type: 'error', msg: 'Vous devez être connecté.' }); return; }
    if (!['vip', 'patron', 'employe'].includes(userData.role) && !userData.isVip) {
      setStatus({ type: 'error', msg: 'Seuls les membres VIP peuvent réserver un Penthouse.' }); return;
    }
    setStatus({ type: 'loading', msg: 'Envoi de votre réservation...' });
    try {
      await addDoc(collection(db, 'penthouseRequests'), {
        userId: user.uid,
        userName: userData.displayName || 'Utilisateur',
        userEmail: user.email,
        configuration: {
          style: selectedStyle,
          addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)),
          totalPerNight,
          totalPrice: grandTotal,
          nights,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        },
        status: 'pending',
        createdAt: Date.now(),
      });
      setStatus({ type: 'success', msg: 'Réservation envoyée avec succès ! La direction étudiera votre demande.' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: 'Erreur lors de l\'envoi.' });
    }
  };

  /* ── Variants ── */
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  /* ── Render steps ── */
  const renderStep = () => {
    const key = STEPS[step].id;

    if (key === 'welcome') return (
      <motion.div key="welcome" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="cfg-panel">
        <div className="cfg-panel-inner">
          <div className="cfg-badge"><Crown className="w-4 h-4" /> COLLECTION EXCLUSIVE</div>
          <h2 className="cfg-title">Penthouse<br /><span className="cfg-title-accent">de Maître</span></h2>
          <p className="cfg-desc">
            Bienvenue dans le configurateur du Diamond Casino & Resort. Personnalisez le penthouse le plus exclusif de Los Santos
            selon vos envies — du style intérieur aux équipements haut de gamme. Chaque option influence votre tarif par nuit.
          </p>
          <div className="cfg-hero-img-wrap">
            <img src={getAssetUrl('/penthouse-master-bedroom.png')} alt="Suite de Maître" className="cfg-hero-img" />
            <div className="cfg-hero-img-overlay" />
          </div>
          <div className="cfg-price-block">
            <div className="cfg-price-label">À partir de</div>
            <div className="cfg-price-value">${basePricePerNight.toLocaleString()} <span className="cfg-price-unit">/ nuit</span></div>
          </div>
        </div>
      </motion.div>
    );

    if (key === 'dates') return (
      <motion.div key="dates" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="cfg-panel">
        <div className="cfg-panel-inner">
          <div className="cfg-badge"><Calendar className="w-4 h-4" /> PLANIFIEZ VOTRE SÉJOUR</div>
          <h2 className="cfg-title">Dates de<br /><span className="cfg-title-accent">Réservation</span></h2>
          <p className="cfg-desc">Sélectionnez vos dates d'arrivée et de départ. Le tarif final sera calculé en fonction du nombre de nuits.</p>

          <div className="cfg-dates-grid">
            <div className="cfg-date-card">
              <label className="cfg-date-label">Date d'arrivée</label>
              <input
                type="date"
                value={toInputDate(checkIn)}
                min={toInputDate(new Date())}
                onChange={e => {
                  const d = new Date(e.target.value);
                  setCheckIn(d);
                  if (d >= checkOut) { const d2 = new Date(d); d2.setDate(d2.getDate() + 1); setCheckOut(d2); }
                }}
                className="cfg-date-input"
              />
              <div className="cfg-date-display">{formatDate(checkIn)}</div>
            </div>
            <div className="cfg-date-separator">
              <ChevronRight className="w-5 h-5 text-[#9300c4]" />
              <span className="cfg-nights-badge">{nights} nuit{nights > 1 ? 's' : ''}</span>
              <ChevronRight className="w-5 h-5 text-[#9300c4]" />
            </div>
            <div className="cfg-date-card">
              <label className="cfg-date-label">Date de départ</label>
              <input
                type="date"
                value={toInputDate(checkOut)}
                min={toInputDate(new Date(checkIn.getTime() + 86400000))}
                onChange={e => setCheckOut(new Date(e.target.value))}
                className="cfg-date-input"
              />
              <div className="cfg-date-display">{formatDate(checkOut)}</div>
            </div>
          </div>

          <div className="cfg-price-block" style={{ marginTop: 'auto' }}>
            <div className="cfg-price-label">Durée du séjour</div>
            <div className="cfg-price-value">{nights} <span className="cfg-price-unit">nuit{nights > 1 ? 's' : ''}</span></div>
          </div>
        </div>
      </motion.div>
    );

    if (key === 'style') return (
      <motion.div key="style" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="cfg-panel">
        <div className="cfg-panel-inner">
          <div className="cfg-badge"><Sparkles className="w-4 h-4" /> AMBIANCE & COULEURS</div>
          <h2 className="cfg-title">Choisissez votre<br /><span className="cfg-title-accent">Style</span></h2>
          <div className="cfg-styles-grid">
            {STYLES.map(s => {
              const active = selectedStyle.id === s.id;
              return (
                <button key={s.id} onClick={() => setSelectedStyle(s)} className={`cfg-style-card ${active ? 'cfg-style-active' : ''}`}>
                  <div className="cfg-style-img-wrap">
                    <img src={getAssetUrl(s.image)} alt={s.name} className="cfg-style-img" />
                    {active && <div className="cfg-style-check"><Check className="w-4 h-4" /></div>}
                  </div>
                  <div className="cfg-style-info">
                    <div className="cfg-style-name">{s.name}</div>
                    <div className="cfg-style-sub">{s.subtitle}</div>
                    <div className="cfg-style-price">{s.price === 0 ? 'Inclus' : `+$${s.price.toLocaleString()}/nuit`}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedStyle && (
            <div className="cfg-style-detail">
              <p>{selectedStyle.desc}</p>
            </div>
          )}
        </div>
      </motion.div>
    );

    if (key === 'addons') return (
      <motion.div key="addons" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="cfg-panel">
        <div className="cfg-panel-inner cfg-addons-inner">
          <div className="cfg-badge"><Star className="w-4 h-4" /> PERSONNALISATION</div>
          <h2 className="cfg-title">Options<br /><span className="cfg-title-accent">Premium</span></h2>
          <div className="cfg-addons-grid">
            {ADDONS.map(a => {
              const active = selectedAddons.includes(a.id);
              return (
                <button key={a.id} onClick={() => toggleAddon(a.id)} className={`cfg-addon-card ${active ? 'cfg-addon-active' : ''}`}>
                  <div className="cfg-addon-img-wrap">
                    <img src={getAssetUrl(a.image)} alt={a.name} className="cfg-addon-img" />
                    {active && <div className="cfg-addon-badge-check"><Check className="w-3 h-3" /></div>}
                  </div>
                  <div className="cfg-addon-body">
                    <div className="cfg-addon-name">{a.name}</div>
                    <div className="cfg-addon-desc">{a.desc}</div>
                    <div className="cfg-addon-price">+${a.pricePerNight.toLocaleString()} <span>/nuit</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );

    if (key === 'summary') return (
      <motion.div key="summary" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="cfg-panel">
        <div className="cfg-panel-inner cfg-summary-inner">
          <h2 className="cfg-title">Récapitulatif<br /><span className="cfg-title-accent">& Confirmation</span></h2>

          <div className="cfg-summary-section">
            <div className="cfg-summary-row">
              <div className="cfg-summary-row-left">
                <img src={getAssetUrl('/penthouse-master-bedroom.png')} alt="Suite" className="cfg-summary-thumb" />
                <div>
                  <div className="cfg-summary-item-name">Suite de Maître (Base)</div>
                  <div className="cfg-summary-item-sub">{formatDate(checkIn)} → {formatDate(checkOut)} · {nights} nuit{nights > 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="cfg-summary-item-price">${basePricePerNight.toLocaleString()}/nuit</div>
            </div>

            <div className="cfg-summary-row">
              <div className="cfg-summary-row-left">
                <img src={getAssetUrl(selectedStyle.image)} alt={selectedStyle.name} className="cfg-summary-thumb" />
                <div>
                  <div className="cfg-summary-item-name">Style : {selectedStyle.name}</div>
                  <div className="cfg-summary-item-sub">{selectedStyle.subtitle}</div>
                </div>
              </div>
              <div className="cfg-summary-item-price">{selectedStyle.price === 0 ? 'Inclus' : `+$${selectedStyle.price.toLocaleString()}/nuit`}</div>
            </div>

            {selectedAddons.map(id => {
              const a = ADDONS.find(x => x.id === id)!;
              return (
                <div key={id} className="cfg-summary-row">
                  <div className="cfg-summary-row-left">
                    <img src={getAssetUrl(a.image)} alt={a.name} className="cfg-summary-thumb" />
                    <div>
                      <div className="cfg-summary-item-name">{a.name}</div>
                    </div>
                  </div>
                  <div className="cfg-summary-item-price cfg-summary-addon-price">+${a.pricePerNight.toLocaleString()}/nuit</div>
                </div>
              );
            })}
            {selectedAddons.length === 0 && (
              <div className="cfg-summary-empty">Aucun module supplémentaire sélectionné.</div>
            )}
          </div>

          <div className="cfg-summary-totals">
            <div className="cfg-summary-total-row">
              <span>Tarif par nuit</span>
              <span className="cfg-summary-total-val">${totalPerNight.toLocaleString()}</span>
            </div>
            <div className="cfg-summary-total-row">
              <span>Nombre de nuits</span>
              <span className="cfg-summary-total-val">× {nights}</span>
            </div>
            <div className="cfg-summary-total-row cfg-summary-grand">
              <span>Total estimé</span>
              <span className="cfg-summary-grand-val">${grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {status.msg && (
            <div className={`cfg-status ${status.type === 'error' ? 'cfg-status-err' : status.type === 'success' ? 'cfg-status-ok' : 'cfg-status-load'}`}>
              {status.msg}
            </div>
          )}

          <button onClick={handleSubmit} disabled={status.type === 'loading' || status.type === 'success'} className="cfg-submit-btn">
            CONFIRMER LA RÉSERVATION
          </button>
          <p className="cfg-legal">
            En confirmant, vous envoyez cette demande à la direction du Diamond Casino & Resort. Une réponse vous sera apportée dans les plus brefs délais.
          </p>
        </div>
      </motion.div>
    );

    return null;
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cfg-overlay">
        {/* Sidebar */}
        <div className="cfg-sidebar">
          <div className="cfg-sidebar-head">
            <div>
              <h1 className="cfg-sidebar-title">THE DIAMOND</h1>
              <p className="cfg-sidebar-sub">Configurateur Penthouse</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="cfg-close-btn"><X className="w-5 h-5" /></button>
            )}
          </div>

          <nav className="cfg-nav">
            {STEPS.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)} className={`cfg-nav-item ${step === i ? 'cfg-nav-active' : ''} ${step > i ? 'cfg-nav-done' : ''}`}>
                <span className="cfg-nav-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cfg-nav-label">{s.title}</span>
                {step > i && <Check className="w-4 h-4 cfg-nav-check" />}
              </button>
            ))}
          </nav>

          <div className="cfg-sidebar-footer">
            <div className="cfg-sidebar-price-label">TOTAL / NUIT</div>
            <div className="cfg-sidebar-price">${totalPerNight.toLocaleString()}</div>
            <div className="cfg-sidebar-nights">{nights} nuit{nights > 1 ? 's' : ''} · ${grandTotal.toLocaleString()} total</div>
          </div>
        </div>

        {/* Main */}
        <div className="cfg-main">
          <div className="cfg-glow cfg-glow-1" />
          <div className="cfg-glow cfg-glow-2" />

          <div className="cfg-content">
            <AnimatePresence mode="wait" custom={direction}>
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="cfg-footer">
            <button onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0} className="cfg-footer-btn cfg-footer-prev">
              <ChevronLeft className="w-5 h-5" /> Précédent
            </button>
            <div className="cfg-dots">
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`cfg-dot ${i === step ? 'cfg-dot-active' : ''}`} />
              ))}
            </div>
            <button onClick={() => goTo(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} className="cfg-footer-btn cfg-footer-next">
              Suivant <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
