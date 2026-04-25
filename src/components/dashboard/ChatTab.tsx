import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { collection, doc, query, onSnapshot, orderBy, setDoc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Send, UserCircle, Bell, BellOff, MessageSquare, Check, CheckCheck, Trash2, Edit2, X } from 'lucide-react';

export default function ChatTab({ userData, usersList, requestConfirm }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isStaff = userData.role === 'patron' || userData.role === 'employe';

  // For Staff: listen to all chats. For client: listen only to their own chat based on UID.
  useEffect(() => {
    if (isStaff) {
      const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        const c = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setChats(c);
      });
      return () => unsub();
    } else {
      // Just set selected chat to their own chat
      setSelectedChat({ id: userData.uid });
    }
  }, [isStaff, userData.uid]);

  // Listen to messages of the selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const q = query(collection(db, `chats/${selectedChat.id}/messages`), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      // If it's staff looking, reset unread for this chat
      if (isStaff && selectedChat.id !== '') {
        updateDoc(doc(db, 'chats', selectedChat.id), { unreadCount: 0 }).catch(()=>console.log("Chat doc doesn't exist yet"));
      }
    });

    return () => unsub();
  }, [selectedChat, isStaff]);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio disabled', e);
    }
  };

  const staffQuickReplies = [
    "Votre véhicule vous attend à l'entrée principale.",
    "Votre Penthouse a été préparé.",
    "Votre réservation pour ce soir est confirmée.",
    "J'envoie un agent vers vous immédiatement."
  ];

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
  };

  // Audio notification
  useEffect(() => {
    // Only listen if there's a selected chat (client has only 1 chat anyway)
    // Actually, client may not have selectedChat set yet depending on effect timing
    const chatId = isStaff ? null : userData.uid;
    if (!isStaff) {
      if (!chatId) return;
      const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'asc'));
      const unsub = onSnapshot(q, (snap) => {
        snap.docChanges().forEach(change => {
           if (change.type === 'added') {
              const data = change.doc.data();
              if (data.senderId !== userData.uid && !isMuted && data.createdAt > Date.now() - 10000) {
                 playBeep();
              }
           }
        });
      });
      return () => unsub();
    } else {
      const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        snap.docChanges().forEach(change => {
          if (change.type === 'modified') {
            const data = change.doc.data();
            if (data.unreadCount > 0 && !isMuted) {
              playBeep();
            }
          }
        });
      });
      return () => unsub();
    }
  }, [isStaff, isMuted, userData.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const chatRef = doc(db, 'chats', selectedChat.id);
      
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
         await setDoc(chatRef, {
           lastMessageTime: Date.now(),
           lastMessage: newMessage,
           unreadCount: 1,
         });
      } else {
         await updateDoc(chatRef, {
           lastMessageTime: Date.now(),
           lastMessage: newMessage,
           unreadCount: isStaff ? 0 : (chatDoc.data().unreadCount || 0) + 1
         });
      }

      const msgRef = doc(collection(db, `chats/${selectedChat.id}/messages`));
      await setDoc(msgRef, {
        senderId: userData.uid,
        text: newMessage,
        createdAt: Date.now()
      });

      setNewMessage('');
    } catch(err) {
      console.error(err);
    }
  };

  const handleEditMessage = async (msgId: string) => {
    if (!editMessageText.trim() || !selectedChat) return;
    try {
      await updateDoc(doc(db, `chats/${selectedChat.id}/messages`, msgId), {
        text: editMessageText,
        editedAt: Date.now()
      });
      setEditingMessageId(null);
      setEditMessageText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!selectedChat) return;
    requestConfirm("Voulez-vous vraiment supprimer ce message ?", async () => {
      try {
        await deleteDoc(doc(db, `chats/${selectedChat.id}/messages`, msgId));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const getUserName = (uid: string) => {
    if (uid === userData.uid) return userData.displayName;
    const u = usersList.find((u:any) => u.uid === uid);
    if (!isStaff && u && (u.role === 'patron' || u.role === 'employe')) {
      return 'Service Conciergerie';
    }
    return u ? u.displayName : 'Inconnu';
  };

  const getUserPhoto = (uid: string) => {
    if (uid === userData.uid) return userData.photoURL;
    const u = usersList.find((u:any) => u.uid === uid);
    if (!isStaff && u && (u.role === 'patron' || u.role === 'employe')) {
      return undefined; // use default conciergerie icon
    }
    return u ? u.photoURL : undefined;
  };

  const getVipTier = (uid: string) => {
    const u = usersList.find((u:any) => u.uid === uid);
    return u?.role === 'vip' ? u.vipTier : null;
  };

  return (
    <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
       <div className="flex items-center justify-between shrink-0 mb-6 border-l-4 border-blue-500 pl-4">
         <h2 className="text-3xl font-oswald uppercase tracking-widest font-black text-white">SERVICE CLIENT & CONCIERGERIE</h2>
         <button 
           onClick={() => setIsMuted(!isMuted)} 
           className="px-4 py-2 border border-white/10 flex items-center gap-2 hover:bg-white/5 transition-colors"
         >
           {isMuted ? <BellOff className="w-4 h-4 text-gray-500" /> : <Bell className="w-4 h-4 text-blue-500" />}
           <span className={`text-xs font-oswald tracking-widest uppercase ${isMuted ? 'text-gray-500' : 'text-blue-500'}`}>
             {isMuted ? 'Notifications Off' : 'Notifications On'}
           </span>
         </button>
       </div>

       <div className="flex-1 flex gap-6 overflow-hidden min-h-0 border border-white/10 bg-black">
         {/* Sidebar for staff only */}
         {isStaff && (
           <div className="w-1/3 border-r border-white/10 flex flex-col">
             <div className="p-4 border-b border-white/10 bg-white/5 font-oswald text-sm uppercase tracking-widest text-gray-400 font-bold">
               Conversations
             </div>
             <div className="flex-1 overflow-y-auto">
               {chats.map(chat => {
                 const clName = getUserName(chat.id);
                 const vTier = getVipTier(chat.id);
                 return (
                   <button 
                     key={chat.id} 
                     onClick={() => setSelectedChat(chat)}
                     className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center justify-between ${selectedChat?.id === chat.id ? 'bg-[#9300c4]/10' : ''}`}
                   >
                     <div className="truncate pr-4">
                       <p className="font-sans text-sm text-white font-medium truncate flex items-center gap-2">
                         {clName}
                         {vTier && <span className="text-[10px] font-oswald uppercase text-amber-500 tracking-wider">[{vTier}]</span>}
                       </p>
                       <p className="font-sans text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                     </div>
                     {chat.unreadCount > 0 && selectedChat?.id !== chat.id && (
                       <span className="shrink-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                         {chat.unreadCount}
                       </span>
                     )}
                   </button>
                 );
               })}
             </div>
           </div>
         )}

         {/* Main Chat Area */}
         <div className="flex-1 flex flex-col">
           {selectedChat ? (
             <>
               <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center overflow-hidden">
                     {getUserPhoto(selectedChat.id) ? (
                       <img src={getUserPhoto(selectedChat.id)} alt="avatar" className="w-full h-full object-cover" />
                     ) : (
                       <UserCircle className="w-6 h-6 text-gray-400" />
                     )}
                   </div>
                   <div>
                     <p className="font-oswald text-lg text-white uppercase tracking-widest flex items-center gap-2">
                       {isStaff ? getUserName(selectedChat.id) : 'Ligne Directe Conciergerie'}
                       {isStaff && getVipTier(selectedChat.id) && (
                         <span className="text-xs text-amber-500 tracking-widest border border-amber-500/50 px-2 py-0.5 ml-2">
                           {getVipTier(selectedChat.id)}
                         </span>
                       )}
                     </p>
                     <p className="font-sans text-xs text-gray-500">Service disponible 24/7 pour les membres Diamond</p>
                   </div>
                 </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {messages.map(msg => {
                   const isMe = msg.senderId === userData.uid;
                   const isMsgStaff = usersList.find(u => u.uid === msg.senderId)?.role === 'patron' || usersList.find(u => u.uid === msg.senderId)?.role === 'employe';
                   const canDelete = isMe || (userData.role === 'patron' && isMsgStaff);
                   const canEdit = isMe;
                   const avatar = getUserPhoto(msg.senderId);
                   return (
                     <div key={msg.id} className={`flex gap-3 max-w-[80%] group ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                       <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-white/20 overflow-hidden flex items-center justify-center mt-4">
                         {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircle className="w-5 h-5 text-gray-400" />}
                       </div>
                       <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}>
                         <div className="flex items-center gap-2 mb-1 px-1">
                           <span className="text-[10px] uppercase font-oswald tracking-wider text-gray-500">
                             {getUserName(msg.senderId)}
                           </span>
                           <span className="text-[10px] font-sans text-gray-600">
                             {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                           {msg.editedAt && (
                             <span className="text-[10px] font-sans text-gray-600">(Modifié)</span>
                           )}
                         </div>
                         
                         {editingMessageId === msg.id ? (
                           <div className="flex flex-col gap-2 w-full min-w-[250px]">
                             <textarea 
                               value={editMessageText} 
                               onChange={e => setEditMessageText(e.target.value)} 
                               className="w-full bg-black border border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white transition-colors resize-none"
                               rows={3}
                             />
                             <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingMessageId(null)} className="p-1 hover:bg-white/10 text-gray-400"><X className="w-4 h-4" /></button>
                               <button onClick={() => handleEditMessage(msg.id)} className="p-1 hover:bg-white/10 text-green-400"><Check className="w-4 h-4" /></button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex items-start gap-2 relative">
                             {isMe && (
                               <div className="absolute right-full top-0 mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                 {canEdit && (
                                   <button onClick={() => { setEditingMessageId(msg.id); setEditMessageText(msg.text); }} className="p-1.5 text-gray-500 hover:text-white bg-black border border-white/10 shadow-lg">
                                     <Edit2 className="w-3 h-3" />
                                   </button>
                                 )}
                                 {canDelete && (
                                   <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-red-500/70 hover:text-red-500 bg-black border border-red-500/10 shadow-lg">
                                     <Trash2 className="w-3 h-3" />
                                   </button>
                                 )}
                               </div>
                             )}
                             {!isMe && canDelete && (
                                <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                  <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-red-500/70 hover:text-red-500 bg-black border border-red-500/10 shadow-lg">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                             )}
                             <div className={`p-4 text-sm font-sans rounded-xl whitespace-pre-wrap ${isMe ? 'bg-[#9300c4] text-white rounded-tr-none' : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'}`}>
                               {msg.text}
                             </div>
                           </div>
                         )}

                         {isMe && selectedChat.id === userData.uid && !editingMessageId && (
                           <div className="mt-1 px-1">
                             {selectedChat.unreadCount === 0 ? (
                               <CheckCheck className="w-3 h-3 text-blue-400" />
                             ) : (
                               <Check className="w-3 h-3 text-gray-600" />
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}
                 <div ref={messagesEndRef} />
               </div>

               <div className="p-4 border-t border-white/10 bg-[#0a0a0a] shrink-0 flex flex-col gap-3">
                 {isStaff && (
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                     {staffQuickReplies.map((reply, i) => (
                       <button
                         key={i}
                         onClick={() => handleQuickReply(reply)}
                         className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-xs font-sans transition-colors"
                       >
                         {reply}
                       </button>
                     ))}
                   </div>
                 )}
                 <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
                   <textarea 
                     value={newMessage}
                     onChange={e => setNewMessage(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSendMessage(e as any);
                       }
                     }}
                     placeholder="Écrivez votre message..." 
                     className="flex-1 bg-black border border-white/10 text-white px-4 py-3 font-sans text-sm focus:outline-none focus:border-white transition-colors resize-none max-h-32"
                     rows={newMessage.split('\n').length > 1 ? Math.min(newMessage.split('\n').length, 5) : 1}
                   />
                   <button type="submit" disabled={!newMessage.trim()} className="h-11 px-6 border border-blue-500 bg-blue-500/10 text-blue-400 font-oswald uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                     <Send className="w-5 h-5" />
                   </button>
                 </form>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-sans p-6 text-center">
               <MessageSquare className="w-16 h-16 text-white/5 mb-4" />
               <p className="font-oswald uppercase tracking-widest text-lg text-white">Aucune Sélection</p>
               <p className="text-sm mt-2">Sélectionnez une conversation dans la liste pour afficher ou envoyer des messages.</p>
             </div>
           )}
         </div>

       </div>
    </motion.div>
  );
}
