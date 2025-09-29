'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { soundButtons, storyModes } from '@/lib/sounds';
import SoundButton from '@/components/SoundButton';
import { motion } from 'framer-motion';
import { SoundButton as SoundButtonType } from '@/types/sound';

export default function ClientPage() {
  const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());
  const [isProcessingFadeOut, setIsProcessingFadeOut] = useState(false);
  const [currentStoryMode, setCurrentStoryMode] = useState('generic');
  const [currentButtons, setCurrentButtons] = useState<SoundButtonType[]>(soundButtons);
  const { emitSound, emitFadeOut, emitStopAll, isConnected, socket } = useSocket();

  // Update buttons when story mode changes
  useEffect(() => {
    const mode = storyModes.find(m => m.id === currentStoryMode);
    if (mode) {
      setCurrentButtons(mode.buttons);
    }
  }, [currentStoryMode]);

  // Listen for story mode changes
  useEffect(() => {
    if (!socket) return;

    const handleStoryModeChanged = (modeId: string) => {
      console.log(`📖 Client received story mode change: ${modeId}`);
      setCurrentStoryMode(modeId);
    };

    socket.on('storyModeChanged', handleStoryModeChanged);

    return () => {
      socket.off('storyModeChanged', handleStoryModeChanged);
    };
  }, [socket]);

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

  const handleFadeOut = () => {
    console.log('🎚️ BUTTON CLICKED: Fade out button pressed');
    setIsProcessingFadeOut(true);
    emitFadeOut(2000);

    // Reset the processing state after fade out duration
    setTimeout(() => {
      setIsProcessingFadeOut(false);
    }, 2500);
  };

  const handleStopAll = () => {
    console.log('⏹️ BUTTON CLICKED: Stop all button pressed');
    emitStopAll();
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

      {/* Audio Controls */}
      {isConnected && (
        <motion.div
          className="flex gap-3 mb-6 justify-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handleFadeOut}
            disabled={isProcessingFadeOut}
            className={`
              px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2
              ${!isProcessingFadeOut
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
            whileHover={!isProcessingFadeOut ? { scale: 1.05 } : {}}
            whileTap={!isProcessingFadeOut ? { scale: 0.95 } : {}}
          >
            {isProcessingFadeOut ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Fade Out...
              </>
            ) : (
              <>
                🎚️ Fade Out
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleStopAll}
            disabled={isProcessingFadeOut}
            className={`
              px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300
              ${!isProcessingFadeOut
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
            whileHover={!isProcessingFadeOut ? { scale: 1.05 } : {}}
            whileTap={!isProcessingFadeOut ? { scale: 0.95 } : {}}
          >
            ⏹️ Stop All
          </motion.button>
        </motion.div>
      )}

      {/* Story Mode Indicator */}
      {isConnected && (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-xs text-gray-400">Modo Activo:</p>
            <p className="text-white font-medium">
              {storyModes.find(m => m.id === currentStoryMode)?.name}
            </p>
          </div>
        </motion.div>
      )}

      {/* Sound buttons grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {currentButtons.map((button, index) => (
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
            <li>• Usa &quot;🎚️ Fade Out&quot; para transiciones suaves entre escenas</li>
            <li>• Usa &quot;⏹️ Stop All&quot; para parar todos los sonidos inmediatamente</li>
            <li>• ¡Diviértete creando atmósfera para la historia!</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}