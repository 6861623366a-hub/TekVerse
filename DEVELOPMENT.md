# TekVerse - Documentación Completa de Desarrollo

## 📖 Tabla de Contenidos
1. [Arquitectura](#arquitectura)
2. [Autenticación](#autenticación)
3. [Modelos de Datos](#modelos-de-datos)
4. [Socket.io Events](#socketio-events)
5. [Componentes Frontend](#componentes-frontend)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Flujos de Usuario](#flujos-de-usuario)

## 🏗️ Arquitectura

### Backend Stack
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Tiempo Real**: Socket.io
- **Autenticación**: JWT
- **Seguridad**: Helmet, CORS, Bcrypt

### Frontend Stack
- **Framework**: React 18 con Vite
- **Gestión de Estado**: Zustand
- **Comunicación**: Socket.io Client, Axios
- **Estilos**: Tailwind CSS
- **Rutas**: React Router v6

## 🔐 Autenticación

### Flujo de Registro
```
1. Usuario ingresa username, email, contraseña
2. Contraseña se hashea con bcrypt
3. Se crea documento en DB
4. Si es el primer usuario: role = 'founder', tier = 'supreme'
5. Si no: role = 'user', tier = 'free'
6. Se genera JWT con 30 días de expiración
7. Token se almacena en localStorage
```

### Flujo de Login
```
1. Usuario ingresa email y contraseña
2. Se busca usuario por email
3. Se compara contraseña con hash
4. Si válida, se genera JWT
5. Token se almacena en localStorage
6. Se redirige a dashboard
```

### Verificación de Token
```
Cada request a rutas protegidas debe incluir:
Header: Authorization: Bearer <token>

Middleware verifyToken:
- Extrae token del header
- Verifica firma con JWT_SECRET
- Si válido, agrega user data a req.user
- Si inválido, retorna 401
```

## 📊 Modelos de Datos

### User Schema
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar: String,
  banner: String,
  bio: String,
  status: 'online' | 'away' | 'offline' | 'dnd',
  role: 'founder' | 'user',
  servers: [Server._id],
  friends: [User._id],
  blockedUsers: [User._id],
  linkedGames: [{
    gameId: String,
    gameName: String,
    accountId: String
  }],
  tiers: {
    current: 'free' | 'pro' | 'elite' | 'supreme',
    expiresAt: Date,
    perks: [String]
  }
}
```

### Server Schema
```javascript
{
  name: String,
  description: String,
  icon: String,
  banner: String,
  owner: User._id,
  members: [{
    user: User._id,
    role: 'founder' | 'moderator' | 'member'
  }],
  channels: [Channel._id],
  roles: [{
    name: String,
    color: String,
    permissions: [String]
  }],
  inviteCode: String (unique),
  public: Boolean,
  nsfw: Boolean,
  verificationLevel: 'none' | 'low' | 'medium' | 'high'
}
```

### Channel Schema
```javascript
{
  name: String,
  description: String,
  server: Server._id,
  type: 'text' | 'voice' | 'stage',
  category: String,
  position: Number,
  topic: String,
  nsfw: Boolean,
  private: Boolean,
  permissionOverwrites: [{
    type: 'user' | 'role',
    id: ObjectId,
    allow: [String],
    deny: [String]
  }],
  rateLimit: Number,
  messages: [Message._id]
}
```

### Message Schema
```javascript
{
  content: String,
  author: User._id,
  channel: Channel._id,
  server: Server._id,
  attachments: [{
    url: String,
    filename: String,
    size: Number,
    type: String
  }],
  reactions: [{
    emoji: String,
    users: [User._id]
  }],
  mentions: [User._id],
  edited: Boolean,
  editedAt: Date,
  pinned: Boolean,
  createdAt: Date
}
```

## 🔌 Socket.io Events

### Autenticación y Conexión
```javascript
socket.on('user-online', (userId) => {
  // Marcar usuario como en línea
  // Emitir a todos: user-status
});
```

### Canales de Texto
```javascript
// Unirse a canal
socket.on('join-channel', (data: { channelId, userId }))

// Enviar mensaje
socket.on('message-send', (data: {
  content,
  channelId,
  userId,
  serverId
}))
// Respuesta: message-receive (a todos en el canal)

// Indicador de escritura
socket.on('typing', (data: { channelId, userId, username }))
socket.on('stop-typing', (data: { channelId, userId }))
```

### Llamadas de Voz
```javascript
// Entrar a canal de voz
socket.on('join-voice-channel', (data: {
  channelId,
  userId,
  username
}))
// Respuesta: user-joined-voice (a todos en el canal)

// Iniciar llamada
socket.on('voice-call-start', (data: {
  channelId,
  userId,
  serverId
}))
// Respuesta: voice-call-started

// Señal WebRTC
socket.on('webrtc-signal', (data: {
  channelId,
  userId,
  signal: RTCSessionDescription
}))
```

### Pantalla
```javascript
socket.on('screen-share-start', (data: {
  channelId,
  userId,
  streamId
}))
socket.on('screen-share-stop', (data: {
  channelId,
  userId
}))
socket.on('camera-toggle', (data: {
  channelId,
  userId,
  enabled
}))
```

## ⚛️ Componentes Frontend

### Componentes Principales

#### Sidebar
- Logo y branding
- Botón de usuario
- Indicador de estado
- Botón logout

#### ServerList
- Lista de servidores del usuario
- Botón para crear servidor
- Indicador de servidor actual

#### ChannelList
- Canales del servidor actual
- Botón para crear canal
- Indicador de canal actual
- Búsqueda de canales

#### ChatWindow
- Historial de mensajes
- Input para escribir
- Botones de voz, video, pantalla
- Indicador de usuarios escribiendo

#### VoiceCallWindow
- Grid de vídeos
- Controles (mic, cámara, pantalla)
- Indicador de duración
- Lista de participantes

#### UserProfile
- Avatar y banner
- Bio e información
- Opciones de tier
- Juegos vinculados

## 🎣 Hooks Personalizados

### useAuth
```javascript
const { user, token, loading, login, register, logout } = useAuth();
```
- Gestiona autenticación
- Persiste token en localStorage
- Carga datos del usuario

### useSocket
```javascript
const socket = useSocket();
sendMessage(data);
startVoiceCall(data);
startScreenShare(data);
```
- Inicializa conexión Socket.io
- Expone funciones para emitir eventos

### useWebRTC
```javascript
const {
  localStream,
  remoteStreams,
  isCameraOn,
  isMicOn,
  startLocalStream,
  toggleCamera,
  toggleMicrophone,
  startScreenShare
} = useWebRTC(channelId, userId);
```
- Gestiona acceso a cámara/micrófono
- Maneja streams WebRTC

## 👥 Flujos de Usuario

### Crear Servidor
```
1. Usuario hace click en "+"
2. Modal para nombre del servidor
3. POST /api/servers
4. Servidor se crea con user como owner (role: founder)
5. Se agrega automáticamente el primer canal "general"
6. Usuario se une al servidor
7. Se actualiza sidebar
```

### Unirse a Servidor
```
1. Usuario obtiene código de invitación
2. Usa comando /join <codigo>
3. POST /api/servers/:id/join
4. Valida código de invitación
5. Agrega usuario como member
6. User recibe notificación
7. Servidor aparece en sidebar
```

### Iniciar Llamada de Voz
```
1. Usuario hace click en icono 🎙️
2. Se obtiene acceso a micrófono/cámara
3. Se emite voice-call-start
4. Socket notifica a otros en el canal
5. Se establece conexión WebRTC peer-to-peer
6. Video se muestra en grid
7. Usuario puede togglear mic/cámara
8. Usuario puede compartir pantalla
9. Click en botón rojo termina llamada
```

### Enviar Mensaje
```
1. Usuario escribe en input
2. Se emite typing a otros
3. Usuario presiona Enter
4. POST /api/messages
5. Mensaje se guarda en DB
6. Socket emite message-receive
7. Todos en el canal ven el mensaje
8. Se limpia el input
```

---

**Última actualización**: Septiembre 2026
**Versión**: 1.0.0