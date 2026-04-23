import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-black">
      <div className="mb-16">
        <HeroSection
          label="L'EXCELLENCE À L'ÉTAT PUR"
          title="UN COMPLEXE LUXUEUX AU CŒUR DE VINEWOOD"
          description={<p>Vous avez entendu les rumeurs. Vous voulez y croire, et il n'y a qu'une seule façon d'en avoir le cœur net. Oubliez vos idées reçues. Lâchez prise sur vos inhibitions, vos doutes et votre cote de crédit. Les rumeurs sont loin de la réalité. Bienvenue au Diamond.</p>}
          bgUrl="/745947be626044d8977c396ee3c876db825abc1b.jpg"
        />
      </div>

      <div className="mb-16">
        <SplitSection
          bgUrl="/b49f49e79f7c1c933bdf89c98f9659d260ad1cf3.jpg"
          label="TERRASSE SUR LE TOIT"
          title="DES VUES INCOMPARABLES"
          description="Détendez-vous au bord de notre piscine à débordement tout en admirant la ligne d'horizon glamour de Vinewood. L'évasion ultime pour ceux qui apprécient les plus belles choses de la vie."
          imagePosition="right"
        />
      </div>

      <div className="mb-16">
        <SplitSection
          bgUrl="/the-diamond-casino-and-resort-has-now-been-in-the-game-v0-50llyqa2t78f1.png"
          label="ÉTABLISSEMENTS"
          title="UN PARADIS POUR JOUEURS"
          description="Des machines à sous flamboyantes de Lady Luck aux tables de poker haut de gamme, le Diamond redéfinit le divertissement. Tentez votre chance ou observez les légendes se créer dans notre arène de jeu principale."
          imagePosition="left"
        />
      </div>
    </div>
  );
}
