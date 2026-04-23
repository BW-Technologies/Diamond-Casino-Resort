import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { getAssetUrl } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  image?: string;
}

export default function Modal({ isOpen, onClose, title, children, image }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] shadow-2xl"
          >
            {image && (
              <div className="w-full h-72 md:h-96 relative">
                <img src={getAssetUrl(image)} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
            )}
            <div className="p-8 md:p-14 relative">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={36} strokeWidth={1} />
              </button>
              <h2 className="font-oswald text-4xl md:text-6xl uppercase tracking-widest mb-10 text-white font-black">{title}</h2>
              <div className="font-sans text-gray-300 space-y-6 font-light leading-relaxed text-lg">
                {children}
              </div>
            </div>
            {/* Elegant bottom border */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#9300c4] to-transparent opacity-50" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
