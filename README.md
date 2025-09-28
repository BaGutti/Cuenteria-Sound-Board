# 🎭 Cuentería Sound Board

Una tabla de sonidos interactiva para sesiones de cuentería en tiempo real. Permite que mientras una persona narra la historia, los demás participantes puedan activar efectos de sonido desde sus dispositivos móviles para crear una experiencia inmersiva.

## ✨ Características

- **🎵 Control de audio en tiempo real** - Los sonidos se reproducen instantáneamente al presionar los botones
- **📱 Interfaz móvil/desktop** - Botones táctiles grandes optimizados para dispositivos móviles
- **🌐 Conectividad WebSocket** - Sincronización en tiempo real entre el dispositivo de control y el de reproducción
- **🎨 Interfaz oscura y vibrante** - Diseño optimizado para presentaciones en ambientes con poca luz
- **🔊 Sistema host/client** - Un dispositivo reproduce el audio mientras otros controlan los efectos

## 🚀 Tecnologías

- **Next.js 15** con TypeScript
- **Socket.io** para comunicación en tiempo real
- **Howler.js** para manejo de audio
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BaGutti/Cuenteria-Sound-Board.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🎯 Uso

1. **Host (Portátil)**: Abre la aplicación en tu portátil - aquí se reproducirán los sonidos
2. **Clientes (Móviles)**: Los demás participantes acceden desde sus celulares para controlar los botones
3. **Durante la presentación**: Mientras narras, tus compañeros presionan los botones para crear atmósfera

## 🎨 Sonidos Disponibles

- 💨 Viento
- ⚡ Trueno
- 🌧️ Lluvia
- 🔥 Fuego
- 🌲 Bosque
- 🌊 Agua
- 🐦 Pájaros
- 🐎 Caballo
- 🚪 Puerta
- 👣 Pasos
- 🔔 Campana
- 👥 Multitud

## 🛠️ Deploy en Netlify

Este proyecto está optimizado para Netlify. Simplemente conecta tu repositorio de GitHub y Netlify se encargará del resto.

## 📄 Licencia

Este proyecto está bajo la licencia especificada en el archivo LICENSE.