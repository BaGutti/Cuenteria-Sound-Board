'use client';

import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { soundButtons } from '@/lib/sounds';
import SoundButton from '@/components/SoundButton';
import { motion } from 'framer-motion';

export default function ClientPage() {
  const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());
  const { emitSound, isConnected } = useSocket();

  const handleButtonPress = (soundId: string) => {
    emitSound(soundId);

    setPressedButtons(prev => new Set([...prev, soundId]));

    setTimeout(() => {
      setPressedButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">🎮 Control de Sonidos</h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-300 text-sm">
            {isConnected ? 'Conectado al host' : 'Conectando...'}
          </span>
        </div>
        <p className="text-gray-400 text-sm px-4">
          Presiona los botones para activar efectos de sonido durante la cuentería
        </p>
      </motion.div>

      {/* Connection status banner */}
      {!isConnected && (
        <motion.div
          className="bg-yellow-600 text-yellow-100 p-3 rounded-lg mb-6 text-center text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ⚠️ Conectando con el servidor... Espera un momento
        </motion.div>
      )}

      {/* Sound buttons grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {soundButtons.map((button, index) => (
          <motion.div
            key={button.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SoundButton
              button={button}
              onPress={handleButtonPress}
              isPressed={pressedButtons.has(button.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mt-8 text-center text-gray-400 text-xs max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">💡 Instrucciones</h3>
          <ul className="text-left space-y-1">
            <li>• Presiona los botones cuando el narrador mencione elementos relacionados</li>
            <li>• Los sonidos se reproducirán automáticamente en el dispositivo host</li>
            <li>• ¡Diviértete creando atmósfera para la historia!</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}