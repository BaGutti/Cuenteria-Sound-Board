'use client';

import { useEffect, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { useSocket } from '@/hooks/useSocket';
import { soundButtons, storyModes } from '@/lib/sounds';
import { motion } from 'framer-motion';
import VisualEffects from './VisualEffects';
import { SoundButton } from '@/types/sound';

export default function AudioPlayer() {
  const [soundInstances, setSoundInstances] = useState<Map<string, Howl>>(new Map());
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [masterVolume] = useState(1.0);
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [activeVisualEffects, setActiveVisualEffects] = useState<Set<string>>(new Set());
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [currentStoryMode, setCurrentStoryMode] = useState('generic');
  const [currentButtons, setCurrentButtons] = useState<SoundButton[]>(soundButtons);
  const { socket, isConnected } = useSocket();

  // Effect to handle story mode changes
  useEffect(() => {
    const mode = storyModes.find(m => m.id === currentStoryMode);
    if (mode) {
      setCurrentButtons(mode.buttons);
    }
  }, [currentStoryMode]);

  useEffect(() => {
    const instances = new Map<string, Howl>();

    currentButtons.forEach((button) => {
      const buttonVolume = button.volume !== undefined ? button.volume : 1.0;
      const sound = new Howl({
        src: [button.soundFile],
        preload: true,
        volume: masterVolume * buttonVolume,
        onload: () => {
          console.log(`Loaded: ${button.label} (volume: ${buttonVolume})`);
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
  }, [masterVolume, currentButtons]);


  const getCurrentSound = () => {
    if (!lastPlayed) return null;
    return currentButtons.find(button => button.id === lastPlayed);
  };

  const handleStoryModeChange = (modeId: string) => {
    // Stop all currently playing sounds
    stopAllSounds();

    // Change the mode
    setCurrentStoryMode(modeId);

    // Emit to all clients
    if (socket) {
      socket.emit('changeStoryMode', modeId);
    }
  };

  const fadeOutAllSounds = useCallback(async (duration = 2000) => {
    setIsFadingOut(true);
    console.log('🎚️ Starting fade out...', { soundInstances: soundInstances.size });

    let playingSoundCount = 0;

    // Manual fade out usando setInterval para garantizar que funcione
    const fadeStep = 50; // ms between volume changes
    const steps = duration / fadeStep;
    let currentStep = 0;

    soundInstances.forEach(sound => {
      if (sound.playing()) {
        playingSoundCount++;
        console.log('🔊 Found playing sound, starting fade...');

        const originalVolume = sound.volume();
        console.log('🔊 Original volume:', originalVolume);

        const fadeInterval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;
          const newVolume = originalVolume * (1 - progress);

          sound.volume(Math.max(0, newVolume));
          console.log('🔊 Fade step:', currentStep, 'Volume:', newVolume);

          if (currentStep >= steps || newVolume <= 0) {
            clearInterval(fadeInterval);
            sound.stop();
            sound.volume(originalVolume); // Reset for next time
            console.log('✅ Sound stopped and volume reset');
          }
        }, fadeStep);
      }
    });

    console.log('🎚️ Total playing sounds found:', playingSoundCount);

    // Reset UI state after fade duration
    setTimeout(() => {
      setIsFadingOut(false);
      setPlayingSounds(new Set());
      console.log('✅ Fade out complete - UI reset');
    }, duration + 200);
  }, [soundInstances, setIsFadingOut, setPlayingSounds]);

  const stopAllSounds = useCallback(() => {
    console.log('⏹️ Stopping all sounds...', { soundInstances: soundInstances.size });

    let stoppedCount = 0;
    soundInstances.forEach((sound, index) => {
      if (sound.playing()) {
        console.log(`🔇 Stopping sound ${index}`);
        sound.stop();
        sound.volume(masterVolume); // Reset volume
        stoppedCount++;
      }
    });

    setPlayingSounds(new Set());
    setIsFadingOut(false); // Reset fade out state if active
    console.log(`✅ All sounds stopped. Total stopped: ${stoppedCount}`);
  }, [soundInstances, masterVolume, setPlayingSounds, setIsFadingOut]);

  useEffect(() => {
    if (!socket) return;

    const handleSoundTriggered = (soundId: string) => {
      const soundInstance = soundInstances.get(soundId);
      if (soundInstance) {
        // Check if sound is already playing, if so, restart it from the beginning
        if (soundInstance.playing()) {
          soundInstance.stop();
        }
        soundInstance.play();
        setLastPlayed(soundId);

        // Get audio duration and activate visual effects
        const audioDuration = soundInstance.duration() * 1000; // Convert to milliseconds
        console.log(`🎵 Audio duration for ${soundId}: ${audioDuration}ms`);

        // Map sound IDs to visual effects
        const soundToEffectMap: Record<string, string> = {
          // Generic effects
          'rain': 'rain',
          'water': 'water',
          'thunder': 'lightning',
          'wind': 'wind',
          'fire': 'fire',
          'forest': 'forest',
          'birds': 'birds',
          'footsteps': 'footsteps',
          'horse': 'horse',
          'crowd': 'crowd',
          'door': 'door',
          'bell': 'bell',

          // Story-specific effects - El Pueblo Donde Llovían Noticias
          'butterflies': 'butterflies',
          'rain_soft': 'rain_soft',
          'rain_intense': 'rain_intense',
          'wind_soft': 'wind',
          'wind_strong': 'wind',
          'village_murmur': 'crowd',
          'alarmed_crowd': 'crowd',
          'baby_cry': 'crowd',
          'children_laugh': 'birds', // Happy, light effect
          'church_bell': 'bell',
          'coffee_cup': 'water', // Subtle liquid effect
          'pages': 'wind', // Paper rustling
          'magic_mirrors': 'magic_mirrors',
          'river': 'water',
          'birds_singing': 'birds',
          'birds_silence': 'wind', // Subtle atmospheric effect
          'magical_atmosphere': 'forest', // Mystical nature
          'old_radio': 'old_radio',
          'static': 'static',
          'echo': 'water', // Ripple-like echo effect
          'glass_break': 'glass_break',
        };

        const effectType = soundToEffectMap[soundId];
        if (effectType) {
          // Add effect to active set
          setActiveVisualEffects(prev => new Set([...prev, effectType]));
          console.log(`🎨 Adding visual effect: ${effectType} for ${audioDuration}ms`);

          // Remove effect when audio ends
          setTimeout(() => {
            setActiveVisualEffects(prev => {
              const newSet = new Set(prev);
              newSet.delete(effectType);
              return newSet;
            });
            console.log(`🎨 Removing visual effect: ${effectType}`);
          }, audioDuration);
        }

        // Keep the UI indicator for a shorter time
        setTimeout(() => {
          setLastPlayed(null);
        }, Math.min(1000, audioDuration)); // Show for 1 second or audio duration, whichever is shorter
      }
    };

    const handleFadeOutTriggered = (duration: number) => {
      console.log(`🎚️ Received fade out command: ${duration}ms`);
      fadeOutAllSounds(duration);

      // Fade out visual effects too
      setTimeout(() => {
        setActiveVisualEffects(new Set());
        console.log(`🎨 All visual effects stopped due to fade out`);
      }, duration);
    };

    const handleStopAllTriggered = () => {
      console.log(`⏹️ Received stop all command`);
      stopAllSounds();

      // Stop visual effects immediately
      setActiveVisualEffects(new Set());
      console.log(`🎨 All visual effects stopped due to stop all`);
    };

    const handleStoryModeChanged = (modeId: string) => {
      console.log(`📖 Received story mode change: ${modeId}`);
      setCurrentStoryMode(modeId);
    };

    socket.on('soundTriggered', handleSoundTriggered);
    socket.on('fadeOutTriggered', handleFadeOutTriggered);
    socket.on('stopAllTriggered', handleStopAllTriggered);
    socket.on('storyModeChanged', handleStoryModeChanged);

    return () => {
      socket.off('soundTriggered', handleSoundTriggered);
      socket.off('fadeOutTriggered', handleFadeOutTriggered);
      socket.off('stopAllTriggered', handleStopAllTriggered);
      socket.off('storyModeChanged', handleStoryModeChanged);
    };
  }, [socket, soundInstances, fadeOutAllSounds, stopAllSounds, setActiveVisualEffects, setLastPlayed]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 relative">
      {/* Visual Effects Overlay */}
      <VisualEffects
        activeEffects={activeVisualEffects}
        isTheaterMode={isTheaterMode}
        onExitTheater={() => setIsTheaterMode(false)}
      />
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
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          💫 Reproductor Principal
        </h2>

        {/* Story Mode Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
            📖 Selecciona un Cuento
          </label>
          <select
            value={currentStoryMode}
            onChange={(e) => handleStoryModeChange(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            {storyModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {storyModes.find(m => m.id === currentStoryMode)?.description}
          </p>
        </div>

        {/* Theater Mode Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setIsTheaterMode(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🎭 Activar Modo Teatro
          </button>
        </div>


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
                const button = currentButtons.find(b => b.id === soundId);
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