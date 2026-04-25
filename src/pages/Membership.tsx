import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import Modal from '../components/ui/Modal';
import { getAssetUrl } from '../lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState<any | null>(null);
  const [prices, setPrices] = useState({ silver: "$500", gold: "$1,500,000", diamond: "Sur Invitation" });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docRef = doc(db, 'settings', 'membership');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPrices({
            silver: data.silver || "$500",
            gold: data.gold || "$1,500,000",
            diamond: data.diamond || "Sur Invitation"
          });
        }
      } catch (err) {
        console.error("Impossible de charger les tarifs", err);
      }
    };
    fetchPrices();
  }, []);

  const VIP_TIERS = [
    {
      level: "SILVER",
      color: "from-gray-400 to-gray-200",
      price: prices.silver,
      benefits: [
        "Accès aux jeux de table standards",
        "Service de voiturier de courtoisie",
        "Stationnement privé niveau 1"
      ],
      modalContent: (
        <>
          <p>Notre carte Silver vous ouvre les portes de l'expérience Diamond Casino & Resort de base. Ce n'est que le début d'un parcours inégalé.</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li>Accès illimité au complexe principal et aux machines à sous.</li>
            <li>Service de voiturier 24h/24 et 7j/7 avec prise en charge immédiate.</li>
            <li>Accès aux tables de jeu à marge modérée.</li>
          </ul>
        </>
      )
    },
    {
      level: "GOLD",
      color: "from-amber-400 to-yellow-600",
      price: prices.gold,
      popular: true,
      benefits: [
        "Salles de jeux à hautes mises",
        "Service de limousine personnel",
        "Hébergement VIP de luxe",
        "Garde-robe de créateur exclusive",
        "Agent d'entretien à disposition"
      ],
      modalContent: (
        <>
          <p>Le statut Gold est réservé à ceux qui attendent plus de la vie et savent l'obtenir. De votre arrivée à votre départ, chaque once de votre volonté est exaucée.</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong>Service de Limousine:</strong> Appelez et nous serons là. Déplacement gratuit dans tout Los Santos.</li>
            <li><strong>Hautes Mises:</strong> Salles privées loin des regards indiscrets.</li>
            <li><strong>Agent personnel:</strong> Nettoyage gratuit de votre Penthouse et gestion de vos besoins immédiats.</li>
          </ul>
        </>
      )
    },
    {
      level: "DIAMOND",
      color: "from-fuchsia-600 to-purple-400",
      price: prices.diamond,
      benefits: [
        "Penthouse de Maître unique",
        "Bureau de direction privé",
        "Garage de prestige (10 places)",
        "Spa et centre de bien-être privé",
        "Accès prioritaire absolu",
        "Conciergerie et barman 24/7"
      ],
      modalContent: (
        <>
          <p>Le statut ultime. Un monde où l'argent n'est plus un sujet de discussion. L'adhésion Diamond s'obtient exclusivement sur invitation et offre l'accès inconditionnel à tout le complexe.</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong>Hélicoptère personnel:</strong> Accès illimité au service de transport aérien privé depuis le toit du Diamond.</li>
            <li><strong>L'Éden Privé:</strong> Un Penthouse sur mesure avec spa, cinéma privé, et espace d'arcade personnel.</li>
            <li><strong>Barman & Concierge:</strong> A votre service jour et nuit. Une fête improvisée ou un besoin inattendu ? C'est déjà fait.</li>
            <li><strong>Accès de Maître:</strong> Jamais d'attente. Nulle part. En aucune circonstance. Vous êtes le maître des lieux.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-black overflow-hidden">
      <div className="mb-16">
        <HeroSection
          label="L'ÉLITE DE LOS SANTOS"
          title="ADHÉSION AU COMPLEXE"
          description={<p className="text-left">Le Diamond n'est pas seulement un lieu, c'est un testament à l'accomplissement personnel. Notre programme d'adhésion est conçu pour ceux qui exigent le meilleur, sans compromis. Que vous fassiez vos premiers pas avec l'adhésion Silver ou que vous atteigniez les sommets du statut Diamond, vous entrez dans un monde où chaque détail est orchestré pour votre plaisir souverain.</p>}
          bgUrl="/GTA-Online-Casino-Update.jpg"
          textAlign="left"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-32 mb-16 bg-[#050505] border-y border-white/5 shadow-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-32"
        >
          <span className="font-oswald tracking-[0.3em] text-[#9300c4] uppercase text-xs font-bold">PRILIVÈGES EXCLUSIFS</span>
          <h2 className="font-oswald text-6xl md:text-7xl uppercase mt-4 tracking-tighter font-black">NOS RANGS</h2>
          <div className="w-16 h-[1px] bg-[#9300c4] mt-8"></div>
        </motion.div>

        <div className="space-y-32">
          {VIP_TIERS.map((tier, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
              >
                {/* Visual Block */}
                <div className="w-full lg:w-1/2 relative">
                  <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b ${tier.color} opacity-30 ${isEven ? '-left-8' : '-right-8'} hidden lg:block`} />
                  <div className="aspect-[4/3] bg-[#111] border border-white/5 relative overflow-hidden group">
                    <img 
                      src={getAssetUrl(tier.level === 'SILVER' ? "/5015fae6149f15c920c01da3401f68033fb8b6f8.jpg" : tier.level === 'GOLD' ? "https://images.unsplash.com/photo-1549487720-3b914856f671?auto=format&fit=crop&q=80" : "/5140edb4bce95b0de51a7eb627979aec8f99d4a3.jpg")} 
                      alt={`Statut ${tier.level}`} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {tier.popular && (
                      <div className="absolute top-6 left-6 bg-amber-500 text-black font-oswald font-black uppercase text-[10px] tracking-widest px-4 py-1">
                        RECOMMANDÉ
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Block */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <span className={`font-sans tracking-widest text-xs uppercase mb-2 ${tier.level === 'DIAMOND' ? 'text-fuchsia-400' : 'text-gray-400'}`}>Adhésion Premium</span>
                  <h3 className={`font-oswald text-5xl md:text-7xl font-black uppercase tracking-tighter bg-gradient-to-br ${tier.color} bg-clip-text text-transparent mb-6`}>
                    {tier.level}
                  </h3>
                  
                  {tier.level !== 'DIAMOND' && (
                    <div className="mb-8">
                      <span className="font-sans text-3xl font-light tracking-tight text-gray-100">
                        {tier.price}
                      </span>
                    </div>
                  )}

                  {tier.level === 'DIAMOND' && (
                    <div className="mb-8 inline-block">
                      <span className="font-oswald text-sm font-bold tracking-[0.2em] uppercase border border-fuchsia-500/50 text-fuchsia-400 px-4 py-2">
                        {tier.price}
                      </span>
                    </div>
                  )}
                  
                  <ul className="space-y-4 mb-12">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-300 font-sans text-sm uppercase tracking-wider font-light">
                        <div className="w-8 h-[1px] bg-white/20 mr-4"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button 
                    onClick={() => setSelectedTier(tier)}
                    whileHover={{ scale: 1.02 }}
                    className={`self-start py-4 px-8 border border-white/20 font-oswald tracking-[0.2em] text-[11px] font-bold uppercase transition-all duration-300 hover:bg-white hover:text-black`}
                  >
                    DÉCOUVRIR LES PRIVILÈGES
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="h-[50vh] w-full bg-cover bg-center bg-no-repeat relative grayscale flex items-center justify-center hover:grayscale-0 transition-all duration-1000" 
          style={{ backgroundImage: `url('${getAssetUrl("/16926f56733decd4dfaac886b456e5739c78ef40.jpg")}')` }}
        >
           <div className="absolute inset-0 bg-black/60" />
           <div className="absolute inset-0 border-y border-white/5" />
           <div className="relative text-center z-10">
             <h2 className="font-oswald text-5xl md:text-8xl uppercase tracking-[0.3em] font-black text-white/40 drop-shadow-2xl transition-colors duration-1000">ÉTERNITÉ</h2>
           </div>
        </motion.div>
      </div>

      <Modal 
        isOpen={selectedTier !== null} 
        onClose={() => setSelectedTier(null)} 
        title={`STATUT ${selectedTier?.level}`}
        image={selectedTier?.level === 'SILVER' ? "/5015fae6149f15c920c01da3401f68033fb8b6f8.jpg" : selectedTier?.level === 'GOLD' ? "https://media-rockstargames-com.akamaized.net/tina-uploads/posts/897953k597177k/b5c456eacf1d86a8960953406f44962aa6c6c518.jpg" : "/5140edb4bce95b0de51a7eb627979aec8f99d4a3.jpg"}
      >
        {selectedTier?.modalContent}
      </Modal>
    </div>
  );
}
