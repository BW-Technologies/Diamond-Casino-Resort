import React, { useState } from 'react';
import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';
import Modal from '../components/ui/Modal';
import { getAssetUrl } from '../lib/utils';

export default function Penthouses() {
  const [activeFeature, setActiveFeature] = useState<{title: string; content: React.ReactNode; image: string} | null>(null);

  const openFeatureModal = (feature: string) => {
    if (feature === 'spa') {
      setActiveFeature({
        title: "LE SPA PRIVÉ",
        image: "https://static.wikia.nocookie.net/gtawiki/images/c/c8/MasterPenthouse-GTAO-Options-Spa.png/revision/latest/scale-to-width-down/1000?cb=20210110105715",
        content: (
          <>
            <p>Pourquoi descendre au rez-de-chaussée quand vous pouvez avoir votre propre sanctuaire thermique ? L'option Spa ajoute un jacuzzi luxueux avec vue sur la ville, un sauna en bois de cèdre et un service de massage à la demande.</p>
            <p>Détendez-vous après une longue nuit aux tables de jeu ou préparez-vous pour une journée intense à Vinewood avec les meilleurs thérapeutes de Los Santos.</p>
          </>
        )
      });
    } else if (feature === 'office') {
      setActiveFeature({
        title: "LE BUREAU DE DIRECTION",
        image: "https://static.wikia.nocookie.net/gtawiki/images/a/a7/MasterPenthouse-GTAO-Options-Office.png/revision/latest/scale-to-width-down/1000?cb=20210110105902",
        content: (
          <>
            <p>Gérez votre empire directement depuis votre Penthouse. Le Bureau de Direction vous donne un accès exclusif au réseau de SecuroServ sans avoir à quitter le confort de l'hôtel.</p>
            <p>Il comprend également un coffre-fort mural dissimulé et une armurerie privée avec espace de modification pour vos équipements les plus précieux.</p>
          </>
        )
      });
    } else if (feature === 'arcade') {
      setActiveFeature({
        title: "ESPACE ARCADE & LOUNGE",
        image: "https://static.wikia.nocookie.net/gtawiki/images/f/f4/MasterPenthouse-GTAO-Options-LoungeArea.png/revision/latest/scale-to-width-down/1000?cb=20210110105627",
        content: (
          <>
            <p>Apportez le divertissement à la maison. Installez jusqu'à trois bornes d'arcade classiques, un bar complet géré par une équipe disponible H24, et un espace de vie conçu pour les fins de soirée les plus mémorables.</p>
            <p>Personnalisez les couleurs fluo, le mobilier et choisissez vos œuvres d'art pour impressionner vos invités.</p>
          </>
        )
      });
    } else if (feature === 'croupier') {
      setActiveFeature({
        title: "CROUPIER PRIVÉ",
        image: "https://static.wikia.nocookie.net/gtawiki/images/1/1e/MasterPenthouse-GTAO-Options-PrivateDealer.png/revision/latest/scale-to-width-down/1000?cb=20210110105845",
        content: (
          <>
            <p>Le frisson du casino sans quitter l'intimité de votre salon. Une table de jeu haute limite est installée directement dans votre espace.</p>
            <p>Un croupier professionnel du Diamond Casino est à votre disposition 24h/24 pour organiser des parties de Blackjack ou de Poker avec vos amis ou associés, loin des regards indiscrets.</p>
          </>
        )
      });
    } else if (feature === 'media') {
      setActiveFeature({
        title: "SALLE DE MÉDIAS (CINÉMA PRIVÉ)",
        image: "https://static.wikia.nocookie.net/gtawiki/images/0/0a/MasterPenthouse-GTAO-Options-MediaRoom.png/revision/latest/scale-to-width-down/1000?cb=20210110105647",
        content: (
          <>
            <p>Profitez d'un authentique cinéma de Vinewood. Cette salle dédiée est équipée d'un écran géant incurvé et d'un système de sonorisation immersif THX.</p>
            <p>Idéal pour vos présentations de projets confidentiels, visionner les dernières avant-premières de Richards Majestic ou simplement profiter de soirées privées grandioses.</p>
          </>
        )
      });
    } else if (feature === 'guest') {
      setActiveFeature({
        title: "SUITE D'INVITÉS",
        image: "https://static.wikia.nocookie.net/gtawiki/images/3/3f/MasterPenthouse-GTAO-Options-ExtraBedroom.png/revision/latest/scale-to-width-down/1000?cb=20210110105920",
        content: (
          <>
            <p>L'hospitalité portée à l'art. Une chambre luxueuse séparée dotée de sa propre salle de bain en marbre et d'une vue sur Los Santos.</p>
            <p>Parfaite pour accueillir vos partenaires d'affaires d'outre-mer, vos relations diplomatiques ou tout invité méritant les standards du Diamond.</p>
          </>
        )
      });
    } else if (feature === 'garage') {
      setActiveFeature({
        title: "GARAGE PRIVÉ & VOITURIER",
        image: "https://static.wikia.nocookie.net/gtawiki/images/9/96/MasterPenthouse-GTAO-Options-Garage.png/revision/latest/scale-to-width-down/1000?cb=20210110105936",
        content: (
          <>
            <p>Un accès direct à un parking souterrain sécurisé offrant 10 luxueuses places. Intérêt RP : Votre passion pour l'automobile est votre signature.</p>
            <p>Ce garage est l'écrin nécessaire pour vos véhicules exclusifs. Le service voiturier vous les préparera à l'extérieur, mais rappelez-vous : tout en respectant strictement le Code de la route de San Andreas une fois sorti de l'enceinte.</p>
          </>
        )
      });
    } else if (feature === 'meeting') {
      setActiveFeature({
        title: "SALLE DE RÉUNIONS",
        image: "https://static.wikia.nocookie.net/gtawiki/images/6/6b/MasterPenthouse-GTAO-DiningRoom.png/revision/latest/scale-to-width-down/1000?cb=20191102115559",
        content: (
          <>
            <p>Gérez vos affaires avec clarté et efficacité. Une table en acajou encadrée de chaises en cuir attend vos collaborateurs pour vos prises de décision les plus stratégiques.</p>
            <p>Entièrement insonorisée pour garantir la confidentialité absolue de vos projets, cette salle est l'extension logique de l'empire que vous avez bâti.</p>
          </>
        )
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-black">
      <div className="mb-16">
        <HeroSection
          label="L'EXPÉRIENCE RÉSIDENTIELLE"
          title="LE PENTHOUSE"
          description={
            <div className="space-y-4">
              <p>Au Diamond, il n'y a qu'<strong>un seul Penthouse de Maître actuellement disponible à la location.</strong> C'est le vôtre.</p>
              <p>Un penthouse ne doit pas juste être un palais. Il se doit de refléter votre empire personnel. Si vous souhaitez un spa privé, vous l'avez. Un cinéma maison ? Considérez que c'est fait. Votre propre bar, bornes d'arcade ou un bureau ? Il suffit de demander.</p>
              <p className="pt-2 text-[#9300c4] italic text-sm font-semibold">Bien entendu, lors de la location, une présentation complète du penthouse sera faite personnellement au locataire.</p>
            </div>
          }
          bgUrl="/5140edb4bce95b0de51a7eb627979aec8f99d4a3.jpg"
          textAlign="left"
        />
      </div>
      
      <div className="mb-16">
        <SplitSection
          label="L'EXPÉRIENCE DU SOMMET"
          title="PISCINE SUR LE TOIT"
          description="Détendez-vous à la belle étoile dans votre piscine privée sur le toit. Profitez du mode de vie ultime de Vinewood avec des vues à couper le souffle et une intimité absolue garantie par notre service de sécurité."
          bgUrl="/36a87f762155d0c603760fa047731802c05f2c3e.jpg"
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
          <h2 className="font-oswald text-4xl md:text-5xl uppercase tracking-widest font-black">MODULES PERSONNALISABLES</h2>
          <p className="text-gray-400 mt-4 font-sans max-w-3xl mx-auto font-light leading-relaxed">
            Faites de cet écrin exclusif une œuvre sur mesure. <strong>En tant que VIP Diamond</strong>, une équipe de techniciens et d'architectes d'intérieur de haut standing se tient prête 24 heures sur 24 pour réaménager entièrement le Penthouse et le mouler à vos moindres désirs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { id: 'spa', name: 'SPA THERMAL', img: 'https://static.wikia.nocookie.net/gtawiki/images/c/c8/MasterPenthouse-GTAO-Options-Spa.png/revision/latest/scale-to-width-down/1000?cb=20210110105715' },
            { id: 'office', name: 'BUREAU SÉCURISÉ', img: 'https://static.wikia.nocookie.net/gtawiki/images/a/a7/MasterPenthouse-GTAO-Options-Office.png/revision/latest/scale-to-width-down/1000?cb=20210110105902' },
            { id: 'arcade', name: 'LOUNGE ARCADE', img: 'https://static.wikia.nocookie.net/gtawiki/images/e/eb/MasterPenthouse-GTAO-Options-BarandPartyHub.png/revision/latest/scale-to-width-down/1000?cb=20210110105827' },
            { id: 'croupier', name: 'CROUPIER PRIVÉ', img: 'https://static.wikia.nocookie.net/gtawiki/images/1/1e/MasterPenthouse-GTAO-Options-PrivateDealer.png/revision/latest/scale-to-width-down/1000?cb=20210110105845' },
            { id: 'media', name: 'SALLE DE MÉDIAS', img: 'https://static.wikia.nocookie.net/gtawiki/images/0/0a/MasterPenthouse-GTAO-Options-MediaRoom.png/revision/latest/scale-to-width-down/1000?cb=20210110105647' },
            { id: 'guest', name: 'SUITE D\'INVITÉS', img: 'https://static.wikia.nocookie.net/gtawiki/images/3/3f/MasterPenthouse-GTAO-Options-ExtraBedroom.png/revision/latest/scale-to-width-down/1000?cb=20210110105920' },
            { id: 'garage', name: 'GARAGE & VOITURIER', img: 'https://static.wikia.nocookie.net/gtawiki/images/9/96/MasterPenthouse-GTAO-Options-Garage.png/revision/latest/scale-to-width-down/1000?cb=20210110105936' },
            { id: 'meeting', name: 'SALLE DE RÉUNIONS', img: 'https://static.wikia.nocookie.net/gtawiki/images/6/6b/MasterPenthouse-GTAO-DiningRoom.png/revision/latest/scale-to-width-down/1000?cb=20191102115559' }
          ].map((feature, i) => (
            <motion.div 
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => openFeatureModal(feature.id)}
              className="relative aspect-square bg-[#111] overflow-hidden group cursor-pointer border border-white/5"
            >
              <img src={getAssetUrl(feature.img)} alt={feature.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-oswald text-2xl uppercase tracking-widest font-bold block mb-2">{feature.name}</span>
                <span className="text-[#9300c4] uppercase text-xs tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 block">EN SAVOIR PLUS &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={activeFeature !== null}
        onClose={() => setActiveFeature(null)}
        title={activeFeature?.title || ""}
        image={activeFeature?.image}
      >
        {activeFeature?.content}
      </Modal>
    </div>
  );
}
