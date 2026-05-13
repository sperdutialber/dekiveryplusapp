@echo off
setlocal
title DeliveryPlus - Inicio general

set "ROOT=%~dp0"
if not exist "%ROOT%package.json" (
  if exist "G:\deliveryplus2\package.json" (
    set "ROOT=G:\deliveryplus2\"
  )
)

echo.
echo ==========================================
echo  Iniciando DeliveryPlus (backend + apps)
echo ==========================================
echo.

echo Liberando puertos 3000,3001,3002,3003,4000...
for %%P in (3000 3001 3002 3003 4000) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
    taskkill /PID %%A /F >nul 2>nul
  )
)
timeout /t 1 >nul

if not exist "%ROOT%package.json" (
  echo [ERROR] No se encontro package.json en la raiz:
  echo %ROOT%
  echo.
  echo Ejecuta este .bat dentro de la carpeta del proyecto o deja disponible:
  echo G:\deliveryplus2
  pause
  exit /b 1
)

start "DeliveryPlus Backend (4000)" cmd /k "cd /d "%ROOT%" && npm start"
start "DeliveryPlus Admin (3000)" cmd /k "cd /d "%ROOT%deliveryplus-apps\deliveryplus-admin" && set PORT=3000 && npm start"
start "DeliveryPlus Emprendedor (3001)" cmd /k "cd /d "%ROOT%deliveryplus-apps\deliveryplus-emprendedor" && set PORT=3001 && npm start"
start "DeliveryPlus Negocio (3002)" cmd /k "cd /d "%ROOT%deliveryplus-apps\deliveryplus-negocio" && set PORT=3002 && npm start"
start "DeliveryPlus Repartidor (3003)" cmd /k "cd /d "%ROOT%deliveryplus-apps\deliveryplus-repartidor" && set PORT=3003 && npm start"

timeout /t 2 >nul
start http://localhost:3000
start http://localhost:3001
start http://localhost:3002
start http://localhost:3003

echo Servicios lanzados en ventanas separadas.
echo.
echo URLs esperadas:
echo - Backend:      http://localhost:4000
echo - Admin:        http://localhost:3000
echo - Emprendedor:  http://localhost:3001
echo - Negocio:      http://localhost:3002
echo - Repartidor:   http://localhost:3003
echo.
pause
