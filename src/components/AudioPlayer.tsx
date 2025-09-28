'use client';

import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { useSocket } from '@/hooks/useSocket';
import { soundButtons } from '@/lib/sounds';
import { motion } from 'framer-motion';

export default function AudioPlayer() {
  const [soundInstances, setSoundInstances] = useState<Map<string, Howl>>(new Map());
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const instances = new Map<string, Howl>();

    soundButtons.forEach((button) => {
      const sound = new Howl({
        src: [button.soundFile],
        preload: true,
        onload: () => {
          console.log(`Loaded: ${button.label}`);
        },
        onloaderror: (id, error) => {
          console.error(`Failed to load ${button.label}:`, error);
        }
      });
      instances.set(button.id, sound);
    });

    setSoundInstances(instances);
    setIsLoading(false);

    return () => {
      instances.forEach(sound => sound.unload());
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSoundTriggered = (soundId: string) => {
      const soundInstance = soundInstances.get(soundId);
      if (soundInstance) {
        soundInstance.play();
        setLastPlayed(soundId);

        setTimeout(() => {
          setLastPlayed(null);
        }, 1000);
      }
    };

    socket.on('soundTriggered', handleSoundTriggered);

    return () => {
      socket.off('soundTriggered', handleSoundTriggered);
    };
  }, [socket, soundInstances]);

  const getCurrentSound = () => {
    if (!lastPlayed) return null;
    return soundButtons.find(button => button.id === lastPlayed);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">🎭 Host Audio Player</h1>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-300">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {isLoading && (
          <div className="text-yellow-400 mb-4">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            Cargando sonidos...
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          💫 Reproductor Principal
        </h2>

        <div className="text-center">
          {lastPlayed ? (
            <motion.div
              key={lastPlayed}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <div className="text-6xl mb-3">
                {getCurrentSound()?.emoji}
              </div>
              <div className="text-white text-lg font-medium">
                {getCurrentSound()?.label}
              </div>
              <motion.div
                className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <div className="mb-6 text-gray-500">
              <div className="text-6xl mb-3">🎵</div>
              <div className="text-lg">
                Esperando sonidos...
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400">
            Los sonidos se reproducirán automáticamente cuando los participantes presionen los botones desde sus dispositivos móviles.
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm mb-2">
          Comparte esta URL con tus compañeros para que controlen los sonidos:
        </p>
        <code className="bg-gray-800 text-cyan-400 px-4 py-2 rounded-lg text-sm">
          {typeof window !== 'undefined' ? `${window.location.origin}/client` : '/client'}
        </code>
      </div>
    </div>
  );
}