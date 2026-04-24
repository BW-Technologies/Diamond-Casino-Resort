import React, { useState } from 'react';
import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';
import Modal from '../components/ui/Modal';
import { getAssetUrl } from '../lib/utils';

export default function Casino() {
  const [activeGame, setActiveGame] = useState<{title: string; content: React.ReactNode; image: string} | null>(null);

  const openGameModal = (game: string) => {
    if (game === 'roulette') {
      setActiveGame({
        title: "ROULETTE HAUTES MISES",
        image: "/5015fae6149f15c920c01da3401f68033fb8b6f8.jpg",
        content: (
          <div className="space-y-6">
            <p className="text-lg">Le frisson de la bille qui tourne, le silence qui s'installe dans la pièce... La Roulette au Diamond Casino n'est pas un jeu de hasard, c'est un spectacle.</p>
            <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
              <h4 className="font-oswald uppercase tracking-widest text-[#9300c4] font-bold mb-4">Règles pour débutants</h4>
              <p className="text-gray-300 text-sm mb-2">Le principe est simple : deviner sur quelle case la bille va s'arrêter.</p>
              <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2">
                <li><strong>Mises extérieures :</strong> Optez pour des choix sûrs (Rouge/Noir, Pair/Impair, Manque/Passe). Vous avez presque 1 chance sur 2 de gagner, le gain double votre mise.</li>
                <li><strong>Mises intérieures :</strong> Pariez sur des numéros spécifiques pour des gains massifs. Un seul numéro réussi (Plein) paie 35 fois votre mise !</li>
                <li>Le croupier lance la bille, une fois l'annonce "Rien ne va plus" faite, observez et priez.</li>
              </ul>
            </div>
            <p className="text-gray-400 text-sm italic">Des tables privées sont disponibles pour les membres VIP Gold et Diamond, offrant des limites allant jusqu'à $500,000 par jeton.</p>
          </div>
        )
      });
    } else if (game === 'blackjack') {
      setActiveGame({
        title: "LE SALON BLACKJACK",
        image: "/5a7f62bca6ed6b2532659c32bf1feee17fcfa887.jpg",
        content: (
          <div className="space-y-6">
            <p className="text-lg">Affrontez la banque dans un cadre où chaque carte retournée pourrait changer votre vie. Réservé à ceux qui gardent leur sang-froid.</p>
            <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
              <h4 className="font-oswald uppercase tracking-widest text-[#9300c4] font-bold mb-4">Règles pour débutants</h4>
              <p className="text-gray-300 text-sm mb-2">Le but ? Battre le croupier en s'approchant le plus possible de 21 sans jamais dépasser ce score.</p>
              <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2">
                <li><strong>Valeur des cartes :</strong> Les numéros valent leur valeur. Les Têtes (Valet, Dame, Roi) valent 10. L'As vaut 1 ou 11 (selon ce qui vous arrange).</li>
                <li><strong>Le déroulement :</strong> Recevez deux cartes. Vous pouvez "Tirer" (demander une autre carte) ou "Rester" (garder votre jeu).</li>
                <li><strong>Blackjack :</strong> Obtenir 21 dès les deux premières cartes (Un As + un 10). C'est le Graal et vous gagnez immédiatement à 3 contre 2 !</li>
                <li>Si vous dépassez 21, vous "sautez" et perdez votre mise.</li>
              </ul>
            </div>
            <p className="text-gray-400 text-sm italic">Haut lieu des VIP Diamond. Nos croupiers sont formés à la perfection, offrant une expérience rapide et fluide.</p>
          </div>
        )
      });
    } else if (game === 'poker') {
      setActiveGame({
        title: "POKER À 3 CARTES",
        image: "https://images.unsplash.com/photo-1540304318043-4cc01ff0f282?auto=format&fit=crop&q=80",
        content: (
          <div className="space-y-6">
            <p className="text-lg">Il ne s'agit pas de vos cartes, il s'agit de la façon dont vous les jouez. Un espace feutré pour les maîtres du bluff avant tout.</p>
            <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
              <h4 className="font-oswald uppercase tracking-widest text-[#9300c4] font-bold mb-4">Règles pour débutants</h4>
              <p className="text-gray-300 text-sm mb-2">Une version simplifiée et rapide du Poker classique où vous jouez directement contre le croupier.</p>
              <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2">
                <li><strong>L'Ante :</strong> Déposez une mise initiale pour recevoir vos 3 cartes face cachée.</li>
                <li><strong>Jouer ou Se Coucher :</strong> Après avoir vu vos cartes, soit vous trouvez votre main plutôt forte et vous "Jouez" (mise additionnelle identique à l'Ante), soit vous vous "Couchez" en perdant l'Ante.</li>
                <li><strong>Qualification du Croupier :</strong> Le croupier doit avoir au minimum une "Dame haute" pour que sa main soit valide. Si ce n'est pas le cas, vous gagnez automatiquement votre Ante.</li>
                <li><strong>Pair Plus :</strong> Un pari bonus excitant. Vous êtes payé selon un ratio défini si vous obtenez une paire ou mieux, indépendamment du jeu du croupier.</li>
              </ul>
            </div>
            <p className="text-gray-400 text-sm italic">Jouez en direct contre les croupiers du Diamond pour des prix gigantesques.</p>
          </div>
        )
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-black">
      <div className="mb-16">
        <HeroSection
          label="L'EXPÉRIENCE DE L'ABONDANCE"
          title="LE CASINO"
          description={<p>Ici, vos rêves deviennent réalité, et la réalité est un rêve. Chaque caprice peut être satisfait, chaque fantasme assouvi – aucun contrôle de soi, aucune fenêtre, aucune horloge, et aucune sortie clairement indiquée. Bienvenue dans les standards du Diamond.</p>}
          bgUrl="/5a7f62bca6ed6b2532659c32bf1feee17fcfa887.jpg"
          textAlign="left"
        />
      </div>
      
      <div className="mb-16">
        <SplitSection
          label="L'EXPÉRIENCE DU PRESTIGE"
          title="JEUX DE TABLE"
          description="Ne vous y trompez pas. Roulette, blackjack, poker — au Diamond, ce ne sont pas de simples jeux. Chaque carte distribuée, chaque tour de roue, chaque réplique soignée, chaque frisson de la foule..."
          bgUrl="/5015fae6149f15c920c01da3401f68033fb8b6f8.jpg"
          imagePosition="left"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-20 mb-24 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-oswald text-4xl md:text-5xl uppercase tracking-widest font-black">NOS JEUX LÉGENDAIRES</h2>
          <p className="text-gray-400 mt-4 font-sans max-w-2xl mx-auto font-light">Explorez l'art du jeu de table. Cliquez pour découvrir les règles et modalités exclusives du Diamond.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {[
            { id: 'roulette', name: 'ROULETTE', img: '/5015fae6149f15c920c01da3401f68033fb8b6f8.jpg' },
            { id: 'blackjack', name: 'BLACKJACK', img: 'https://forum-cfx-re.akamaized.net/original/4X/8/b/7/8b71b8cac1de5d1b1fa69cab9ba9952428d487c1.jpeg' },
            { id: 'poker', name: 'POKER (3 CARTES)', img: 'https://www.quasar-store.com/_next/image?url=https%3A%2F%2Fs3.quasar-store.com%2Fquasar-store-assets%2Fproducts%2F4f3fa0bd-643b-4737-98bd-bcbd8263ac94%2Fimage%2F1764354169556-2025-02-14_14-02-50.00_00_14_00.Imagen_fija006.webp&w=3840&q=75' }
          ].map((game, i) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => openGameModal(game.id)}
              className={`relative bg-[#111] overflow-hidden group cursor-pointer border border-white/5 ${game.id === 'poker' ? 'md:col-span-2 lg:col-span-2 h-[500px]' : 'h-[500px]'}`}
            >
              <img src={getAssetUrl(game.img)} alt={game.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <span className="font-oswald text-xl uppercase tracking-widest font-bold">{game.name}</span>
                <span className="text-[#9300c4] uppercase text-[10px] tracking-widest font-bold border border-[#9300c4] px-2 py-1 rounded">DÉCOUVRIR</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={activeGame !== null}
        onClose={() => setActiveGame(null)}
        title={activeGame?.title || ""}
        image={activeGame?.image}
      >
        {activeGame?.content}
      </Modal>
    </div>
  );
}
