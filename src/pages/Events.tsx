import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';

const EVENT_FACILITIES = [
  {
    id: 1,
    title: 'LE CASINO ENTIER',
    desc: "Privatisez le Diamond Casino & Resort pour une soirée inoubliable. Offrez à vos invités un accès exclusif à nos tables de jeu, nos machines à sous et notre service de bar VIP. Idéal pour les grands événements d'entreprise ou les célébrations grandioses.",
    img: 'https://forum-cfx-re.akamaized.net/original/4X/3/2/d/32d65a53e9e116779acd7ad3773c7e4eee47aaa0.jpeg',
    reversed: false,
  },
  {
    id: 2,
    title: 'LA TERRASSE SUR LE TOIT',
    desc: "Profitez d'une vue imprenable sur Los Santos tout en célébrant avec vos proches ou vos collaborateurs. La terrasse offre un cadre luxueux et dégagé pour des soirées cocktails, des lancements de produits ou des réceptions privées avec piscines et espaces lounge.",
    img: 'https://www.rockstarmag.fr/wp-content/uploads/2019/07/Rooftop.jpg',
    reversed: true,
  },
  {
    id: 3,
    title: 'LE PENTHOUSE',
    desc: "Pour vos réunions plus intimes mais tout aussi somptueuses, réservez la suite Penthouse. Organisez des fêtes exclusives avec vos propres tables de jeu privées, un espace cinéma, un bar personnel et un service de chambre stylé et sans compromis.",
    img: 'https://cdn.mos.cms.futurecdn.net/8MdqvBXAiQn3DJtHY4paWd.jpg',
    reversed: false,
  },
  {
    id: 4,
    title: "L'HIPPODROME",
    desc: "Louez l'hippodrome de Vinewood pour des événements à grande échelle, qu'il s'agisse de concerts en plein air, de festivals, de courses automobiles ou de rassemblements massifs. L'hippodrome offre l'espace nécessaire pour voir les choses en grand.",
    img: 'https://static.wikia.nocookie.net/gtawiki/images/8/85/VinewoodRacetrack-GTAO.png/revision/latest?cb=20210209203044',
    reversed: true,
  }
];

export default function Events() {
  return (
    <div className="w-full">
      <HeroSection 
        label="ÉVÈNEMENTS"
        title={
          <>
            UN CADRE <span className="text-[#9300c4]">D'EXCEPTION</span>
          </>
        }
        description={
          <>
            Pour des moments inoubliables. Louez le Diamond Casino & Resort, l'Hippodrome, le Penthouse ou la Terrasse pour vos évènements privés et grandioses.
          </>
        }
        bgUrl="https://static.wikia.nocookie.net/gtawiki/images/8/85/VinewoodRacetrack-GTAO.png/revision/latest?cb=20210209203044"
        textAlign="left"
      />
      
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-black text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-oswald tracking-widest text-[#9300c4] mb-8">ORGANISEZ VOS PROPRES ÉVÈNEMENTS</h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Le Diamond Casino & Resort n'est pas qu'un lieu de divertissement, c'est aussi le théâtre parfait pour vos propres évènements privés. 
            Qu'il s'agisse d'une soirée VIP dans le Penthouse, d'un rassemblement grandiose sur l'Hippodrome, ou d'une réservation complète de nos 
            salles de jeux, nous saurons faire de votre vision une réalité luxueuse.
            <br/><br/>
            <strong>À noter :</strong> Le Diamond organisera également ses propres soirées et évènements réguliers, restez attentifs à notre calendrier.
          </p>
        </motion.div>
      </section>

      <div className="py-12 bg-zinc-900 border-t border-b border-white/5 shadow-inner">
        {EVENT_FACILITIES.map((facility) => (
          <SplitSection 
            key={facility.id}
            label={`0${facility.id} // ÉQUIPEMENTS`}
            title={facility.title}
            description={facility.desc}
            bgUrl={facility.img}
            imagePosition={facility.reversed ? 'right' : 'left'}
          />
        ))}
      </div>
      
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-white/10 p-8 md:p-16 bg-gradient-to-b from-zinc-900/50 to-black backdrop-blur-sm"
        >
          <h2 className="text-2xl md:text-4xl font-oswald tracking-widest text-white mb-6">INTÉRESSÉ PAR UNE LOCATION ?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contactez notre équipe de conciergerie VIP pour discuter de vos besoins en matière d'évènements, 
            obtenir un devis personnalisé et réserver l'espace de votre choix au Diamond Casino & Resort.
          </p>
          <button className="px-8 py-3 border border-[#9300c4] text-[#9300c4] font-oswald tracking-widest uppercase hover:bg-[#9300c4] hover:text-white transition-all duration-300">
            CONTACTER LE SERVICE VIP
          </button>
        </motion.div>
      </section>
    </div>
  );
}
