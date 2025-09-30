# Despliegue en Vercel - Limitaciones de Socket.IO

## ⚠️ PROBLEMA CONOCIDO

Socket.IO **NO funciona de manera confiable en Vercel** con serverless functions porque:

1. Cada request puede llegar a una función serverless diferente
2. No hay estado compartido entre funciones
3. Las conexiones WebSocket pueden cerrarse después de 10 segundos en el plan gratuito
4. Las funciones serverless tienen un timeout máximo de 5 minutos

## 🔧 Soluciones Recomendadas

### Opción 1: Usar un servicio de realtime externo (RECOMENDADO)

**Pusher** (Gratuito hasta 100 conexiones simultáneas):
- https://pusher.com/
- Muy fácil de integrar
- Específicamente diseñado para este caso de uso

**Ably** (Gratuito hasta 6M mensajes/mes):
- https://ably.com/
- Más robusto que Pusher
- Mejor para producción

**Supabase Realtime** (Gratuito):
- https://supabase.com/
- Incluye base de datos + realtime
- Perfecto si necesitas persistir datos

### Opción 2: Deploy en plataforma con Node.js persistente

**Railway.app**:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Desplegar
railway login
railway init
railway up
```

**Render.com**:
- Conecta tu repo de GitHub
- Selecciona "Web Service"
- Build command: `npm install && npm run build`
- Start command: `npm start`

**Fly.io**:
```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Desplegar
fly launch
fly deploy
```

## 🩹 Solución Temporal (Actual)

Hemos configurado:
- Timeouts largos (60s ping timeout, 25s ping interval)
- Reconexión infinita en el cliente
- Websocket + polling fallback
- Cache-Control headers

**Esto mejora la estabilidad pero NO soluciona el problema de raíz.**

## 📊 ¿Cuándo usar cada opción?

| Caso de Uso | Solución Recomendada |
|-------------|---------------------|
| Demo rápido, < 10 usuarios | Vercel (actual) |
| Producción, > 10 usuarios | Pusher/Ably |
| Necesitas DB + realtime | Supabase |
| Control total del servidor | Railway/Render/Fly.io |

## 🚀 Migración a Pusher (Ejemplo)

1. Crear cuenta en https://pusher.com/
2. Instalar SDK:
```bash
npm install pusher pusher-js
```

3. Crear `src/lib/pusher.ts`:
```typescript
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});
```

4. Reemplazar Socket.IO con Pusher en los componentes.

## 📝 Notas

- El proyecto funciona perfecto en desarrollo local (npm run dev)
- Los problemas solo aparecen en Vercel production
- Si ves desconexiones frecuentes en Vercel, es esperado
