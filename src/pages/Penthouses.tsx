import HeroSection from '../components/HeroSection';
import SplitSection from '../components/SplitSection';

export default function Penthouses() {
  return (
    <div className="flex flex-col w-full bg-black">
      <div className="mb-16">
        <HeroSection
          label="L'EXPÉRIENCE RÉSIDENTIELLE"
          title="LES PENTHOUSES"
          description={<p>Un penthouse au Diamond n'est pas juste un palais. C'est <em>votre</em> palais. Si vous souhaitez un spa privé, vous l'avez. Un cinéma maison ? Considérez que c'est fait. Votre propre bar personnel, vos bornes d'arcade ou un bureau ? Il suffit de demander : Diamond.</p>}
          bgUrl="./5140edb4bce95b0de51a7eb627979aec8f99d4a3.jpg"
          textAlign="left"
        />
      </div>
      
      <div className="mb-16">
        <SplitSection
          label="L'EXPÉRIENCE DU SOMMET"
          title="PISCINE SUR LE TOIT"
          description="Détendez-vous à la belle étoile dans votre piscine privée sur le toit. Profitez du mode de vie ultime de Vinewood avec des vues à couper le souffle et une intimité inégalée."
          bgUrl="./36a87f762155d0c603760fa047731802c05f2c3e.jpg"
          imagePosition="left"
        />
      </div>
    </div>
  );
}
