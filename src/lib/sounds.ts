import { SoundButton, StoryMode } from '@/types/sound';

// Story Mode 1: El Pueblo Donde Llovían Noticias
// Ordenado cronológicamente según la narrativa del cuento
// Volume: 0.0 (silencio) a 1.0 (volumen máximo)
const lluviaNoticiasButtons: SoundButton[] = [
  // INTRODUCCIÓN: El pueblo y las mariposas
  {
    id: 'village_murmur',
    emoji: '🏘️',
    label: 'Pueblo',
    soundFile: '/sounds/village_murmur.mp3',
    color: 'bg-orange-500 hover:bg-orange-400',
    volume: 0.4 // Sonido ambiente muy suave
  },
  {
    id: 'butterflies',
    emoji: '🦋',
    label: 'Mariposas',
    soundFile: '/sounds/butterflies.mp3',
    color: 'bg-amber-400 hover:bg-amber-300',
    volume: 0.7 // Sonido más audible
  },

  // INICIO: Don Aureliano y su café
  {
    id: 'coffee_cup',
    emoji: '☕',
    label: 'Taza de Café',
    soundFile: '/sounds/coffee_cup.mp3',
    color: 'bg-amber-600 hover:bg-amber-500',
    volume: 0.7 // Sonido cotidiano, no muy fuerte
  },

  // COMIENZA LA LLUVIA DE NOTICIAS
  {
    id: 'rain_soft',
    emoji: '🌦️',
    label: 'Lluvia Suave',
    soundFile: '/sounds/rain_soft.mp3',
    color: 'bg-blue-400 hover:bg-blue-300',
    volume: 0.6 // Lluvia suave de fondo
  },
  {
    id: 'rain_intense',
    emoji: '🌧️',
    label: 'Lluvia Intensa',
    soundFile: '/sounds/rain_intense.mp3',
    color: 'bg-blue-600 hover:bg-blue-500',
    volume: 0.8 // Más fuerte pero no abrumador
  },
  {
    id: 'old_radio',
    emoji: '📻',
    label: 'Radio/Noticias',
    soundFile: '/sounds/old_radio.mp3',
    color: 'bg-gray-700 hover:bg-gray-600',
    volume: 0.7 // Audible pero no dominante
  },
  {
    id: 'static',
    emoji: '📺',
    label: 'Estática',
    soundFile: '/sounds/static.mp3',
    color: 'bg-gray-800 hover:bg-gray-700',
    volume: 0.5 // Estática puede ser molesta, mantenerla baja
  },

  // LOS NIÑOS NACEN CON MIEDO
  {
    id: 'baby_cry',
    emoji: '👶',
    label: 'Bebé Llorando',
    soundFile: '/sounds/baby_cry.mp3',
    color: 'bg-pink-400 hover:bg-pink-300',
    volume: 0.7 // Emotivo pero balanceado
  },

  // EL PADRE NICANOR
  {
    id: 'church_bell',
    emoji: '🔔',
    label: 'Campana',
    soundFile: '/sounds/church_bell.mp3',
    color: 'bg-purple-500 hover:bg-purple-400',
    volume: 0.8 // Campanas deben oírse claramente
  },

  // MELQUÍADES Y SUS DESCUBRIMIENTOS
  {
    id: 'pages',
    emoji: '📜',
    label: 'Pergaminos',
    soundFile: '/sounds/pages.wav',
    color: 'bg-orange-600 hover:bg-orange-500',
    volume: 0.6 // Sonido sutil de papeles
  },
  {
    id: 'magical_atmosphere',
    emoji: '🌟',
    label: 'Atmósfera Mágica',
    soundFile: '/sounds/magical_atmosphere.mp3',
    color: 'bg-purple-600 hover:bg-purple-500',
    volume: 0.6 // Ambiente místico de fondo
  },

  // EL REVUELO EN AGUAVERDE
  {
    id: 'alarmed_crowd',
    emoji: '👥',
    label: 'Multitud Alarmada',
    soundFile: '/sounds/alarmed_crowd.mp3',
    color: 'bg-red-500 hover:bg-red-400',
    volume: 0.75 // Debe transmitir urgencia
  },

  // CONSTRUYEN LOS ESPEJOS
  {
    id: 'magic_mirrors',
    emoji: '✨',
    label: 'Espejos Mágicos',
    soundFile: '/sounds/magic_mirrors.mp3',
    color: 'bg-indigo-500 hover:bg-indigo-400',
    volume: 0.7 // Efecto mágico presente pero no abrumador
  },

  // EL AÑO DESPUÉS DE LOS ESPEJOS - RENACIMIENTO
  {
    id: 'children_laugh',
    emoji: '😄',
    label: 'Risas de Niños',
    soundFile: '/sounds/children_laugh.mp3',
    color: 'bg-yellow-400 hover:bg-yellow-300',
    volume: 0.75 // Alegre y audible
  },
  {
    id: 'river',
    emoji: '🌊',
    label: 'Río',
    soundFile: '/sounds/river.mp3',
    color: 'bg-blue-500 hover:bg-blue-400',
    volume: 0.6 // Agua fluyendo de fondo
  },
  {
    id: 'birds_singing',
    emoji: '🐦',
    label: 'Pájaros Cantando',
    soundFile: '/sounds/birds_singing.mp3',
    color: 'bg-green-400 hover:bg-green-300',
    volume: 0.65 // Naturaleza alegre
  },

  // LOS ESPEJOS SE QUIEBRAN
  {
    id: 'glass_break',
    emoji: '💥',
    label: 'Cristales Rotos',
    soundFile: '/sounds/glass_break.mp3',
    color: 'bg-gray-500 hover:bg-gray-400',
    volume: 0.85 // Impacto dramático
  },
  {
    id: 'wind_strong',
    emoji: '🌪️',
    label: 'Viento Fuerte',
    soundFile: '/sounds/wind_strong.mp3',
    color: 'bg-cyan-600 hover:bg-cyan-500',
    volume: 0.8 // Viento fuerte debe sentirse
  },
  {
    id: 'thunder',
    emoji: '⚡',
    label: 'Trueno',
    soundFile: '/sounds/thunder.mp3',
    color: 'bg-yellow-500 hover:bg-yellow-400',
    volume: 0.9 // Trueno debe ser impactante
  },

  // EPÍLOGO - REFLEXIÓN
  {
    id: 'wind_soft',
    emoji: '💨',
    label: 'Viento Suave',
    soundFile: '/sounds/wind_soft.mp3',
    color: 'bg-cyan-400 hover:bg-cyan-300',
    volume: 0.5 // Viento suave de cierre
  },
  {
    id: 'birds_silence',
    emoji: '🔇',
    label: 'Silencio',
    soundFile: '/sounds/birds_silence.mp3',
    color: 'bg-gray-600 hover:bg-gray-500',
    volume: 0.4 // Muy sutil, casi silencio
  },
  {
    id: 'echo',
    emoji: '🔊',
    label: 'Eco/Reflexión',
    soundFile: '/sounds/echo.mp3',
    color: 'bg-teal-500 hover:bg-teal-400',
    volume: 0.6 // Eco reflexivo
  }
];

// Story Mode 2: Generic/Default (botones originales)
const genericButtons: SoundButton[] = [
  {
    id: 'wind',
    emoji: '💨',
    label: 'Viento',
    soundFile: '/sounds/wind.mp3',
    color: 'bg-cyan-500 hover:bg-cyan-400',
    volume: 0.7
  },
  {
    id: 'thunder',
    emoji: '⚡',
    label: 'Trueno',
    soundFile: '/sounds/thunder.mp3',
    color: 'bg-yellow-500 hover:bg-yellow-400',
    volume: 0.9
  },
  {
    id: 'rain',
    emoji: '🌧️',
    label: 'Lluvia',
    soundFile: '/sounds/rain.mp3',
    color: 'bg-blue-500 hover:bg-blue-400',
    volume: 0.7
  },
  {
    id: 'fire',
    emoji: '🔥',
    label: 'Fuego',
    soundFile: '/sounds/fire.mp3',
    color: 'bg-red-500 hover:bg-red-400',
    volume: 0.7
  },
  {
    id: 'forest',
    emoji: '🌲',
    label: 'Bosque',
    soundFile: '/sounds/forest.mp3',
    color: 'bg-green-500 hover:bg-green-400',
    volume: 0.6
  },
  {
    id: 'water',
    emoji: '🌊',
    label: 'Agua',
    soundFile: '/sounds/water.mp3',
    color: 'bg-blue-600 hover:bg-blue-500',
    volume: 0.7
  },
  {
    id: 'birds',
    emoji: '🐦',
    label: 'Pájaros',
    soundFile: '/sounds/birds.mp3',
    color: 'bg-orange-500 hover:bg-orange-400',
    volume: 0.65
  },
  {
    id: 'horse',
    emoji: '🐎',
    label: 'Caballo',
    soundFile: '/sounds/horse.mp3',
    color: 'bg-amber-600 hover:bg-amber-500',
    volume: 0.75
  },
  {
    id: 'door',
    emoji: '🚪',
    label: 'Puerta',
    soundFile: '/sounds/door.mp3',
    color: 'bg-gray-500 hover:bg-gray-400',
    volume: 0.8
  },
  {
    id: 'footsteps',
    emoji: '👣',
    label: 'Pasos',
    soundFile: '/sounds/footsteps.mp3',
    color: 'bg-purple-500 hover:bg-purple-400',
    volume: 0.7
  },
  {
    id: 'bell',
    emoji: '🔔',
    label: 'Campana',
    soundFile: '/sounds/bell.mp3',
    color: 'bg-yellow-600 hover:bg-yellow-500',
    volume: 0.8
  },
  {
    id: 'crowd',
    emoji: '👥',
    label: 'Multitud',
    soundFile: '/sounds/crowd.mp3',
    color: 'bg-pink-500 hover:bg-pink-400',
    volume: 0.75
  }
];

// Story Mode 3: Placeholder para tu segundo cuento
const story2Buttons: SoundButton[] = [
  // Agregar botones cuando tengas el segundo cuento
];

// Story Mode 4: Placeholder para tu tercer cuento
const story3Buttons: SoundButton[] = [
  // Agregar botones cuando tengas el tercer cuento
];

export const storyModes: StoryMode[] = [
  {
    id: 'lluvia-noticias',
    name: 'El Pueblo Donde Llovían Noticias',
    description: 'Sonidos para el cuento inspirado en Cuerpos Frágiles',
    buttons: lluviaNoticiasButtons
  },
  {
    id: 'generic',
    name: 'Genérico',
    description: 'Sonidos generales para cualquier cuento',
    buttons: genericButtons
  },
  {
    id: 'story2',
    name: 'Cuento 2',
    description: 'Tu segundo cuento aquí',
    buttons: story2Buttons
  },
  {
    id: 'story3',
    name: 'Cuento 3',
    description: 'Tu tercer cuento aquí',
    buttons: story3Buttons
  }
];

// Export por compatibilidad (botones por defecto)
export const soundButtons: SoundButton[] = genericButtons;