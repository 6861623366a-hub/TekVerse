# 🐛 Guía de Troubleshooting

## Problemas Comunes y Soluciones

### Backend

#### MongoDB no conecta
```bash
# Error: MongoNetworkError
# Solución:
1. Verifica tu MONGO_URI en .env
2. Asegúrate que MongoDB está corriendo
3. Verifica que tu IP está whitelisted en MongoDB Atlas
4. Comprueba credenciales
```

#### Puerto 5000 en uso
```bash
# Error: EADDRINUSE: address already in use :::5000
# Solución:
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Alternativa: Cambiar puerto en .env
PORT=5001
```

#### JWT Error
```bash
# Error: JsonWebTokenError: invalid token
# Solución:
1. Verifica que JWT_SECRET en .env es correcto
2. Asegúrate que el token no está expirado
3. Limpia localStorage y login nuevamente
```

### Frontend

#### No conecta al servidor
```bash
# Error: Failed to connect to http://localhost:5000
# Solución:
1. Verifica que backend está corriendo (npm start)
2. Comprueba VITE_API_URL en .env
3. Verifica CORS en server.js
4. Abre DevTools (F12) y revisa Network tab
```

#### Socket.io no funciona
```bash
# Error: WebSocket connection failed
# Solución:
1. Verifica que Socket.io está habilitado en server.js
2. Comprueba puertos en firewall
3. Intenta con polling: socket.io?transport=polling
```

#### Video/Audio no funciona
```bash
# Error: Camera/Mic not working
# Solución:
1. Verifica permisos del navegador
2. Abre DevTools > Permissions
3. Permite camera y microphone
4. Recarga la página
5. En Windows: Verifica ajustes de privacidad
```

### General

#### Instalación lenta
```bash
# Solución: Usa npm ci en lugar de npm install
npm ci
# Alternativa: npm install --legacy-peer-deps
```

#### Node version incompatible
```bash
# Error: Requires Node v16+
# Solución:
node --version  # Ver versión actual
nvm install 18  # Instalar Node 18
nvm use 18      # Usar Node 18
```

---

## Debugging

### Habilitar logs detallados
```bash
# Backend
DEBUG=* npm start

# Frontend
echo "Abre DevTools (F12) para ver logs en consola"
```

### Revisar logs de MongoDB
```bash
# En MongoDB Atlas:
1. Ve a Clusters
2. Click en cluster
3. Pestaña "Logs"
4. Selecciona "Tenant Logs"
```

### Test de API
```bash
# Usa Postman o cURL
curl -X GET http://localhost:5000/health

# Con autenticación
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users/me
```

---

## Contacto de Soporte

Si el problema persiste:
1. Revisa [GitHub Issues](https://github.com/6861623366a-hub/TekVerse/issues)
2. Crea un issue nuevo con detalles completos
3. Incluye logs y mensajes de error
4. Especifica tu sistema operativo y versiones

