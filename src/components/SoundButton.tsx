'use client';

import { motion } from 'framer-motion';
import { SoundButton as SoundButtonType } from '@/types/sound';

interface SoundButtonProps {
  button: SoundButtonType;
  onPress: (soundId: string) => void;
  isPressed?: boolean;
}

export default function SoundButton({ button, onPress, isPressed }: SoundButtonProps) {
  const handlePress = () => {
    onPress(button.id);
  };

  return (
    <motion.button
      className={`
        ${button.color}
        relative overflow-hidden
        rounded-2xl p-6
        text-white font-bold text-lg
        shadow-lg
        active:scale-95
        transition-all duration-150
        min-h-[120px] w-full
        flex flex-col items-center justify-center gap-2
        touch-manipulation
        select-none
      `}
      onClick={handlePress}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      animate={isPressed ? {
        scale: [1, 1.1, 1],
        rotate: [0, -2, 2, 0]
      } : {}}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white opacity-30 rounded-2xl"
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* Emoji */}
      <motion.div
        className="text-4xl mb-1"
        animate={isPressed ? {
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.4 }}
      >
        {button.emoji}
      </motion.div>

      {/* Label */}
      <motion.div
        className="text-center text-sm font-medium"
        animate={isPressed ? {
          y: [0, -5, 0]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {button.label}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(45deg, ${button.color.includes('cyan') ? '#06b6d4' :
                                               button.color.includes('yellow') ? '#eab308' :
                                               button.color.includes('blue') ? '#3b82f6' :
                                               button.color.includes('red') ? '#ef4444' :
                                               button.color.includes('green') ? '#22c55e' :
                                               button.color.includes('orange') ? '#f97316' :
                                               button.color.includes('amber') ? '#f59e0b' :
                                               button.color.includes('gray') ? '#6b7280' :
                                               button.color.includes('purple') ? '#a855f7' :
                                               button.color.includes('pink') ? '#ec4899' : '#06b6d4'}, transparent)`
        }}
        animate={isPressed ? {
          opacity: [0, 0.4, 0]
        } : {}}
        transition={{ duration: 0.6 }}
      />

      {/* Pulse ring when pressed */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 border-4 border-white rounded-2xl"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </motion.button>
  );
}