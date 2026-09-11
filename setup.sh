#!/bin/bash

# TekVerse Setup Script

echo "🚀 Iniciando configuración de TekVerse..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node -v)"

# Instalar dependencias del backend
echo "\n📦 Instalando dependencias del backend..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi

# Instalar dependencias del frontend
echo "\n📦 Instalando dependencias del frontend..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

cd ..

# Crear archivo .env
if [ ! -f .env ]; then
    echo "\n🔧 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Recuerda configurar las variables en .env"
fi

echo "\n✅ ¡Configuración completada!"
echo "\n📖 Próximos pasos:"
echo "1. Configura las variables en .env"
echo "2. Backend: npm start"
echo "3. Frontend: cd client && npm run dev"
echo "\n🎮 ¡Bienvenido a TekVerse!"
