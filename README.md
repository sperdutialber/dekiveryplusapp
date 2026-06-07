=====================================================
                        AUDIO STREAM - SERVIDOR PC
=====================================================

Estoy configurando ngrok

IP local : 10.1.19.2:5000

Pega la URL de ngrok (sin https://):
ngrok URL > marauding-suitor-preflight.ngrok-free.dev

WebSocket : wss://marauding-suitor-preflight.ngrok-free.dev
Pagina    : https://marauding-suitor-preflight.ngrok-free.dev

Microfono: CABLE Output (VB-Audio Virtual
[MIC] Capturando audio... (Ctrl+C para detener)

-----------------------------------------------------
Instrucciones rápidas

- Ejecutar el servidor en el PC:

```bash
python server_pc.py
```

- Exponer el puerto 5000 con ngrok (ejemplo):

```bash
ngrok http 5000
```

- Copia la URL pública que te da ngrok (sin `https://`) y pégala cuando el servidor la solicite.

Ejemplo (pegar exactamente lo que aparece en ngrok):

```
marauding-suitor-preflight.ngrok-free.dev
```

Notas
- La WebSocket se construye como `wss://<tu-subdominio>` y la página accesible por `https://<tu-subdominio>`.
- Si el servidor solicita la URL, pega sólo el dominio sin `https://`.

Archivos principales
- `server_pc.py`: servidor que captura audio y espera la URL de ngrok.
- `client_android.html`: cliente web para reproducir/visualizar el stream.
- `instalar.py` / `iniciar.bat`: scripts de ayuda para instalación/arranque.

Si quieres, puedo añadir más detalles o crear un small script para automatizar ngrok y el arranque del servidor.
