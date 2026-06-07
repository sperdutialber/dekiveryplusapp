@echo off
setlocal enabledelayedexpansion
title Audio Stream - Control Panel

echo ========================================
echo   AUDIO STREAM - INICIANDO SERVICIOS
echo ========================================
echo.

REM Instalar dependencias
echo [1/4] Instalando dependencias Python...
pip install sounddevice numpy -q
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

REM Abrir ngrok
echo [2/4] Iniciando ngrok en puerto 5000...
start "ngrok - Port 5000" cmd /k "ngrok http 5000"
timeout /t 3 /nobreak

REM Abrir servidor HTTP
echo [3/4] Iniciando servidor HTTP en puerto 8000...
start "HTTP Server - Puerto 8000" cmd /k "cd /d "%~dp0" && python -m http.server 8000"
timeout /t 2 /nobreak

REM Iniciar server_pc.py
echo [4/4] Iniciando server_pc.py...
echo.
echo ========================================
echo   SERVIDOR AUDIO STREAM
echo ========================================
echo.
cd /d "%~dp0"
py "%~dp0server_pc.py"

pause
