# Social App - Guía de Configuración y Despliegue

Este proyecto es una aplicación de Flutter dinámica diseñada para Android, iOS y Web. A continuación, se detallan los pasos para subir el código a un repositorio propio y desplegarlo en Vercel.

## 🚀 Requisitos Previos

- Flutter SDK instalado.
- Cuenta de GitHub/GitLab/Bitbucket.
- Cuenta de Vercel (opcional para despliegue web).
- Node.js y npm (para comandos de Vercel).

## 📂 Estructura del Proyecto

El sistema utiliza una arquitectura modular:
- `lib/core/`: Temas (Claro/Oscuro) y constantes.
- `lib/data/`: Modelos, Repositorios (Mock y MariaDB) y Servicios (Auth).
- `lib/ui/`: Pantallas (Mapa, Feed, Recompensas, Admin) y Widgets.

## 💾 Configuración de Base de Datos (MariaDB)

Para usar tu base de datos local:
1. **Importa el esquema:** Ejecuta el archivo `database/schema.sql` en tu servidor MariaDB (usando phpMyAdmin, HeidiSQL o consola).
2. **Habilita el Repositorio:**
   - Abre `lib/main.dart`.
   - Comenta la línea de `MockRepository()`.
   - Descomenta el bloque de `MariaDBRepository`.
3. **Credenciales:** Asegúrate de poner la IP local de tu PC (no use 'localhost' si pruebas en un móvil físico, usa la IP de tu red WiFi).

## 🌐 Visualización en el Navegador (Local)

Si quieres ver cómo queda la app sin instalarla en un móvil:
1. Asegúrate de tener el soporte web activado: `flutter create --platforms web .`
2. Ejecuta: `flutter run -d chrome` (o `edge`)
3. La app se abrirá automáticamente en tu navegador.

## 🚀 Despliegue en Vercel

Vercel permite alojar la versión web de tu app Flutter de forma gratuita.

### Paso 1: Construir para Web
```bash
flutter build web --release
```

### Paso 2: Subir a GitHub
1. Crea un repositorio nuevo en GitHub.
2. Sube los archivos:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin TU_URL_DE_GITHUB
git push -u origin main
```

### Paso 3: Conectar con Vercel
1. Ve a [Vercel](https://vercel.com).
2. Haz clic en "Add New" -> "Project".
3. Importa tu repositorio de GitHub.
4. En **Build and Output Settings**:
   - **Framework Preset:** Other
   - **Build Command:** `flutter build web --release`
   - **Output Directory:** `build/web`
5. Haz clic en **Deploy**.

## 🛠️ Notas Adicionales
- **Firebase:** Debes configurar Firebase ejecutando `flutterfire configure` para que el inicio de sesión con Google funcione correctamente.
- **Mapas:** Necesitas una API Key de Google Maps configurada en la consola de Google Cloud.

---
*Desarrollado con Jules - Tu Ingeniero de Software.*
