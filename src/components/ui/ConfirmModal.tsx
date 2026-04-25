import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Check, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#050505] border border-white/20 p-8 w-full max-w-md shadow-2xl relative flex flex-col items-center text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-oswald uppercase tracking-widest font-black text-white mb-4">Confirmation</h3>
            <p className="font-sans text-gray-400 text-sm mb-8">{message}</p>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 border border-white/20 bg-transparent text-white font-oswald uppercase tracking-widest text-sm py-3 hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-4 h-4" /> Annuler
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-red-500 bg-red-500/10 text-red-500 font-oswald uppercase tracking-widest text-sm py-3 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <Check className="w-4 h-4" /> Confirmer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
