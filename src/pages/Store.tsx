import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import HeroSection from '../components/HeroSection';
import Modal from '../components/ui/Modal';
import { getAssetUrl } from '../lib/utils';

interface StoreItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  desc: string;
}

export default function Store() {
  const [activeItem, setActiveItem] = useState<StoreItem | null>(null);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        const q = query(collection(db, 'storeItems'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const allS: StoreItem[] = [];
        snapshot.forEach(d => {
          allS.push({ id: d.id, ...d.data() } as StoreItem);
        });
        setStoreItems(allS);
      } catch (err) {
        console.error("Error fetching store items", err);
      }
    };
    fetchStoreItems();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen pb-24 bg-black">
      <div className="mb-16">
        <HeroSection
          label="L'EXPÉRIENCE DE L'EXCLUSIVITÉ"
          title="LA BOUTIQUE"
          description={<p>Mode exclusive. Œuvres d'art uniques. Il y a certaines choses dans la vie que l'argent ne peut acheter. Mais rassurez-vous. Notre boutique propose une sélection tournante d'articles choisis avec goût, que vous pouvez acquérir avec vos Jetons.</p>}
          bgUrl="/783829344e15bcc769c2117f32ab4e468e0070a5.jpg"
          textAlign="left"
        />
      </div>
      
      <div className="max-w-[1700px] mx-auto px-8 md:px-24 mt-20 w-full pt-12 border-t border-white/5">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-12 flex justify-between items-end border-b border-white/10 pb-6"
        >
           <h2 className="font-oswald text-3xl uppercase tracking-wider">Arrivages Récents</h2>
           <span className="font-sans text-sm text-gray-400">Soldes rafraîchis chaque semaine</span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {storeItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group cursor-pointer"
              onClick={() => setActiveItem(item)}
            >
              <div className="aspect-[4/5] w-full bg-[#111] mb-6 overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-colors">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={getAssetUrl(item.imageUrl)} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <button className="w-full py-3 bg-white text-black font-oswald uppercase text-sm font-bold tracking-widest hover:bg-[#9300c4] hover:text-white transition-colors">
                     Examiner
                   </button>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                 <h3 className="font-oswald uppercase text-lg tracking-wide text-gray-200">{item.name}</h3>
                 <span className="font-sans text-[#a72ad4] font-medium whitespace-nowrap text-sm bg-white/5 py-1 px-3 rounded">{item.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={activeItem !== null}
        onClose={() => setActiveItem(null)}
        title={activeItem?.name || ""}
        image={activeItem?.imageUrl}
      >
        <div className="space-y-8">
          <p className="text-xl italic text-gray-300">"{activeItem?.desc}"</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Prix de l'article</p>
              <p className="text-3xl font-oswald text-[#a72ad4]">{activeItem?.price}</p>
            </div>
            <button className="px-8 py-4 bg-[#9300c4] text-white font-oswald uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors">
              ACHETER MAINTENANT
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
