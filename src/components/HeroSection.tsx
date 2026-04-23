import React from 'react';
import { motion } from 'motion/react';
import { getAssetUrl } from '../lib/utils';

interface HeroSectionProps {
  label: string;
  title: React.ReactNode;
  description: React.ReactNode;
  bgUrl?: string;
  videoUrl?: string;
  overlayClass?: string;
  className?: string;
  textAlign?: 'left' | 'right' | 'center';
}

export default function HeroSection({
  label,
  title,
  description,
  bgUrl = 'https://images.unsplash.com/photo-1596245842838-8d266aa649ee?auto=format&fit=crop&q=80',
  videoUrl,
  overlayClass,
  className = '',
  textAlign = 'left'
}: HeroSectionProps) {

  // Custom gradient based on text align to ensure readability without overpowering the image with purple
  const defaultOverlay = textAlign === 'left' 
    ? 'bg-gradient-to-r from-[#0d001a]/95 via-[#2a0040]/60 to-transparent'
    : textAlign === 'right'
    ? 'bg-gradient-to-l from-[#0d001a]/95 via-[#2a0040]/60 to-transparent'
    : 'bg-gradient-to-b from-[#0d001a]/40 via-[#0d001a]/80 to-[#0d001a]/95';

  const fadeDirection = textAlign === 'left' ? -30 : textAlign === 'right' ? 30 : 0;
  const fadeUp = textAlign === 'center' ? 30 : 0;

  return (
    <div className={`relative min-h-[85vh] w-full flex items-center bg-[#050505] overflow-hidden ${className}`}>
      {/* Background Asset */}
      {videoUrl ? (
        <video 
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${getAssetUrl(bgUrl)}')` }}
        />
      )}
      
      {/* Gradient for text readability */}
      <div className={`absolute inset-0 ${overlayClass || defaultOverlay}`} />

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-8 w-full ${textAlign === 'center' ? 'pt-20' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: fadeDirection, y: fadeUp }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.2, 1] }}
          className={`max-w-2xl ${textAlign === 'right' ? 'ml-auto' : textAlign === 'center' ? 'mx-auto text-center' : ''}`}
        >
          
          <div className={`flex items-center mb-6 uppercase tracking-[0.2em] text-sm text-gray-300 font-bold ${textAlign === 'center' ? 'justify-center' : ''}`}>
            {textAlign !== 'center' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="h-[2px] bg-[#9300c4] mr-4"
              />
            )}
            <span>{label}</span>
            {textAlign === 'center' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="h-[2px] bg-[#9300c4] ml-4"
              />
            )}
          </div>
          
          <h1 className={`font-oswald text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.95] mb-8 ${textAlign === 'center' ? '' : 'text-shadow-2xl shadow-black'}`}>
            {title}
          </h1>
          
          <div className="font-sans text-lg text-gray-200 leading-relaxed font-light">
            {description}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
