import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiaTextRevealProps {
  text: string | string[];
  repeat?: boolean;
  repeatDelay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'span' | 'div';
}

export const DiaTextReveal: React.FC<DiaTextRevealProps> = ({
  text,
  repeat = true,
  repeatDelay = 2.0,
  duration = 0.6,
  className = '',
  as = 'span'
}) => {
  const phrases = Array.isArray(text) ? text : [text];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!repeat || phrases.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, (duration + repeatDelay + 1.2) * 1000);

    return () => clearInterval(interval);
  }, [phrases.length, repeat, repeatDelay, duration]);

  const currentText = phrases[currentIndex];

  const content = (
    <span className={`inline-flex items-center relative min-h-[1.35em] overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currentIndex}
          className="inline-block whitespace-nowrap text-primary font-bold"
          initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1] // Apple spring-like ease-out curve
          }}
        >
          <span className="relative">
            {currentText}
            {/* Sutil línea de acento botánico artesanal */}
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-secondary/35 rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );

  if (as === 'h1') return <h1 className={className}>{content}</h1>;
  if (as === 'h2') return <h2 className={className}>{content}</h2>;
  return content;
};

export default DiaTextReveal;
