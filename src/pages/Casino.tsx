import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';

export default function Casino() {
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
    </div>
  );
}
