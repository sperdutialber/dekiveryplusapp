#!/bin/bash
# Script para automatizar la subida a tu repositorio de GitHub

REPO_URL="https://github.com/sperdutialber/socialapp"

echo "🚀 Iniciando proceso de preparación..."

# Asegurarse de estar en la carpeta del proyecto
cd "$(dirname "$0")"

# Inicializar Git si no existe
if [ ! -d ".git" ]; then
    git init
    echo "✅ Repositorio Git inicializado."
fi

# Añadir todos los archivos
git add .

# Crear el primer commit
git commit -m "Implementación inicial: Social App Flutter con MariaDB y Vercel config"

# Renombrar rama a main
git branch -M main

# Añadir el remoto (si ya existe, lo actualiza)
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

echo ""
echo "----------------------------------------------------------"
echo "✅ TODO LISTO PARA SUBIR"
echo "----------------------------------------------------------"
echo "Como no tengo acceso a tus credenciales, por favor ejecuta:"
echo ""
echo "  git push -u origin main"
echo ""
echo "Esto subirá el código a: $REPO_URL"
echo "----------------------------------------------------------"
echo ""
echo "🌐 DESPLIEGUE EN VERCEL:"
echo "1. Ve a https://vercel.com/new"
echo "2. Selecciona el repositorio 'socialapp'."
echo "3. En 'Build & Development Settings':"
echo "   - Build Command: flutter build web --release"
echo "   - Output Directory: build/web"
echo "4. ¡Haz clic en Deploy y listo!"
echo "----------------------------------------------------------"
