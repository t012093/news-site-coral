import React from 'react';
import { motion, MotionProps, useReducedMotion } from 'framer-motion';

interface PerformantMotionProps extends MotionProps {
  children: React.ReactNode;
  enableGPU?: boolean;
  prefersReducedMotion?: boolean;
}

// Optimized motion component that respects user preferences and performance
export const PerformantMotion: React.FC<PerformantMotionProps> = ({
  children,
  enableGPU = true,
  prefersReducedMotion,
  style,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion || shouldReduceMotion;

  // GPU acceleration styles
  const gpuStyles = enableGPU ? {
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  } : {};

  // If user prefers reduced motion, return static element
  if (reduceMotion) {
    return (
      <div style={{ ...style, ...gpuStyles }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={{ ...style, ...gpuStyles }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Optimized animations presets
export const optimizedAnimations = {
  // Lightweight fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  // Minimal slide up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },

  // Performance-optimized hover
  hover: {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Lightweight card hover
  cardHover: {
    whileHover: { y: -2 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Reduced planetary rotation (less CPU intensive)
  lightRotation: {
    animate: { rotate: 360 },
    transition: { 
      duration: 60, // Slower rotation
      repeat: Infinity, 
      ease: 'linear',
      repeatType: 'loop' as const
    }
  },

  // Simplified floating animation
  lightFloat: {
    animate: { y: [-1, 1, -1] },
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: 'easeInOut',
      repeatType: 'loop' as const
    }
  }
};

// Hook for conditional animations based on performance
export const usePerformantAnimation = (heavyAnimation: any, lightAnimation: any) => {
  const shouldReduceMotion = useReducedMotion();
  const isLowPerformance = typeof navigator !== 'undefined' && 
    (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 4);

  if (shouldReduceMotion || isLowPerformance) {
    return lightAnimation;
  }
  
  return heavyAnimation;
};

export default PerformantMotion;