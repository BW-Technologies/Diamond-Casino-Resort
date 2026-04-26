import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import { getAssetUrl } from '../lib/utils';

export default function History() {
  return (
    <div className="flex flex-col w-full bg-[#030303] min-h-screen pb-32">
      <HeroSection
        label="UNE HISTOIRE DE RENAISSANCE"
        title="L'HÉRITAGE DU DIAMOND"
        description={<p>De ses modestes débuts à son déclin inattendu, jusqu'à sa résurrection éclatante. Découvrez le parcours d'une institution de Vinewood qui a su traverser les époques pour finalement trouver son véritable sauveur : Monsieur Owen Washington.</p>}
        bgUrl="/the-diamond-casino-and-resort-has-now-been-in-the-game-v0-50llyqa2t78f1.png"
        textAlign="center"
      />

      <div className="max-w-6xl mx-auto px-8 w-full mt-32">
        {/* Le Be Lucky et 2019 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="font-oswald text-sm text-[#9300c4] uppercase tracking-[0.3em] font-bold mb-4">L'Époque Dorée</h2>
            <h3 className="font-oswald text-4xl md:text-5xl uppercase tracking-tighter font-black mb-8 text-white leading-tight">
              L'AVÈNEMENT DU DIAMOND
            </h3>
            <div className="prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed">
              <p className="first-letter:text-7xl first-letter:font-oswald first-letter:text-white first-letter:mr-3 first-letter:float-left first-line:tracking-widest first-line:uppercase">
                Pendant des décennies, le bâtiment d'origine n'était qu'un modeste établissement vieillissant qui peinait à maintenir l'illusion du faste de Vinewood. Mais l'année 2019 a marqué un tournant spectaculaire.
              </p>
              <p className="mt-6">
                Une rénovation magistrale l'a métamorphosé. L'architecture a été repensée, les matériaux les plus nobles importés, et le nom a changé : The Diamond Casino & Resort est né. Très vite, il est devenu le symbole de l'opulence, attirant les célébrités, les magnats et les chanceux du monde entier.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] w-full bg-[#111] overflow-hidden p-2 border border-white/5 relative group">
             <div className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-700 group-hover:bg-transparent"></div>
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541708815234-9783f9828e83?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"></div>
          </div>
        </motion.div>

        {/* Le Déclin et la Mise sous Tutelle */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-40 flex flex-col items-center text-center"
        >
          <h2 className="font-oswald text-sm text-gray-400 uppercase tracking-[0.3em] font-bold mb-4">L'Incertitude</h2>
          <h3 className="font-oswald text-5xl md:text-6xl uppercase tracking-tighter font-black mb-12 text-white">
            LA CHUTE SILENCIEUSE
          </h3>
          
          <div className="w-full aspect-[21/9] overflow-hidden border border-white/10 mb-12 relative group bg-[#111]">
             <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-700 group-hover:bg-black/20"></div>
             <img src="https://media.rockstargames.com/rockstargames-newsite/uploads/0319126de20bfe191299710889e70579faf50fc7.jpg" alt="Diamond Casino abandonné" className="w-full h-full object-cover grayscale opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000" />
          </div>
          
          <div className="max-w-3xl prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed text-left md:text-center">
            <p>
              Malgré son succès retentissant, la gestion de l'ombre s'est effritée. Il y a quelques mois, dans le plus grand des mystères, les anciens propriétaires ont purement et simplement abandonné le navire. Du jour au lendemain, l'édifice s'est retrouvé sans direction viable.
            </p>
            <p className="mt-6">
              Face au désastre économique imminent et à la perte de centaines d'emplois, le gouvernement de l'État de San Andreas a été contraint d'intervenir. Une mise sous tutelle a été actée, assurant uniquement la gestion quotidienne et minimale du casino. Les lustres continuaient de briller, mais l'âme n'y était plus. Le Diamond attendait désespérément un vrai repreneur.
            </p>
          </div>
        </motion.div>

        {/* L'Ère Washington */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-12"
        >
          <div className="md:col-span-8 md:col-start-3 text-center mb-12">
            <h2 className="font-oswald text-sm text-[#9300c4] uppercase tracking-[0.3em] font-bold mb-4 drop-shadow-[0_0_10px_rgba(147,0,196,0.5)]">Le Nouveau Souverain</h2>
            <h3 className="font-oswald text-5xl md:text-7xl uppercase tracking-tighter font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              LA RENAISSANCE
            </h3>
            <p className="font-oswald tracking-[0.2em] text-gray-500 uppercase mt-2">L'Ère Washington</p>
          </div>

          <div className="md:col-span-12 lg:col-span-5 prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed flex flex-col justify-center">
            <p>
              C'est alors qu'est intervenu <strong className="font-bold text-white uppercase text-xl">Owen Washington</strong>. Voyant le joyau terni, il n'a pas seulement racheté un bâtiment administratif : il a sauvé une institution.
            </p>
            <p className="mt-6">
              En rachetant officiellement le Diamond Casino & Resort au gouvernement, Monsieur Washington a réinjecté le capital et la vision qui faisaient cruellement défaut. Il a réinstauré le prestige originel, sécurisé les emplois et repoussé les limites du luxe. Désormais, le Diamond n'est plus en attente : il règne.
            </p>
          </div>

          <div className="md:col-span-12 lg:col-span-7 p-10 border border-white/10 bg-gradient-to-br from-[#111] to-black relative">
            <div className="absolute top-4 right-4 opacity-10">
              <img src={getAssetUrl("/Diamond 1.1.png")} className="w-32" alt="Diamond logo" />
            </div>
            <span className="text-6xl font-serif text-[#9300c4] leading-none absolute -top-4 -left-2 opacity-50">"</span>
            <blockquote className="relative z-10">
              <p className="text-2xl md:text-3xl font-oswald uppercase tracking-tighter text-white leading-tight font-black mb-8 mt-4">
                Certains voyaient une coquille vide gérée par l'État. Moi, j'y ai vu le trône de Vinewood qui n'attendait que son roi. Le Diamond ne fermera jamais.
              </p>
              <footer className="text-right border-t border-white/10 pt-4">
                <p className="font-sans text-sm font-bold text-gray-400 uppercase tracking-widest">Owen Washington</p>
                <p className="font-sans text-xs text-[#9300c4] tracking-widest mt-1">PROPRIÉTAIRE & PDG</p>
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
