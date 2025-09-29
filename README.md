# 🎭 Cuentería Sound Board

Una tabla de sonidos interactiva para sesiones de cuentería en tiempo real. Permite que mientras una persona narra la historia, los demás participantes puedan activar efectos de sonido desde sus dispositivos móviles para crear una experiencia inmersiva.

## 🌐 Acceso Directo

**🎯 URLs en producción:**
- **Host (laptop):** https://cuenteria-iota.vercel.app
- **Cliente (móviles):** https://cuenteria-iota.vercel.app/client

## ✨ Características

- **🎵 Control de audio en tiempo real** - Los sonidos se reproducen instantáneamente al presionar los botones
- **📱 Interfaz móvil/desktop** - Botones táctiles grandes optimizados para dispositivos móviles
- **🌐 Conectividad WebSocket** - Sincronización en tiempo real entre el dispositivo de control y el de reproducción
- **🎨 Efectos visuales dinámicos** - Efectos de lluvia, truenos, fuego y más que acompañan el audio
- **🎭 Modo teatro** - Pantalla completa inmersiva con efectos visuales sincronizados
- **🔊 Sistema host/client** - Un dispositivo reproduce el audio mientras otros controlan los efectos
- **🎚️ Controles avanzados** - Fade out suave y stop general para todos los sonidos
- **💫 Efectos múltiples simultáneos** - Combina varios efectos como lluvia + truenos
- **🌙 Interfaz oscura y vibrante** - Diseño optimizado para presentaciones en ambientes con poca luz

## 🚀 Tecnologías

- **Next.js 15** con TypeScript y Turbopack
- **Socket.io** para comunicación en tiempo real
- **Howler.js** para manejo de audio profesional
- **Canvas API** para efectos visuales de alto rendimiento
- **Tailwind CSS** para estilos responsivos
- **Framer Motion** para animaciones fluidas
- **Vercel** para deployment y hosting

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BaGutti/Cuenteria-Sound-Board.git

# Entrar al directorio
cd Cuenteria-Sound-Board

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🎯 Uso

1. **Host (Portátil)**: Abre https://cuenteria-iota.vercel.app en tu portátil - aquí se reproducirán los sonidos
2. **Clientes (Móviles)**: Los demás participantes acceden a https://cuenteria-iota.vercel.app/client desde sus celulares
3. **Durante la presentación**: Mientras narras, tus compañeros presionan los botones para crear atmósfera
4. **Modo teatro**: Presiona "Activar Modo Teatro" en el host para una experiencia visual completa
5. **Controles**: Usa "Fade Out" para desvanecer gradualmente o "Stop All" para parar todo

## 🎨 Sonidos y Efectos Visuales

- 💨 **Viento** - Partículas de aire en movimiento
- ⚡ **Trueno** - Efectos de relámpagos sincronizados
- 🌧️ **Lluvia** - Sistema de partículas de lluvia realista
- 🔥 **Fuego** - Efectos de llamas animadas
- 🌲 **Bosque** - Ambientación natural
- 🌊 **Agua** - Efectos acuáticos
- 🐦 **Pájaros** - Sonidos de naturaleza
- 🐎 **Caballo** - Efectos de galope
- 🚪 **Puerta** - Sonidos de ambiente
- 👣 **Pasos** - Efectos de movimiento
- 🔔 **Campana** - Sonidos ceremoniales
- 👥 **Multitud** - Ambientación urbana

## 🎛️ Características Técnicas

- **Audio HD**: Archivos optimizados para calidad profesional
- **Sincronización automática**: Los efectos visuales duran exactamente lo mismo que el audio
- **Efectos combinables**: Ejecuta múltiples efectos simultáneamente (ej: lluvia + truenos)
- **Control de volumen**: Fade out suave con control de duración
- **Responsive**: Optimizado para móviles, tablets y desktop
- **Real-time**: Latencia mínima gracias a Socket.io

## 🚀 Deploy en Vercel

Este proyecto está optimizado para Vercel y utiliza sus APIs para Socket.io.

Para deployment:
```bash
# Deploy a producción
vercel --prod
```

## 🔧 Desarrollo Local

```bash
# Servidor de desarrollo con host binding
npm run dev -- --hostname 0.0.0.0

# Build de producción
npm run build

# Lint del código
npm run lint
```

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Móviles iOS/Android
- ✅ Tablets

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License (GPL)**. Ver el archivo LICENSE para más detalles.

---

**Creado con ❤️ para sesiones de cuentería inmersivas**