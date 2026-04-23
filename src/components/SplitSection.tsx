import React from 'react';
import { motion } from 'motion/react';

interface SplitSectionProps {
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
    ? 'bg-gradient-to-r from-[#0d001a]/95 via-[#30004a]/70 to-transparent'
    : 'bg-gradient-to-l from-[#0d001a]/95 via-[#30004a]/70 to-transparent';

  return (
    <div className="relative min-h-[60vh] w-full flex items-center bg-black overflow-hidden group border-t border-white/10">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className={`absolute inset-0 bg-cover bg-center`}
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className={`absolute inset-0 ${overlayClass || defaultOverlay}`} />

      {/* Content */}
      <div className={`relative z-10 w-full px-8 md:px-24 mx-auto max-w-[1700px] flex ${isRight ? 'justify-start' : 'justify-end'} py-24`}>
        <motion.div 
          initial={{ opacity: 0, x: isRight ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.2, 1] }}
          className="max-w-xl"
        >
          <div className={`flex items-center mb-6 border-white/20 pb-4 ${!isRight ? 'justify-end border-b' : 'border-b'}`}>
             {!isRight ? (
                 <>
                   <span className="font-oswald tracking-[0.2em] text-sm uppercase mr-4 text-gray-300 font-bold">
                     {label}
                   </span>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#9300c4]"></div>
                 </>
             ) : (
                 <>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#9300c4] mr-4"></div>
                   <span className="font-oswald tracking-[0.2em] text-sm uppercase text-gray-300 font-bold">
                     {label}
                   </span>
                 </>
             )}
          </div>
          
          <h2 className={`font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-8 leading-[0.95] ${!isRight ? 'text-right' : ''}`}>
            {title}
          </h2>
          
          <p className={`font-sans text-base md:text-lg text-gray-300 leading-relaxed font-light ${!isRight ? 'text-right' : ''}`}>
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
