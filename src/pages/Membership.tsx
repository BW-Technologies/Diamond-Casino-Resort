import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';

const VIP_TIERS = [
  {
    level: "SILVER",
    color: "from-gray-400 to-gray-200",
    price: "$500",
    benefits: [
      "Accès aux jeux de table standards",
      "Service de voiturier de courtoisie",
      "Stationnement privé niveau 1"
    ]
  },
  {
    level: "GOLD",
    color: "from-amber-400 to-yellow-600",
    price: "$1,500,000",
    popular: true,
    benefits: [
      "Salles de jeux à hautes mises",
      "Service de limousine personnel",
      "Hébergement VIP de luxe",
      "Garde-robe de créateur exclusive",
      "Agent d'entretien à disposition"
    ]
  },
  {
    level: "DIAMOND",
    color: "from-fuchsia-600 to-purple-400",
    price: "Sur Invitation",
    benefits: [
      "Penthouse de Maître unique",
      "Bureau de direction privé",
      "Garage de prestige (10 places)",
      "Spa et centre de bien-être privé",
      "Accès prioritaire absolu",
      "Conciergerie et barman 24/7"
    ]
  }
];

export default function Membership() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black overflow-hidden">
      <div className="mb-16">
        <HeroSection
          label="L'ÉLITE DE LOS SANTOS"
          title="ADHÉSION AU COMPLEXE"
          description={<p className="text-left">Le Diamond n'est pas seulement un lieu, c'est un testament à l'accomplissement personnel. Notre programme d'adhésion est conçu pour ceux qui exigent le meilleur, sans compromis. Que vous fassiez vos premiers pas avec l'adhésion Silver ou que vous atteigniez les sommets du statut Diamond, vous entrez dans un monde où chaque détail est orchestré pour votre plaisir souverain.</p>}
          bgUrl="./GTA-Online-Casino-Update.jpg"
          textAlign="left"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-32 mb-16 bg-[#050505] border-y border-white/5 shadow-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-24"
        >
          <span className="font-oswald tracking-[0.3em] text-[#9300c4] uppercase text-xs font-bold">PRILIVÈGES EXCLUSIFS</span>
          <h2 className="font-oswald text-6xl md:text-7xl uppercase mt-4 tracking-tighter font-black">NOS RANGS</h2>
          <div className="w-16 h-[1px] bg-[#9300c4] mt-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {VIP_TIERS.map((tier, index) => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative overflow-hidden flex flex-col bg-gradient-to-b from-[#111] to-[#080808] border border-white/5 rounded-sm transition-all duration-500 hover:border-white/20`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black font-oswald font-black uppercase text-[10px] tracking-widest px-4 py-1 z-10">
                  RECOMMANDÉ
                </div>
              )}
              
              <div className="p-12 flex flex-col h-full">
                <h3 className={`font-oswald text-4xl font-black uppercase tracking-tighter bg-gradient-to-br ${tier.color} bg-clip-text text-transparent mb-2`}>
                  {tier.level}
                </h3>
                <div className="h-[1px] w-8 bg-white/20 mb-8" />
                
                <div className="mb-12">
                  <span className={`font-sans text-3xl font-light tracking-tight ${tier.level === 'DIAMOND' ? 'text-fuchsia-400 italic' : 'text-gray-100'}`}>
                    {tier.price}
                  </span>
                </div>
                
                <ul className="flex-1 space-y-5">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-400 font-sans text-xs uppercase tracking-widest font-medium">
                      <div className="w-1 h-1 rounded-full bg-[#9300c4] mr-4 opacity-50"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <motion.button 
                  whileHover={{ backgroundColor: '#fff', color: '#000' }}
                  className={`mt-16 w-full py-5 border border-white/10 font-oswald tracking-[0.2em] text-[10px] font-black uppercase transition-all duration-300`}
                >
                  DEVENIR MEMBRE
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mb-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="h-[50vh] w-full bg-cover bg-center bg-no-repeat relative grayscale hover:grayscale-0 transition-all duration-1000" 
          style={{ backgroundImage: 'url(./16926f56733decd4dfaac886b456e5739c78ef40.jpg)' }}
        >
           <div className="absolute inset-0 bg-black/40" />
           <div className="absolute inset-0 flex items-center justify-center border-y border-white/5">
              <div className="text-center">
                <h2 className="font-oswald text-5xl md:text-8xl uppercase tracking-[0.3em] font-black text-white/5 transition-colors duration-1000">ÉTERNITÉ</h2>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
