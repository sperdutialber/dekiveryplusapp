#!/usr/bin/env python3
"""
Servidor HTTP simple para servir client_android.html
Reemplaza {{WS_URL}} con la URL de ngrok
"""
import http.server
import socketserver
import os
import sys

PORT = 5001
NGROK_URL = "wss://marauding-suitor-preflight.ngrok-free.dev"

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path.endswith(".html"):
            script_dir = os.path.dirname(os.path.abspath(__file__))
            html_path = os.path.join(script_dir, "client_android.html")
            
            try:
                with open(html_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Reemplazar WS_URL
                content = content.replace('{{WS_URL}}', NGROK_URL)
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', len(content.encode('utf-8')))
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"HTML no encontrado")
        else:
            super().do_GET()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        NGROK_URL = sys.argv[1]
    
    print(f"Iniciando servidor HTTP en puerto {PORT}")
    print(f"Sirviendo HTML con WS_URL: {NGROK_URL}")
    print(f"Abre: http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido")
