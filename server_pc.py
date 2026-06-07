import socket, threading, struct, sys, os, hashlib, base64, http.server
import sounddevice as sd
import numpy as np

PORT     = 5000
CHUNK    = 2048
CHANNELS = 1
RATE     = 44100

ws_clients      = []
ws_clients_lock = threading.Lock()
running         = True

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def is_websocket(data):
    try:
        text = data.decode('utf-8', errors='ignore')
        return 'Upgrade: websocket' in text or 'upgrade: websocket' in text.lower()
    except:
        return False

def is_http(data):
    try:
        text = data.decode('utf-8', errors='ignore')
        return text.startswith('GET') or text.startswith('POST')
    except:
        return False

def ws_handshake(conn, data):
    headers = {}
    for line in data.decode('utf-8', errors='replace').split('\r\n')[1:]:
        if ':' in line:
            k, v = line.split(':', 1)
            headers[k.strip().lower()] = v.strip()
    key = headers.get('sec-websocket-key', '')
    if not key:
        return False
    accept = base64.b64encode(hashlib.sha1((key + WS_MAGIC).encode()).digest()).decode()
    conn.sendall((
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Accept: {accept}\r\n\r\n"
    ).encode())
    return True

def send_http(conn, body_bytes, content_type='text/html; charset=utf-8'):
    response = (
        "HTTP/1.1 200 OK\r\n"
        f"Content-Type: {content_type}\r\n"
        f"Content-Length: {len(body_bytes)}\r\n"
        "Connection: close\r\n"
        "\r\n"
    ).encode() + body_bytes
    conn.sendall(response)

def serve_html(conn, ngrok_url):
    script_dir  = os.path.dirname(os.path.abspath(__file__))
    client_path = os.path.join(script_dir, "client_android.html")
    with open(client_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Reemplazar la URL del WebSocket con la de ngrok
    content = content.replace('{{WS_URL}}', ngrok_url)
    send_http(conn, content.encode('utf-8'))
    conn.close()

def ws_send_binary(conn, data):
    length = len(data)
    if length <= 125:
        header = bytes([0x82, length])
    elif length <= 65535:
        header = bytes([0x82, 126]) + struct.pack('>H', length)
    else:
        header = bytes([0x82, 127]) + struct.pack('>Q', length)
    conn.sendall(header + data)

def ws_read_frame(conn):
    try:
        conn.settimeout(10)
        header = b""
        while len(header) < 2:
            b = conn.recv(2 - len(header))
            if not b:
                return None
            header += b
        opcode = header[0] & 0x0F
        mask_len = header[1]
        masked = bool(mask_len & 0x80)
        payload_len = mask_len & 0x7F
        if payload_len == 126:
            payload_len = struct.unpack('>H', conn.recv(2))[0]
        elif payload_len == 127:
            payload_len = struct.unpack('>Q', conn.recv(8))[0]
        mask_key = conn.recv(4) if masked else b""
        payload = b""
        remaining = payload_len
        while remaining > 0:
            chunk = conn.recv(min(remaining, 4096))
            if not chunk:
                break
            payload += chunk
            remaining -= len(chunk)
        if masked:
            payload = bytes(b ^ mask_key[i % 4] for i, b in enumerate(payload))
        return opcode, payload
    except socket.timeout:
        return 'timeout', b""
    except:
        return None

def handle_ws_client(conn, addr):
    print(f"[+] Celular conectado: {addr[0]}")
    with ws_clients_lock:
        ws_clients.append(conn)
    while running:
        result = ws_read_frame(conn)
        if result is None:
            break
        if result == 'timeout':
            continue
        opcode, payload = result
        if opcode == 0x8:
            break
        if opcode == 0x9:
            try:
                conn.sendall(bytes([0x8A, 0]))
            except:
                break
    with ws_clients_lock:
        if conn in ws_clients:
            ws_clients.remove(conn)
    try:
        conn.close()
    except:
        pass
    print(f"[-] Celular desconectado: {addr[0]}")

def broadcast_ws(pcm_data):
    frame = struct.pack('>I', len(pcm_data)) + pcm_data
    with ws_clients_lock:
        dead = []
        for conn in ws_clients:
            try:
                ws_send_binary(conn, frame)
            except:
                dead.append(conn)
        for conn in dead:
            ws_clients.remove(conn)
            try:
                conn.close()
            except:
                pass

def handle_connection(conn, addr, ngrok_url):
    try:
        data = b""
        conn.settimeout(3)
        while b"\r\n" not in data:
            chunk = conn.recv(4096)
            if not chunk:
                break
            data += chunk
            if len(data) > 8192:
                break
        if b"\r\n\r\n" not in data:
            # Seguir leyendo headers
            pass
        if is_websocket(data):
            if ws_handshake(conn, data):
                handle_ws_client(conn, addr)
            else:
                conn.close()
        elif is_http(data):
            serve_html(conn, ngrok_url)
        else:
            conn.close()
    except:
        try:
            conn.close()
        except:
            pass

def accept_connections(server_sock, ngrok_url):
    while running:
        try:
            server_sock.settimeout(1)
            conn, addr = server_sock.accept()
            threading.Thread(
                target=handle_connection,
                args=(conn, addr, ngrok_url),
                daemon=True
            ).start()
        except socket.timeout:
            continue
        except:
            break

def capture_and_stream():
    global running
    print(f"Microfono: {sd.query_devices(kind='input')['name']}")
    print("[MIC] Capturando audio... (Ctrl+C para detener)\n")

    def callback(indata, frames, time, status):
        if ws_clients:
            pcm = (indata * 32767).astype(np.int16)
            broadcast_ws(pcm.tobytes())

    with sd.InputStream(samplerate=RATE, channels=CHANNELS,
                        dtype='float32', blocksize=CHUNK,
                        callback=callback):
        while running:
            sd.sleep(100)

def main():
    global running
    pc_ip = get_local_ip()

    print("=" * 54)
    print("   AUDIO STREAM - SERVIDOR PC")
    print("=" * 54)
    print(f"  IP local : {pc_ip}:{PORT}")
    print()
    print("  Pega la URL de ngrok (sin https://):")
    ngrok_input = input("  ngrok URL > ").strip()
    if not ngrok_input.startswith('wss://') and not ngrok_input.startswith('ws://'):
        ngrok_url = 'wss://' + ngrok_input.replace('https://','').replace('http://','')
    else:
        ngrok_url = ngrok_input
    print(f"\n  WebSocket : {ngrok_url}")
    print(f"  Pagina    : {ngrok_url.replace('wss://','https://').replace('ws://','http://')}")
    print("=" * 54 + "\n")

    server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_sock.bind(('0.0.0.0', PORT))
    server_sock.listen(10)

    threading.Thread(
        target=accept_connections,
        args=(server_sock, ngrok_url),
        daemon=True
    ).start()

    try:
        capture_and_stream()
    except KeyboardInterrupt:
        print("\n[!] Deteniendo...")
    finally:
        running = False
        server_sock.close()

if __name__ == '__main__':
    main()
