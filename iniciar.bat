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

REM Verificar si ngrok está disponible
echo [2/4] Verificando ngrok...
where ngrok >nul 2>&1
if errorlevel 1 (
    echo.
    echo ADVERTENCIA: ngrok no está instalado o no está en el PATH
    echo.
    echo Para instalar ngrok:
    echo   1. Descarga desde https://ngrok.com/download
    echo   2. Extrae el archivo
    echo   3. Copia ngrok.exe a C:\Windows\System32 o añade a PATH
    echo.
    echo Alternativamente, ejecuta ngrok manualmente:
    echo   ngrok http 5001
    echo.
    pause
) else (
    echo ngrok encontrado. Iniciando en puerto 5001...
    start "ngrok - Port 5001" cmd /k "ngrok http 5001"
    timeout /t 3 /nobreak
)

REM Iniciar server_pc.py
echo [3/3] Iniciando server_pc.py en puerto 5001...
echo.
echo ========================================
echo   SERVIDOR AUDIO STREAM
echo ========================================
echo.
cd /d "%~dp0"
python server_pc.py

pause
