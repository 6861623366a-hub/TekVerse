# 🚀 TekVerse - The Evolution of Communication

**TekVerse** es una plataforma de comunicación moderna y poderosa, diseñada como la evolución de Discord. Incluye todas las características premium con un sistema de suscripción evolutivo.

## ✨ Características Principales

### 👥 Usuarios & Autenticación
- Registro e inicio de sesión con email y contraseña
- Sistema de roles (Founder vs Usuario Normal)
- El primer usuario registrado obtiene permisos de Founder con nivel Supreme
- Perfiles personalizables (avatar, banner, bio, estado)
- Sistema de amigos y bloqueos
- Integración de juegos

### 🏢 Servidores
- Crear servidores ilimitados
- Sistema de invitación con código único
- Roles personalizados con permisos granulares
- Niveles de verificación
- Servidor NSFW
- El propietario es Founder en su servidor

### 💬 Canales
- Canales de texto, voz y escenario
- Personalización de nombres y descripciones
- Permisos personalizados por usuario/rol
- Límite de velocidad de mensajes
- Categorías de canales
- Temas del canal

### 📱 Mensajería
- Mensajes en tiempo real con Socket.io
- Edición y eliminación de mensajes
- Reacciones con emojis
- Menciones de usuarios
- Adjuntos y embeds
- Mensajes anclados

### 🎙️ Voz & Video
- Llamadas de voz en tiempo real
- Compartir pantalla
- Cámara y micrófono
- Grabación de llamadas
- Control de estado (online, away, offline, dnd)

### 🎮 Integraciones
- Vincular cuentas de juegos
- Estado de juego
- Acceso desde la app

### 💎 Sistema de Tiers (Nitro-like)
- **Free**: Sin límites básicos
- **Pro**: HD Streaming, Estado personalizado, 100MB uploads
- **Elite**: HD Streaming, Estado personalizado, 500MB uploads, Soporte prioritario
- **Supreme**: Uploads ilimitados, HD Streaming, Estado personalizado, Acceso temprano, Soporte prioritario

## 🛠️ Tecnología

### Backend
- **Node.js** con Express
- **MongoDB** para base de datos
- **Socket.io** para comunicación en tiempo real
- **JWT** para autenticación
- **Bcrypt** para contraseñas seguras

### Frontend
- **React** con Vite
- **Socket.io Client** para comunicación en tiempo real
- **TailwindCSS** para estilos
- **React Query** para manejo de datos

## 📦 Instalación

### Backend
```bash
npm install
cp .env.example .env
# Configura tus variables de entorno
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

## 🚀 Uso

1. Registra tu cuenta (el primer usuario será Founder)
2. Crea servidores
3. Invita a amigos
4. Crea canales
5. ¡Empieza a chatear!

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Users
- `GET /api/users/:id` - Obtener usuario
- `PATCH /api/users/:id` - Actualizar perfil
- `POST /api/users/:id/link-game` - Vincular juego
- `POST /api/users/:id/add-friend` - Agregar amigo
- `POST /api/users/:id/tier-upgrade` - Mejorar tier

### Servers
- `POST /api/servers` - Crear servidor
- `GET /api/servers/:id` - Obtener servidor
- `PATCH /api/servers/:id` - Actualizar servidor
- `POST /api/servers/:id/join` - Unirse a servidor
- `POST /api/servers/:id/roles` - Crear rol
- `POST /api/servers/:id/leave` - Dejar servidor

### Channels
- `POST /api/channels` - Crear canal
- `GET /api/channels/:id` - Obtener canal
- `PATCH /api/channels/:id` - Actualizar canal
- `DELETE /api/channels/:id` - Eliminar canal

### Messages
- `POST /api/messages` - Enviar mensaje
- `PATCH /api/messages/:id` - Editar mensaje
- `DELETE /api/messages/:id` - Eliminar mensaje
- `POST /api/messages/:id/react` - Agregar reacción
- `GET /api/messages/channel/:channelId` - Obtener mensajes del canal

## 🎨 Logo & Branding

TekVerse utiliza una estética moderna con colores vibrantes que combinan con la identidad Tek:
- Color primario: #00D4FF (Cyan)
- Color secundario: #FF006E (Magenta)
- Neutro: #1A1A1A (Dark)

## 📄 Licencia

MIT

---

**Hecho con ❤️ por el equipo de TekVerse**