import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
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

interface UserData {
  uid: string;
  role: 'patron' | 'employe' | 'vip' | 'client' | 'banni';
  isVip?: boolean;
}

export default function Store() {
  const [activeItem, setActiveItem] = useState<StoreItem | null>(null);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const uDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (uDoc.exists()) {
          setUserData(uDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
    });

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

    return () => unsub();
  }, []);

  const handlePurchase = async () => {
    if (!user || !userData) {
      setPurchaseStatus("Erreur : Vous devez être connecté pour effectuer un achat.");
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }
    if (userData.role !== 'vip' && userData.role !== 'patron' && !userData.isVip) {
      setPurchaseStatus("Erreur : Seuls les membres VIP peuvent procéder à des achats.");
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }
    if (!activeItem) return;

    try {
      setPurchaseStatus("Traitement de la demande...");
      const chatRef = doc(db, 'chats', user.uid);
      const chatDoc = await getDoc(chatRef);
      
      const purchaseMessage = `Bonjour, je souhaite acquérir l'article "${activeItem.name}" au prix de ${activeItem.price}. Merci de préparer l'opération.`;
      
      if (!chatDoc.exists()) {
         await setDoc(chatRef, {
           lastMessageTime: Date.now(),
           lastMessage: purchaseMessage,
           unreadCount: 1,
         });
      } else {
         await updateDoc(chatRef, {
           lastMessageTime: Date.now(),
           lastMessage: purchaseMessage,
           unreadCount: (chatDoc.data().unreadCount || 0) + 1
         });
      }

      await setDoc(doc(collection(db, `chats/${user.uid}/messages`)), {
        text: purchaseMessage,
        senderId: user.uid,
        createdAt: Date.now(),
      });

      setPurchaseStatus("Votre demande a été envoyée à la conciergerie avec succès !");
      setTimeout(() => {
        setPurchaseStatus(null);
        setActiveItem(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setPurchaseStatus("Une erreur est survenue lors de l'envoi de la demande.");
    }
  };

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
            <div className="flex flex-col items-end gap-2">
              <button onClick={handlePurchase} disabled={!!purchaseStatus && !purchaseStatus.includes('Erreur')} className="px-8 py-4 bg-[#9300c4] text-white font-oswald uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                ACHETER MAINTENANT
              </button>
              {purchaseStatus && (
                <p className={`text-sm font-sans ${purchaseStatus.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
                  {purchaseStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
