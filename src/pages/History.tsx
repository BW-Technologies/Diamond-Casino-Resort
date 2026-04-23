import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import { getAssetUrl } from '../lib/utils';

export default function History() {
  return (
    <div className="flex flex-col w-full bg-[#030303] min-h-screen pb-32">
      <HeroSection
        label="D'UNE ÉPOQUE SOMBRE AU PRESTIGE"
        title="L'HÉRITAGE DU DIAMOND"
        description={<p>L'histoire de Vinewood est pavée d'or et de scandales. Le Diamond Casino & Resort n'est pas simplement un bâtiment fraîchement sorti de terre. C'est l'évolution d'une institution qui a traversé les pires tumultes de Los Santos, pour finalement briller plus fort que jamais sous l'égide de Monsieur Owen Washington.</p>}
        bgUrl="/the-diamond-casino-and-resort-has-now-been-in-the-game-v0-50llyqa2t78f1.png"
        textAlign="center"
      />

      <div className="max-w-6xl mx-auto px-8 w-full mt-32">
        {/* L'ancien Vinewood */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="font-oswald text-sm text-[#9300c4] uppercase tracking-[0.3em] font-bold mb-4">Chapitre I</h2>
            <h3 className="font-oswald text-4xl md:text-5xl uppercase tracking-tighter font-black mb-8 text-white leading-tight">
              L'ANCIEN CASINO DE VINEWOOD
            </h3>
            <div className="prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed">
              <p className="first-letter:text-7xl first-letter:font-oswald first-letter:text-white first-letter:mr-3 first-letter:float-left first-line:tracking-widest first-line:uppercase">
                Avant 2019, la structure que vous connaissez aujourd'hui n'était qu'un établissement flétri et dépassé, affectueusement (ou non) connu sous le nom du <em>Be Lucky: Los Santos</em>. Un lieu qui promettait le rêve de Vinewood mais qui, derrière ses portes closes, abritait des opérations bien moins reluisantes.
              </p>
              <p className="mt-6">
                Ce que les néons clignotants tentaient de cacher, c'était un épicentre redoutable de trafics illégaux. Blanchiment d'argent pour les cartels locaux, arrières-salles enfumées dédiées à des marchés noirs insidieux... L'ancien casino était le secret le moins bien gardé de la pègre de San Andreas. Une époque de corruption totale.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] w-full bg-[#111] overflow-hidden p-2 border border-white/5">
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541708815234-9783f9828e83?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-60"></div>
          </div>
        </motion.div>

        {/* La Chute et le Scandale */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-40 flex flex-col items-center text-center"
        >
          <h2 className="font-oswald text-sm text-red-600 uppercase tracking-[0.3em] font-bold mb-4">Chapitre II</h2>
          <h3 className="font-oswald text-5xl md:text-6xl uppercase tracking-tighter font-black mb-12 text-white">
            LA FERMETURE ET LE SCANDALE
          </h3>
          
          <div className="w-full aspect-[21/9] overflow-hidden border border-white/10 mb-12 relative group">
             <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 group-hover:bg-transparent"></div>
             <img src="https://media.rockstargames.com/rockstargames-newsite/uploads/0319126de20bfe191299710889e70579faf50fc7.jpg" alt="Scène de crime casino" className="w-full h-full object-cover grayscale opacity-80 scale-105 group-hover:scale-100 transition-transform duration-1000" />
             <div className="absolute top-4 left-4 bg-red-600 text-white font-oswald text-[10px] tracking-widest px-3 py-1 uppercase z-20">Archive LSPD - 2019</div>
          </div>
          
          <div className="max-w-3xl prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed">
            <p>
              L'inévitable finit par se produire. Fédéraux, scandales publics, et luttes de pouvoir entre les familles mafieuses — dont les fameux investisseurs étrangers et les dynasties texanes — ont provoqué un raid massif. Les portes ont été scellées, le rêve brisé, et la bâtisse laissée à l'abandon.
            </p>
            <p className="mt-6">
              Pendant un temps, l'imposante structure n'était plus qu'une relique fantomatique, un rappel constant de la corruption qui rongeait Vinewood. La bannière "Mise sous scellés" est restée accrochée aux grilles suffisamment longtemps pour que tout le monde pense l'institution définitivement morte.
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
            <h2 className="font-oswald text-sm text-white uppercase tracking-[0.3em] font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Chapitre Final</h2>
            <h3 className="font-oswald text-5xl md:text-7xl uppercase tracking-tighter font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              LA RENAISSANCE
            </h3>
            <p className="font-oswald tracking-[0.2em] text-gray-500 uppercase mt-2">Sous l'égide de Monsieur Washington</p>
          </div>

          <div className="md:col-span-5 prose prose-invert prose-lg font-sans font-light text-gray-400 leading-relaxed flex flex-col justify-center">
            <p>
              C'est alors qu'est intervenu <strong className="font-bold text-white uppercase">Owen Washington</strong>. Visionnaire, philanthrope et homme d'affaires implacable, M. Washington n'a pas seulement racheté un bâtiment ; il a acheté une promesse.
            </p>
            <p className="mt-6">
              Avec un capital colossal et une volonté de fer, il a rasé l'ancienne réputation pour reconstruire sur des bases d'intégrité, de luxe absolu et de sécurité impénétrable. Aujourd'hui, l'établissement est la fierté économique et touristique incontestée de San Andreas.
            </p>
          </div>

          <div className="md:col-span-7 p-10 border border-white/10 bg-gradient-to-br from-[#111] to-black relative">
            <div className="absolute top-4 right-4 opacity-10">
              <img src={getAssetUrl("/Diamond 1.1.png")} className="w-32" alt="Diamond logo" />
            </div>
            <span className="text-6xl font-serif text-[#9300c4] leading-none absolute -top-4 -left-2 opacity-50">"</span>
            <blockquote className="relative z-10">
              <p className="text-2xl md:text-3xl font-oswald uppercase tracking-tighter text-white leading-tight font-black mb-8 mt-4">
                Nous ne construisons pas seulement un lieu de jeu, nous établissons un standard de vie que beaucoup pensaient impossible à Los Santos. Le Diamond est éternel, et désormais, il est irréprochable.
              </p>
              <footer className="text-right border-t border-white/10 pt-4">
                <p className="font-sans text-sm font-bold text-gray-400 uppercase tracking-widest">La Direction du Diamond</p>
                <p className="font-sans text-xs text-[#9300c4] tracking-widest mt-1">LOS SANTOS, SAN ANDREAS</p>
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
