'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.h1
          className="text-6xl font-bold text-white mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🎭 Cuentería
        </motion.h1>

        <motion.h2
          className="text-3xl font-semibold text-cyan-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Sound Board
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-300 text-lg mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Crea atmósfera única para tus sesiones de cuentería. Un dispositivo reproduce los sonidos
          mientras otros controlan los efectos en tiempo real desde sus móviles.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/host">
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700
                         text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg
                         transform transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎵 Soy el Host
              <div className="text-sm opacity-90 mt-1">
                (Reproductor de audio)
              </div>
            </motion.button>
          </Link>

          <Link href="/client">
            <motion.button
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700
                         text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg
                         transform transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Soy un Cliente
              <div className="text-sm opacity-90 mt-1">
                (Control de efectos)
              </div>
            </motion.button>
          </Link>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="mt-16 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            ¿Cómo funciona?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="bg-gray-800 p-6 rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-3">🎭</div>
              <h4 className="text-white font-medium mb-2">1. Preparación</h4>
              <p className="text-gray-400 text-sm">
                El narrador abre la app como "Host" en su computadora donde se reproducirán los sonidos.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-3">📱</div>
              <h4 className="text-white font-medium mb-2">2. Conexión</h4>
              <p className="text-gray-400 text-sm">
                Los participantes se conectan como "Clientes" desde sus móviles para controlar los efectos.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-3">🎵</div>
              <h4 className="text-white font-medium mb-2">3. ¡Acción!</h4>
              <p className="text-gray-400 text-sm">
                Durante la historia, presionan botones para crear atmósfera en tiempo real.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
