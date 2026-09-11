# 🚀 TekVerse - Guía de Instalación y Configuración

## 📋 Requisitos Previos
- Node.js v16+
- MongoDB (Atlas o local)
- npm o yarn

## 🔧 Instalación Backend

### 1. Clonar el repositorio
```bash
git clone https://github.com/6861623366a-hub/TekVerse.git
cd TekVerse
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=5000
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tekverse
JWT_SECRET=tu_secreto_jwt_aqui_muy_seguro
CLOUDINARY_NAME=tu_cloudinary_name
CLOUDINARY_KEY=tu_cloudinary_key
CLOUDINARY_SECRET=tu_cloudinary_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Iniciar el servidor
```bash
npm start
# O para desarrollo con nodemon:
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

## 🎨 Instalación Frontend

### 1. Instalar dependencias del cliente
```bash
cd client
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/users/:id` - Obtener perfil de usuario
- `PATCH /api/users/:id` - Actualizar perfil
- `POST /api/users/:id/link-game` - Vincular cuenta de juego
- `POST /api/users/:id/add-friend` - Agregar amigo
- `POST /api/users/:id/tier-upgrade` - Mejorar tier de suscripción

### Servidores
- `POST /api/servers` - Crear nuevo servidor
- `GET /api/servers/:id` - Obtener detalles del servidor
- `PATCH /api/servers/:id` - Actualizar servidor
- `POST /api/servers/:id/join` - Unirse a servidor con código de invitación
- `POST /api/servers/:id/roles` - Crear rol personalizado
- `POST /api/servers/:id/leave` - Abandonar servidor

### Canales
- `POST /api/channels` - Crear canal
- `GET /api/channels/:id` - Obtener detalles del canal
- `PATCH /api/channels/:id` - Actualizar canal
- `DELETE /api/channels/:id` - Eliminar canal

### Mensajes
- `POST /api/messages` - Enviar mensaje
- `PATCH /api/messages/:id` - Editar mensaje
- `DELETE /api/messages/:id` - Eliminar mensaje
- `POST /api/messages/:id/react` - Agregar reacción
- `GET /api/messages/channel/:channelId` - Obtener mensajes del canal

### Llamadas de Voz
- `POST /api/voice/start` - Iniciar llamada de voz
- `POST /api/voice/:id/end` - Terminar llamada
- `POST /api/voice/:id/join` - Unirse a llamada
- `GET /api/voice/:id` - Obtener detalles de la llamada

### Mensajes Directos
- `POST /api/dm/create` - Crear conversación privada
- `GET /api/dm` - Obtener todas las conversaciones
- `POST /api/dm/:id/send` - Enviar mensaje privado

## 🔌 Socket.io Events

### Conexión
- `user-online` - Usuario conectado
- `disconnect` - Usuario desconectado

### Canales
- `join-channel` - Unirse a canal
- `leave-channel` - Salir de canal
- `message-send` - Enviar mensaje
- `message-receive` - Recibir mensaje

### Voz
- `join-voice-channel` - Entrar a llamada de voz
- `leave-voice-channel` - Salir de llamada
- `voice-call-start` - Iniciar llamada
- `voice-call-end` - Terminar llamada
- `webrtc-signal` - Señal WebRTC
- `user-joined-voice` - Usuario entró a llamada
- `user-left-voice` - Usuario salió de llamada

### Pantalla
- `screen-share-start` - Iniciar compartir pantalla
- `screen-share-stop` - Detener compartir pantalla
- `camera-toggle` - Activar/desactivar cámara
- `mic-toggle` - Activar/desactivar micrófono

### Estado
- `user-status-change` - Cambio de estado del usuario
- `user-typing` - Usuario escribiendo
- `user-stop-typing` - Usuario dejó de escribir

### Amigos y Notificaciones
- `friend-request` - Solicitud de amistad
- `accept-friend-request` - Aceptar solicitud
- `server-invite` - Invitación a servidor
- `friend-request-received` - Recibir solicitud de amistad
- `server-invite-received` - Recibir invitación a servidor

## 🎯 Características Principales

### 👤 Sistema de Usuarios
- Registro e inicio de sesión con email/contraseña
- Perfiles personalizables (avatar, banner, bio, estado)
- Sistema de roles (Founder = permisos totales, Usuario Normal)
- **Primer usuario registrado = Founder automático** ✨
- Sistema de amigos y bloqueos
- Integración de cuentas de juegos

### 🏢 Servidores
- Crear servidores ilimitados
- Sistema de invitación con código único
- Roles personalizados con permisos granulares
- Niveles de verificación (none, low, medium, high)
- Servidor NSFW configurable
- El propietario es Founder en su servidor

### 💬 Canales
- Canales de texto, voz y escenario
- Nombres y descripciones personalizables
- Permisos personalizados por usuario/rol
- Límite de velocidad de mensajes
- Categorías de canales
- Mensajes anclados

### 📱 Mensajería
- Mensajes en tiempo real (Socket.io)
- Edición y eliminación de mensajes
- Reacciones con emojis
- Menciones de usuarios
- Adjuntos (fotos, vídeos)
- Embeds customizados
- Indicador de escritura en tiempo real

### 🎙️ Voz y Vídeo
- Llamadas de voz en tiempo real
- Vídeo llamadas
- Compartir pantalla con calidad HD
- Control de cámara y micrófono
- Grabación de llamadas
- Múltiples participantes
- WebRTC para conexión P2P

### 🎮 Integraciones
- Vincular cuentas de juegos (Valorant, CS:GO, LOL, etc.)
- Mostrar estado de juego en perfil
- Acceso desde la app

### 💎 Sistema de Tiers (similar a Nitro)
**Free**
- Uso básico sin límite

**Pro** - $4.99/mes
- 🎬 HD Streaming
- ✨ Estado personalizado
- 📤 Uploads hasta 100MB

**Elite** - $9.99/mes
- 🎬 HD Streaming
- ✨ Estado personalizado  
- 📤 Uploads hasta 500MB
- 🎧 Soporte prioritario

**Supreme** - $19.99/mes
- 🎬 HD Streaming 4K
- ✨ Estado personalizado
- 📤 Uploads ilimitados
- ⚡ Acceso temprano a features
- 🎧 Soporte VIP 24/7

## 🎨 Branding TekVerse

### Colores
- **Primario**: #00D4FF (Cyan)
- **Secundario**: #FF006E (Magenta)
- **Neutro Oscuro**: #1A1A1A
- **Gris Oscuro**: #2A2A2A

### Logo
El logo incorpora la letra "T" en gradiente cyan-azul sobre fondo oscuro.

## 📂 Estructura del Proyecto

```
TekVerse/
├── server.js                 # Entrada principal del servidor
├── models/                   # Modelos de MongoDB
│   ├── User.js
│   ├── Server.js
│   ├── Channel.js
│   ├── Message.js
│   ├── VoiceCall.js
│   └── DirectMessage.js
├── routes/                   # Rutas API
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── serverRoutes.js
│   ├── channelRoutes.js
│   ├── messageRoutes.js
│   ├── voiceRoutes.js
│   └── dmRoutes.js
├── handlers/                 # Manejadores
│   └── socketHandler.js      # Socket.io events
├── middleware/               # Middleware
│   └── auth.js              # Verificación JWT
├── client/                   # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Páginas
│   │   ├── store.js         # Zustand store
│   │   └── api.js           # Llamadas API
│   └── index.html
├── package.json
└── .env.example
```

## 🚀 Despliegue (Producción)

### Backend - Heroku
1. `npm install -g heroku-cli`
2. `heroku login`
3. `heroku create tu-app-tekverse`
4. Configurar variables de entorno en Heroku
5. `git push heroku main`

### Frontend - Vercel
1. `npm i -g vercel`
2. `cd client`
3. `vercel`
4. Configurar variables de entorno

## 📞 Soporte

Para reportar bugs o sugerencias, crea un issue en el repositorio.

## 📜 Licencia

MIT License - Hecho con ❤️ por el equipo de TekVerse

---

**¡Bienvenido a TekVerse! 🌟 La evolución de la comunicación digital.**