import React from 'react';
import { motion } from 'motion/react';
import { getAssetUrl } from '../lib/utils';

interface SplitSectionProps {
  key?: React.Key;
  label: string;
  title: string;
  description: string;
  bgUrl: string;
  imagePosition?: 'left' | 'right';
  overlayClass?: string;
}

export default function SplitSection({
  label,
  title,
  description,
  bgUrl,
  imagePosition = 'right',
  overlayClass
}: SplitSectionProps) {
  const isRight = imagePosition === 'right';

  const defaultOverlay = isRight
    ? 'bg-gradient-to-t md:bg-gradient-to-r from-[#0d001a]/95 via-[#30004a]/70 to-[#0d001a]/30 md:to-transparent'
    : 'bg-gradient-to-t md:bg-gradient-to-l from-[#0d001a]/95 via-[#30004a]/70 to-[#0d001a]/30 md:to-transparent';

  return (
    <div className="relative min-h-[60vh] w-full flex items-center md:items-center bg-black overflow-hidden group border-t border-white/10">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className={`absolute inset-0 bg-cover bg-center`}
        style={{ backgroundImage: `url('${getAssetUrl(bgUrl)}')` }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className={`absolute inset-0 ${overlayClass || defaultOverlay}`} />

      {/* Content */}
      <div className={`relative z-10 w-full px-6 md:px-12 lg:px-24 mx-auto max-w-[1700px] flex ${isRight ? 'justify-start md:justify-start' : 'justify-start md:justify-end'} pt-48 pb-12 md:py-24`}>
        <motion.div 
          initial={{ opacity: 0, x: isRight ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.2, 1] }}
          className="max-w-xl w-full"
        >
          <div className={`flex items-center mb-4 md:mb-6 border-white/20 pb-4 ${!isRight ? 'md:justify-end border-b' : 'border-b'}`}>
             {!isRight ? (
                 <>
                   <span className="font-oswald tracking-[0.2em] text-xs md:text-sm uppercase md:mr-4 text-gray-300 font-bold hidden md:inline-block">
                     {label}
                   </span>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#9300c4] hidden md:block"></div>

                   {/* Mobile version for left aligned gradient on mobile even if isRight is false */}
                   <div className="w-1.5 h-1.5 rounded-full bg-[#9300c4] md:hidden mr-4"></div>
                   <span className="font-oswald tracking-[0.2em] text-xs uppercase text-gray-300 font-bold md:hidden">
                     {label}
                   </span>
                 </>
             ) : (
                 <>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#9300c4] mr-4"></div>
                   <span className="font-oswald tracking-[0.2em] text-xs md:text-sm uppercase text-gray-300 font-bold">
                     {label}
                   </span>
                 </>
             )}
          </div>
          
          <h2 className={`font-oswald text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-6 md:mb-8 leading-[0.95] ${!isRight ? 'md:text-right' : ''}`}>
            {title}
          </h2>
          
          <p className={`font-sans text-base md:text-lg text-gray-300 leading-relaxed font-light ${!isRight ? 'md:text-right' : ''}`}>
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
