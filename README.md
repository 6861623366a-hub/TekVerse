# 🌟 TekVerse - La Revolución de la Comunicación Digital

<div align="center">

![TekVerse](https://img.shields.io/badge/TekVerse-v1.0.0-cyan?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**TekVerse** es una plataforma de comunicación moderna, poderosa y escalable diseñada como la evolución definitiva de Discord. Incluye todas las características premium con un sistema de suscripción evolutivo.

[Características](#-características) • [Instalación](#-instalación) • [Documentación](#-documentación) • [Soporte](#-soporte)

</div>

---

## ✨ Características Principales

### 🎯 Sistema de Usuarios Avanzado
- ✅ Autenticación segura con JWT y bcrypt
- ✅ Perfiles completamente personalizables (avatar, banner, bio, estado)
- ✅ **Sistema de Roles**: Founder (poderes totales) vs Usuario Normal
- ✅ **Primer usuario = Founder automático** 👑
- ✅ Sistema de amigos, bloqueos y notificaciones
- ✅ Integración de cuentas de juegos (Valorant, CS:GO, LOL, etc.)
- ✅ Múltiples estados (Online, Away, Offline, DND)

### 🏰 Servidores Discord-like
- ✅ Crear servidores ilimitados
- ✅ Sistema de invitación con códigos únicos
- ✅ Roles personalizados con permisos granulares
- ✅ 4 niveles de verificación
- ✅ Canales NSFW configurables
- ✅ El propietario es automáticamente Founder en su servidor

### 💬 Canales de Comunicación
- ✅ Canales de texto, voz y escenario
- ✅ Nombres y descripciones personalizables
- ✅ Permisos avanzados por usuario/rol
- ✅ Límite de velocidad de mensajes
- ✅ Categorías de canales organizadas
- ✅ Mensajes anclados (pinned messages)

### 💌 Mensajería en Tiempo Real
- ✅ Mensajes instantáneos con Socket.io
- ✅ Edición y eliminación de mensajes
- ✅ Reacciones con emojis
- ✅ Menciones de usuarios con notificaciones
- ✅ Adjuntos (fotos, vídeos, archivos)
- ✅ Embeds customizados
- ✅ Indicador de escritura en tiempo real
- ✅ Búsqueda de mensajes

### 🎙️ Voz y Vídeo Profesional
- ✅ Llamadas de voz en tiempo real
- ✅ Videollamadas HD
- ✅ Compartir pantalla con calidad ultra
- ✅ Control independiente de cámara y micrófono
- ✅ Grabación de llamadas
- ✅ Soporte para múltiples participantes
- ✅ Conexión P2P con WebRTC
- ✅ Indicadores de conectividad

### 🎮 Integraciones Gaming
- ✅ Vincular cuentas de múltiples juegos
- ✅ Estado de juego en tiempo real
- ✅ Actividad en el perfil
- ✅ Antecedentes de juegos en la plataforma

### 💎 Sistema de Tiers (Nitro++ Evolution)

| Tier | Precio | Características |
|------|--------|------------------|
| **Free** | Gratis | Uso ilimitado básico |
| **Pro** | $4.99/mes | 🎬 HD Streaming + 🌟 Estado personalizado + 📤 100MB uploads |
| **Elite** | $9.99/mes | 🎬 HD Streaming + 🌟 Estado personalizado + 📤 500MB uploads + 🎧 Soporte prioritario |
| **Supreme** | $19.99/mes | 🎬 4K Streaming + 🌟 Estado personalizado + 📤 Uploads ilimitados + ⚡ Acceso temprano + 🎧 Soporte VIP |

### 📱 Experiencia de Usuario
- ✅ Interfaz moderna y responsive
- ✅ Tema oscuro nativo (Tek-themed)
- ✅ Modo compacto/expandido
- ✅ Notificaciones en tiempo real
- ✅ Accesos directos personalizables
- ✅ Dark mode por defecto (compatible con light)

---

## 🚀 Instalación Rápida

### Requisitos
- Node.js v16+
- MongoDB (Cloud o local)
- npm o yarn

### En 3 Pasos

```bash
# 1️⃣ Clonar y preparar
git clone https://github.com/6861623366a-hub/TekVerse.git
cd TekVerse

# 2️⃣ Instalar dependencias
bash setup.sh

# 3️⃣ Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Backend: npm start
# Frontend: cd client && npm run dev
```

### URLs de Desarrollo
- 🖥️ **Backend**: http://localhost:5000
- 💻 **Frontend**: http://localhost:3000
- 📊 **Health Check**: http://localhost:5000/health

---

## 📖 Documentación

- **[Guía de Instalación](./INSTALLATION_GUIDE.md)** - Instalación completa paso a paso
- **[Documentación de Desarrollo](./DEVELOPMENT.md)** - Arquitectura, API endpoints, Socket.io events
- **[API Reference](./INSTALLATION_GUIDE.md#-api-endpoints)** - Todos los endpoints REST
- **[Socket.io Events](./INSTALLATION_GUIDE.md#-socketio-events)** - Eventos en tiempo real

---

## 🏗️ Estructura del Proyecto

```
TekVerse/
├── server.js                  # 🚀 Entrada del servidor
├── models/                    # 📊 Esquemas MongoDB
│   ├── User.js
│   ├── Server.js
│   ├── Channel.js
│   ├── Message.js
│   ├── VoiceCall.js
│   ├── DirectMessage.js
│   └── Notification.js
├── routes/                    # 🛣️ Rutas API
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── serverRoutes.js
│   ├── channelRoutes.js
│   ├── messageRoutes.js
│   ├── voiceRoutes.js
│   ├── dmRoutes.js
│   └── notificationRoutes.js
├── handlers/                  # ⚙️ Manejadores de eventos
│   └── socketHandler.js       # Socket.io en tiempo real
├── middleware/                # 🔒 Middleware
│   └── auth.js                # Verificación JWT
├── client/                    # 🎨 Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Páginas
│   │   ├── store.js           # Zustand state management
│   │   ├── api.js             # Cliente API
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
├── package.json
└── .env.example
```

---

## 🎨 Branding TekVerse

### Colores de Marca
```
🔵 Primario (Cyan):    #00D4FF
💜 Secundario (Magenta): #FF006E
⚫ Oscuro:             #1A1A1A
⚪ Gris Oscuro:        #2A2A2A
```

### Logo
El logo incorpora la letra "T" en un gradiente cyan-azul dinámico sobre fondo oscuro, reflejando la modernidad y energía de la plataforma.

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración de 30 días
- ✅ CORS configurado
- ✅ Helmet.js para headers de seguridad
- ✅ Validación de inputs con express-validator
- ✅ Rate limiting en rutas críticas
- ✅ Sanitización de datos

---

## 📊 Tecnología Stack

### Backend
```
Node.js + Express.js
├── MongoDB + Mongoose
├── Socket.io (tiempo real)
├── JWT + Bcrypt (seguridad)
├── Helmet (headers seguridad)
└── CORS (control origen)
```

### Frontend
```
React 18 + Vite
├── Zustand (estado)
├── Socket.io Client (tiempo real)
├── Axios (HTTP)
├── React Router v6
├── Tailwind CSS (estilos)
└── Date-fns (fechas)
```

---

## 🚀 Despliegue en Producción

### Backend (Heroku)
```bash
heroku create tu-tekverse
heroku config:set MONGO_URI=<your_mongo_uri>
heroku config:set JWT_SECRET=<secure_secret>
git push heroku main
```

### Frontend (Vercel)
```bash
vercel
# Configura VITE_API_URL en production
```

---

## 📈 Estadísticas

- 📦 **30+ endpoints** API RESTful
- 🔌 **20+ eventos** Socket.io
- 🗄️ **7 modelos** MongoDB
- 💻 **15+ componentes** React
- 🎨 **Responsive design** mobile-first
- ⚡ **Optimizado** para producción

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

MIT License - Hecho con ❤️ por el equipo de TekVerse

---

## 🎯 Hoja de Ruta (Roadmap)

- [ ] Autenticación con Google/Discord
- [ ] Soporte para threads
- [ ] Bots personalizados
- [ ] Dashboard de administración
- [ ] Análitica avanzada
- [ ] Marketplace de temas
- [ ] Integración con Twitch
- [ ] Modo de presentación
- [ ] Traducción multiidioma
- [ ] Aplicación móvil nativa

---

## 💬 Contacto & Soporte

- 📧 **Email**: support@tekverse.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/6861623366a-hub/TekVerse/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/6861623366a-hub/TekVerse/discussions)

---

<div align="center">

### ⭐ Si te gusta TekVerse, ¡no olvides darle una estrella! ⭐

**Hecho con 💙 para la comunidad de desarrolladores y gamers**

🚀 **¡Bienvenido a la evolución de la comunicación digital!** 🚀

</div>