#!/usr/bin/env python3
"""
Test de servidor para verificar si el HTML se sirve correctamente
"""
import http.server
import socketserver
import os

PORT = 5001

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        html_path = os.path.join(script_dir, "client_android.html")
        
        print(f"GET {self.path}")
        
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Reemplazar WS_URL
            ws_url = "wss://marauding-suitor-preflight.ngrok-free.dev"
            content = content.replace('{{WS_URL}}', ws_url)
            
            print(f"✓ HTML servido ({len(content)} bytes)")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', len(content.encode('utf-8')))
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except Exception as e:
            print(f"✗ Error: {e}")
            self.send_response(500)
            self.end_headers()

if __name__ == "__main__":
    print(f"Sirviendo desde puerto {PORT}")
    print(f"Abre: http://localhost:{PORT}")
    print("(Presiona Ctrl+C para detener)\n")
    
    with socketserver.TCPServer(("", PORT), TestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido")
