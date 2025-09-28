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
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const instances = new Map<string, Howl>();

    soundButtons.forEach((button) => {
      const sound = new Howl({
        src: [button.soundFile],
        preload: true,
        volume: masterVolume,
        onload: () => {
          console.log(`Loaded: ${button.label}`);
        },
        onloaderror: (id, error) => {
          console.error(`Failed to load ${button.label}:`, error);
        },
        onplay: () => {
          setPlayingSounds(prev => new Set([...prev, button.id]));
        },
        onend: () => {
          setPlayingSounds(prev => {
            const newSet = new Set(prev);
            newSet.delete(button.id);
            return newSet;
          });
        },
        onstop: () => {
          setPlayingSounds(prev => {
            const newSet = new Set(prev);
            newSet.delete(button.id);
            return newSet;
          });
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

    const handleFadeOutTriggered = (duration: number) => {
      console.log(`🎚️ Received fade out command: ${duration}ms`);
      fadeOutAllSounds(duration);
    };

    const handleStopAllTriggered = () => {
      console.log(`⏹️ Received stop all command`);
      stopAllSounds();
    };

    socket.on('soundTriggered', handleSoundTriggered);
    socket.on('fadeOutTriggered', handleFadeOutTriggered);
    socket.on('stopAllTriggered', handleStopAllTriggered);

    return () => {
      socket.off('soundTriggered', handleSoundTriggered);
      socket.off('fadeOutTriggered', handleFadeOutTriggered);
      socket.off('stopAllTriggered', handleStopAllTriggered);
    };
  }, [socket, soundInstances]);

  const getCurrentSound = () => {
    if (!lastPlayed) return null;
    return soundButtons.find(button => button.id === lastPlayed);
  };

  const fadeOutAllSounds = async (duration = 2000) => {
    setIsFadingOut(true);

    const fadeStep = 50; // ms between volume changes
    const steps = duration / fadeStep;
    const volumeDecrement = masterVolume / steps;

    let currentVolume = masterVolume;

    const fadeInterval = setInterval(() => {
      currentVolume -= volumeDecrement;

      if (currentVolume <= 0) {
        currentVolume = 0;
        clearInterval(fadeInterval);

        // Stop all sounds after fade out completes
        soundInstances.forEach(sound => {
          sound.stop();
        });

        // Reset volume back to normal for next sounds
        setTimeout(() => {
          soundInstances.forEach(sound => {
            sound.volume(masterVolume);
          });
          setIsFadingOut(false);
          setPlayingSounds(new Set());
        }, 100);
      }

      // Apply current volume to all playing sounds
      soundInstances.forEach(sound => {
        sound.volume(currentVolume);
      });
    }, fadeStep);
  };

  const stopAllSounds = () => {
    soundInstances.forEach(sound => {
      sound.stop();
    });
    setPlayingSounds(new Set());
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


        {/* Playing sounds indicator */}
        {playingSounds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 text-center"
          >
            <div className="text-xs text-cyan-400 mb-2">
              🎵 Reproduciendo {playingSounds.size} sonido{playingSounds.size > 1 ? 's' : ''}
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from(playingSounds).map(soundId => {
                const button = soundButtons.find(b => b.id === soundId);
                return (
                  <div key={soundId} className="text-xs bg-cyan-600 px-2 py-1 rounded-full">
                    {button?.emoji} {button?.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="text-center">
          {lastPlayed ? (
            <motion.div
              key={lastPlayed}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isFadingOut ? 0.9 : 1,
                opacity: isFadingOut ? 0.6 : 1
              }}
              className="mb-6"
            >
              <motion.div
                className="text-6xl mb-3"
                animate={isFadingOut ? {
                  scale: [1, 0.95, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ duration: 1, repeat: isFadingOut ? Infinity : 0 }}
              >
                {getCurrentSound()?.emoji}
              </motion.div>
              <div className="text-white text-lg font-medium">
                {getCurrentSound()?.label}
              </div>
              <motion.div
                className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className={`h-full ${isFadingOut
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                  }`}
                  initial={{ width: "0%" }}
                  animate={{
                    width: isFadingOut ? "0%" : "100%",
                  }}
                  transition={{
                    duration: isFadingOut ? 2 : 1,
                    ease: isFadingOut ? "easeOut" : "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <div className="mb-6 text-gray-500">
              <div className="text-6xl mb-3">
                {isFadingOut ? (
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎚️
                  </motion.div>
                ) : (
                  "🎵"
                )}
              </div>
              <div className="text-lg">
                {isFadingOut ? "Fade out en progreso..." : "Esperando sonidos..."}
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
          192.168.20.65:3000/client
        </code>
      </div>
    </div>
  );
}