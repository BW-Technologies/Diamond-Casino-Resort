import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signOut, onAuthStateChanged, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, limit, writeBatch } from 'firebase/firestore';
import { auth, db, secondaryAuth } from '../lib/firebase';
import { Users, Shield, LogOut, Loader2, Star, UserPlus, Check, X, ShieldAlert, Settings, UserCircle, Car, Key, CreditCard, Edit2, Ban, DollarSign, Archive, Camera, ShoppingCart, MessageSquare, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { getAssetUrl } from '../lib/utils';

import OverviewTab from '../components/dashboard/OverviewTab';
import DirectoryTab from '../components/dashboard/DirectoryTab';
import StoreTab from '../components/dashboard/StoreTab';
import AccountingTab from '../components/dashboard/AccountingTab';
import ArchivesTab from '../components/dashboard/ArchivesTab';
import RatesTab from '../components/dashboard/RatesTab';
import ProfileTab from '../components/dashboard/ProfileTab';
import ChatTab from '../components/dashboard/ChatTab';
import PenthouseRequestsTab from '../components/dashboard/PenthouseRequestsTab';
import MyPenthouseReqTab from '../components/dashboard/MyPenthouseReqTab';
import ConfirmModal from '../components/ui/ConfirmModal';

interface UserData {
  uid: string;
  email: string;
  role: 'patron' | 'employe' | 'vip' | 'client' | 'banni';
  isVip?: boolean;
  displayName: string;
  photoURL?: string;
  vipTier?: 'silver' | 'gold' | 'diamond';
  createdAt: number;
}

interface Transaction {
  id: string;
  type: 'recette' | 'depense';
  nature: string;
  category: string;
  amount: number;
  associatedExpense?: number;
  associatedMemberId?: string;
  createdAt: number;
  archived: boolean;
}

interface StoreItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  desc: string;
  createdAt: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserData[]>([]);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, onConfirm: () => void}>({isOpen: false, message: '', onConfirm: () => {}});

  const requestConfirm = (message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, message, onConfirm });
  };

  // Create user
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createName, setCreateName] = useState('');
  const [createRole, setCreateRole] = useState<'employe' | 'vip' | 'client'>('client');
  const [createVipTier, setCreateVipTier] = useState<'silver' | 'gold' | 'diamond'>('silver');
  const [createLoading, setCreateLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Edit user
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<UserData['role']>('client');
  const [editVipTier, setEditVipTier] = useState<UserData['vipTier']>('silver');
  const [editIsVip, setEditIsVip] = useState(false);

  // Profile Edit
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileSaveStatus, setProfileSaveStatus] = useState('');

  // Prices
  const [prices, setPrices] = useState({ silver: "$500", gold: "$1,500,000", diamond: "Sur Invitation", penthouseNight: "$50,000" });
  const [savePriceStatus, setSavePriceStatus] = useState('');

  // Store Management
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [storeName, setStoreName] = useState('');
  const [storePrice, setStorePrice] = useState('');
  const [storeImageUrl, setStoreImageUrl] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storeEditingId, setStoreEditingId] = useState<string | null>(null);

  // Accounting
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [archives, setArchives] = useState<Transaction[]>([]);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  
  const [accType, setAccType] = useState<'recette' | 'depense'>('recette');
  const [accNature, setAccNature] = useState('');
  const [accCategory, setAccCategory] = useState('');
  const [accAmount, setAccAmount] = useState('');
  const [accAssocExpense, setAccAssocExpense] = useState('');
  const [accMemberId, setAccMemberId] = useState('');

  // Conciergerie fake state
  const [conciergeMsg, setConciergeMsg] = useState('');

  // Penthouse Request tracking
  const [hasPenthouseReq, setHasPenthouseReq] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let uData: UserData;
        
        if (userDocSnap.exists()) {
          uData = userDocSnap.data() as UserData;
        } else {
          let isFirst = false;
          try {
            const qPatron = query(collection(db, 'users'), where('role', '==', 'patron'), limit(1));
            const snap = await getDocs(qPatron);
            isFirst = snap.empty;
          } catch(e) {
             console.error("Checking patron failed", e);
          }

          uData = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            role: isFirst ? 'patron' : 'client',
            displayName: currentUser.email?.split('@')[0] || 'Utilisateur',
            createdAt: Date.now()
          };
          await setDoc(userDocRef, uData);
        }
        
        setUserData(uData);
        if (uData.photoURL) setProfilePhoto(uData.photoURL);

        if (uData.role === 'patron' || uData.role === 'employe') {
          fetchUsersList();
          if (uData.role === 'patron') {
            fetchPrices();
            fetchTransactions();
            fetchStoreItems();
          }
        } else {
          // Check if non-staff has a penthouse request
          import('firebase/firestore').then(({ query, collection, where, onSnapshot }) => {
            const q = query(collection(db, 'penthouseRequests'), where('userId', '==', currentUser.uid));
            onSnapshot(q, snap => {
              setHasPenthouseReq(!snap.empty);
            });
          });
        }

      } catch (err) {
        console.error("Error fetching user data", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const fetchUsersList = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: UserData[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as UserData);
      });
      setUsersList(list);
    } catch (err) {
      console.error("Error fetching users list", err);
    }
  };

  const fetchPrices = async () => {
    try {
      const pDoc = await getDoc(doc(db, 'settings', 'membership'));
      if(pDoc.exists()) {
        const d = pDoc.data();
        setPrices({ 
          silver: d.silver||"$500", 
          gold: d.gold||"$1,500,000", 
          diamond: d.diamond||"Sur Invitation",
          penthouseNight: d.penthouseNight||"$50,000"
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, 'accounting'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const allT: Transaction[] = [];
      snapshot.forEach(d => {
        allT.push({ id: d.id, ...d.data() } as Transaction);
      });
      setTransactions(allT.filter(t => !t.archived));
      setArchives(allT.filter(t => t.archived));
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

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

  const handleSavePrices = async () => {
    try {
      setSavePriceStatus('Sauvegarde...');
      await setDoc(doc(db, 'settings', 'membership'), prices);
      setSavePriceStatus('Tarifs mis à jour avec succès.');
      setTimeout(() => setSavePriceStatus(''), 3000);
    } catch(err) {
      setSavePriceStatus('Erreur de sauvegarde.');
    }
  };

  const handleSaveProfilePhoto = async () => {
    if (!userData) return;
    try {
      setProfileSaveStatus('Sauvegarde...');
      await updateDoc(doc(db, 'users', userData.uid), { photoURL: profilePhoto });
      setUserData({ ...userData, photoURL: profilePhoto });
      setProfileSaveStatus('Photo de profil mise à jour.');
      setTimeout(() => setProfileSaveStatus(''), 3000);
    } catch(err) {
      setProfileSaveStatus('Erreur de sauvegarde.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail || !createPassword || !createName) {
      setCreateStatus({ type: 'error', msg: 'Tous les champs sont requis.' });
      return;
    }
    if (createPassword.length < 6) {
      setCreateStatus({ type: 'error', msg: 'Le mot de passe doit faire au moins 6 caractères.' });
      return;
    }

    setCreateLoading(true);
    setCreateStatus(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, createEmail, createPassword);
      const newUid = userCredential.user.uid;
      
      const newUserData: UserData = {
        uid: newUid,
        email: createEmail,
        role: createRole,
        displayName: createName,
        createdAt: Date.now()
      };
      
      if (createRole === 'vip') {
        newUserData.vipTier = createVipTier;
      }
      
      await setDoc(doc(db, 'users', newUid), newUserData);
      
      setCreateEmail('');
      setCreatePassword('');
      setCreateName('');
      setCreateStatus({ type: 'success', msg: `Compte ${createRole} créé avec succès.` });
      fetchUsersList();
    } catch (error: any) {
      setCreateStatus({ type: 'error', msg: error.message || 'Erreur lors de la création du compte.' });
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditUser = (usr: UserData) => {
    setEditingUser(usr);
    setEditName(usr.displayName);
    setEditRole(usr.role);
    setEditVipTier(usr.vipTier || 'silver');
    setEditIsVip(!!usr.isVip);
  };

  const saveEditUser = async () => {
    if(!editingUser) return;
    try {
      const updateData: any = {
        displayName: editName,
        role: editRole,
        isVip: editIsVip
      };
      if (editRole === 'vip' || editIsVip) {
        updateData.vipTier = editVipTier;
      }
      await updateDoc(doc(db, 'users', editingUser.uid), updateData);
      // Update local patron data if editing oneself
      if (editingUser.uid === userData?.uid) {
         setUserData(prev => prev ? {...prev, displayName: editName, role: editRole, isVip: editIsVip, vipTier: (editRole === 'vip' || editIsVip) ? editVipTier : prev.vipTier} : null);
      }
      setEditingUser(null);
      fetchUsersList();
    } catch(err) {
      alert("Erreur lors de la modification");
    }
  };

  const handleRevokeUser = (usr: UserData) => {
    requestConfirm(`Voulez-vous vraiment bannir et révoquer les accès de ${usr.displayName} ?`, async () => {
      try {
        await updateDoc(doc(db, 'users', usr.uid), { role: 'banni' });
        if(editingUser?.uid === usr.uid) setEditingUser(null);
        fetchUsersList();
      } catch (err) {
        console.error("Erreur lors de la révocation.", err);
      }
    });
  };

  const handleDeleteUser = (usr: UserData) => {
    requestConfirm(`ATTENTION: Voulez-vous supprimer définitivement le compte de ${usr.displayName} ? Cette action est irréversible.`, async () => {
      try {
        await deleteDoc(doc(db, 'users', usr.uid));
        if(editingUser?.uid === usr.uid) setEditingUser(null);
        fetchUsersList();
      } catch (err) {
        console.error("Erreur lors de la suppression.", err);
      }
    });
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accNature || !accCategory || !accAmount) return;
    try {
      const newDocRef = doc(collection(db, 'accounting'));
      const newT: any = {
        type: accType,
        nature: accNature,
        category: accCategory,
        amount: parseFloat(accAmount),
        createdAt: Date.now(),
        archived: false
      };
      if (accType === 'recette' && accAssocExpense) {
        newT.associatedExpense = parseFloat(accAssocExpense);
      }
      if (accType === 'recette' && accMemberId) {
        newT.associatedMemberId = accMemberId;
      }
      await setDoc(newDocRef, newT);
      
      setAccNature('');
      setAccCategory('');
      setAccAmount('');
      setAccAssocExpense('');
      setAccMemberId('');
      fetchTransactions();
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  };

  const handleDeleteTransaction = (id: string) => {
    requestConfirm("Êtes-vous sûr de vouloir supprimer cette transaction ?", async () => {
      try {
        await deleteDoc(doc(db, 'accounting', id));
        fetchTransactions();
      } catch (err) {
        console.error("Erreur de suppression.", err);
      }
    });
  };

  const handleSaveStoreItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storePrice || !storeImageUrl) return;
    try {
      if (storeEditingId) {
        await updateDoc(doc(db, 'storeItems', storeEditingId), {
          name: storeName,
          price: storePrice,
          desc: storeDesc,
          imageUrl: storeImageUrl
        });
      } else {
        const newDocRef = doc(collection(db, 'storeItems'));
        await setDoc(newDocRef, {
          name: storeName,
          price: storePrice,
          desc: storeDesc,
          imageUrl: storeImageUrl,
          createdAt: Date.now()
        });
      }
      setStoreName('');
      setStorePrice('');
      setStoreDesc('');
      setStoreImageUrl('');
      setStoreEditingId(null);
      fetchStoreItems();
    } catch (err) {
      alert("Erreur lors de la sauvegarde de l'article.");
    }
  };

  const handleEditStoreItem = (item: StoreItem) => {
    setStoreName(item.name);
    setStorePrice(item.price);
    setStoreDesc(item.desc);
    setStoreImageUrl(item.imageUrl);
    setStoreEditingId(item.id);
  };

  const handleDeleteStoreItem = (id: string) => {
    requestConfirm("Supprimer cet article de la boutique ?", async () => {
      try {
        await deleteDoc(doc(db, 'storeItems', id));
        fetchStoreItems();
      } catch (err) {
        console.error("Erreur de suppression.", err);
      }
    });
  };

  const handleWeeklyClose = () => {
    requestConfirm("Procéder à la clôture hebdomadaire ? Les informations seront placées en archives.", async () => {
      try {
        const batch = writeBatch(db);
        transactions.forEach(t => {
          const docRef = doc(db, 'accounting', t.id);
          batch.update(docRef, { archived: true });
        });
        await batch.commit();
        fetchTransactions();
      } catch(err) {
        console.error("Erreur lors de la clôture.", err);
      }
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const triggerConcierge = (msg: string) => {
    setConciergeMsg(msg);
    setTimeout(() => setConciergeMsg(''), 4000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505] h-screen">
        <Loader2 className="w-12 h-12 text-[#9300c4] animate-spin" />
      </div>
    );
  }

  if (!userData) return null;

  if (userData.role === 'banni') {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505] min-h-[calc(100vh-112px)] p-6 text-center">
         <div className="max-w-xl border border-red-500/20 bg-red-500/5 p-12 relative overflow-hidden">
            <Ban className="w-24 h-24 text-red-500/20 absolute -top-4 -right-4" />
            <h1 className="text-4xl font-oswald text-red-500 uppercase tracking-widest font-black mb-4">ACCÈS RÉVOQUÉ</h1>
            <p className="text-gray-400 font-sans mb-8">Vos privilèges Diamond ont été révoqués par la direction. Vous n'êtes plus autorisé à accéder aux services du complexe.</p>
            <button onClick={handleLogout} className="border border-white/20 px-8 py-3 text-sm font-oswald tracking-widest hover:bg-white hover:text-black uppercase">
              SE DÉCONNECTER
            </button>
         </div>
      </div>
    );
  }

  const getPortalTitle = () => {
    if(userData.role === 'patron') return "PORTAIL EXÉCUTIF";
    if(userData.role === 'employe') return "ACCÈS EXÉCUTIF";
    if(userData.role === 'vip') return "CONCIERGERIE PRIVÉE";
    return "ESPACE CLIENT";
  };

  const getUserNameById = (id: string) => {
    const u = usersList.find(usr => usr.uid === id);
    return u ? u.displayName : "Inconnu";
  };

  const TABS: { id: typeof activeTab, label: string, icon: any, show: boolean }[] = [
    { id: 'overview', label: "VUE D'ENSEMBLE", icon: ShieldAlert, show: true },
    { id: 'chat', label: "CONCIERGERIE & CHAT", icon: MessageSquare, show: userData.role !== 'banni' },
    { id: 'directory', label: "RÉPERTOIRE", icon: Users, show: userData.role === 'patron' || userData.role === 'employe' },
    { id: 'store', label: "GESTION BOUTIQUE", icon: ShoppingCart, show: userData.role === 'patron' },
    { id: 'accounting', label: "COMPTABILITÉ", icon: DollarSign, show: userData.role === 'patron' },
    { id: 'archives', label: "ARCHIVES", icon: Archive, show: userData.role === 'patron' },
    { id: 'penthouseReq', label: "GESTION PENTHOUSES", icon: Home, show: userData.role === 'patron' || userData.role === 'employe' },
    { id: 'myPenthouseReq', label: "DEMANDE PENTHOUSE", icon: Home, show: hasPenthouseReq },
    { id: 'rates', label: "TARIFS ET ADHÉSIONS", icon: Settings, show: userData.role === 'patron' },
    { id: 'profile', label: "MON PROFIL", icon: UserCircle, show: true }
  ].filter(t => t.show);

  // Accounting Calcs
  const totalCA = transactions.reduce((acc, t) => acc + (t.type === 'recette' ? t.amount : 0), 0);
  const totalDepensesEntries = transactions.reduce((acc, t) => acc + (t.type === 'depense' ? t.amount : 0), 0);
  const totalAssocDepenses = transactions.reduce((acc, t) => acc + (t.type === 'recette' && t.associatedExpense ? t.associatedExpense : 0), 0);
  const totalDepenses = totalDepensesEntries + totalAssocDepenses;
  const benefice = totalCA - totalDepenses;

  const archTotalCA = archives.reduce((acc, t) => acc + (t.type === 'recette' ? t.amount : 0), 0);
  const archTotalDep = archives.reduce((acc, t) => acc + (t.type === 'depense' ? t.amount : 0), 0) + archives.reduce((acc, t) => acc + (t.type === 'recette' && t.associatedExpense ? t.associatedExpense : 0), 0);
  const archBenefice = archTotalCA - archTotalDep;

  return (
    <div className="flex w-full bg-[#030303] h-[calc(100vh-5rem)] overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-72 bg-black border-r border-white/10 flex flex-col shrink-0 h-full">
        <div className="px-8 pb-8 pt-8 border-b border-white/5 flex flex-col items-center text-center shrink-0">
           <img src={getAssetUrl("/Diamond 1.1.png")} className="w-24 mb-6 opacity-30 object-contain mx-auto" alt="Diamond logo" />
           <h2 className="text-xl font-oswald uppercase tracking-[0.2em] font-black text-white">{getPortalTitle()}</h2>
           <p className="text-xs font-sans text-[#9300c4] mt-1 tracking-widest uppercase">{userData.role}</p>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-4 overflow-y-auto min-h-0">
           {TABS.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center justify-start gap-4 px-4 py-4 text-sm font-oswald uppercase tracking-widest transition-all ${
                 activeTab === tab.id ? 'bg-[#9300c4]/10 text-white border-l-2 border-[#9300c4]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-l-2 border-transparent'
               }`}
             >
               <tab.icon className="w-5 h-5 shrink-0" />
               <span className="truncate">{tab.label}</span>
             </button>
           ))}
        </div>
        <div className="p-4 border-t border-white/5 shrink-0">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-start gap-4 px-4 py-4 text-sm font-oswald uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
           >
             <LogOut className="w-5 h-5 shrink-0" />
             DÉCONNEXION
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto w-full relative bg-[#030303] min-w-0 p-6 lg:p-12">
        <AnimatePresence mode="wait">
          
          {activeTab === 'overview' && (
            <OverviewTab userData={userData} triggerConcierge={triggerConcierge} />
          )}

          {activeTab === 'chat' && (
            <ChatTab userData={userData} usersList={usersList} requestConfirm={requestConfirm} />
          )}

          {activeTab === 'directory' && (
            <DirectoryTab 
              userData={userData} usersList={usersList} 
              openEditUser={openEditUser} handleRevokeUser={handleRevokeUser} handleDeleteUser={handleDeleteUser}
              handleCreateUser={handleCreateUser}
              createName={createName} setCreateName={setCreateName}
              createEmail={createEmail} setCreateEmail={setCreateEmail}
              createPassword={createPassword} setCreatePassword={setCreatePassword}
              createRole={createRole} setCreateRole={setCreateRole}
              createVipTier={createVipTier} setCreateVipTier={setCreateVipTier}
              createStatus={createStatus} createLoading={createLoading}
            />
          )}

          {activeTab === 'store' && userData.role === 'patron' && (
            <StoreTab 
              storeItems={storeItems}
              storeName={storeName} setStoreName={setStoreName}
              storePrice={storePrice} setStorePrice={setStorePrice}
              storeImageUrl={storeImageUrl} setStoreImageUrl={setStoreImageUrl}
              storeDesc={storeDesc} setStoreDesc={setStoreDesc}
              storeEditingId={storeEditingId} setStoreEditingId={setStoreEditingId}
              handleSaveStoreItem={handleSaveStoreItem}
              handleEditStoreItem={handleEditStoreItem}
              handleDeleteStoreItem={handleDeleteStoreItem}
            />
          )}

          {activeTab === 'accounting' && userData.role === 'patron' && (
            <AccountingTab 
              transactions={transactions}
              expandedTxId={expandedTxId} setExpandedTxId={setExpandedTxId}
              getUserNameById={getUserNameById}
              handleDeleteTransaction={handleDeleteTransaction}
              handleWeeklyClose={handleWeeklyClose}
              handleAddTransaction={handleAddTransaction}
              accType={accType} setAccType={setAccType}
              accNature={accNature} setAccNature={setAccNature}
              accCategory={accCategory} setAccCategory={setAccCategory}
              accAmount={accAmount} setAccAmount={setAccAmount}
              accAssocExpense={accAssocExpense} setAccAssocExpense={setAccAssocExpense}
              accMemberId={accMemberId} setAccMemberId={setAccMemberId}
              usersList={usersList}
              totalCA={totalCA} totalDepenses={totalDepenses} benefice={benefice}
            />
          )}

          {activeTab === 'archives' && userData.role === 'patron' && (
            <ArchivesTab 
              archives={archives}
              expandedTxId={expandedTxId} setExpandedTxId={setExpandedTxId}
              getUserNameById={getUserNameById}
              archTotalCA={archTotalCA} archTotalDep={archTotalDep} archBenefice={archBenefice}
            />
          )}

          {activeTab === 'penthouseReq' && (userData.role === 'patron' || userData.role === 'employe') && (
            <PenthouseRequestsTab userData={userData} />
          )}

          {activeTab === 'myPenthouseReq' && hasPenthouseReq && (
            <MyPenthouseReqTab userId={userData.uid} />
          )}

          {activeTab === 'rates' && userData.role === 'patron' && (
            <RatesTab 
              prices={prices} setPrices={setPrices}
              handleSavePrices={handleSavePrices} savePriceStatus={savePriceStatus}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab 
              userData={userData}
              profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto}
              handleSaveProfilePhoto={handleSaveProfilePhoto} profileSaveStatus={profileSaveStatus}
            />
          )}

          <ConfirmModal 
            isOpen={confirmConfig.isOpen}
            message={confirmConfig.message}
            onConfirm={confirmConfig.onConfirm}
            onCancel={() => setConfirmConfig(prev => ({...prev, isOpen: false}))}
          />
        </AnimatePresence>
      </div>

      {/* Edit User Modal */}
      {userData.role === 'patron' && editingUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#050505] border border-white/20 p-8 w-full max-w-md shadow-2xl relative"
          >
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-oswald uppercase tracking-widest font-black text-white mb-6">ÉDITION DU COMPTE</h3>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Email</label>
                 <div className="w-full bg-black border border-white/10 text-gray-500 px-3 py-2 font-sans text-sm">{editingUser.email}</div>
              </div>
              <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Nom Complet</label>
                 <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:border-white transition-colors" />
              </div>
              <div>
                 <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Autorisation / Rôle</label>
                 <select value={editRole} onChange={e => setEditRole(e.target.value as any)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:border-white transition-colors appearance-none">
                   <option value="client">Client Standard</option>
                   <option value="vip">Client VIP (Platinum)</option>
                   <option value="employe">Employé (Accès Exécutif)</option>
                   <option value="patron">Patron (Admin Global)</option>
                   <option value="banni" className="text-red-500">Banni / Révoqué</option>
                 </select>
              </div>
              <label className="flex items-center gap-3 w-full bg-black border border-white/20 px-3 py-2 cursor-pointer mt-2">
                <input type="checkbox" checked={editIsVip} onChange={e => setEditIsVip(e.target.checked)} className="w-4 h-4 accent-[#9300c4]" />
                <span className="font-oswald text-gray-300 uppercase tracking-widest text-xs">A les privilèges VIP</span>
              </label>
              {(editRole === 'vip' || editIsVip) && (
                <div>
                   <label className="block text-[10px] font-oswald text-gray-500 tracking-[0.2em] uppercase mb-1">Niveau VIP</label>
                   <select value={editVipTier} onChange={e => setEditVipTier(e.target.value as any)} className="w-full bg-black border border-white/20 text-white px-3 py-2 font-sans text-sm focus:border-white transition-colors appearance-none mt-1">
                     <option value="silver">Silver</option>
                     <option value="gold">Gold</option>
                     <option value="diamond">Diamond</option>
                   </select>
                </div>
              )}
              <button onClick={saveEditUser} className="w-full block text-center border border-white bg-white text-black font-oswald uppercase tracking-widest text-sm py-3 mt-8 hover:bg-black hover:text-white transition-all duration-300">
                APPLIQUER LES MODIFICATIONS
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
