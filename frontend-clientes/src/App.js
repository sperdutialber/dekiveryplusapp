import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import EmprendedorHome from "./pages/EmprendedorHome";
import { socket } from "./services/socket";
import "./styles.css";

const API_URL = "http://localhost:4000/api";
const LANDING_URL = "http://localhost:4000/landing/#hero";
const DEMO = { email: "emprendedor@deliveryplus.local", password: "emprendedor123" };

function redirectByRole(rol, navigate) {
  if (rol === "admin") navigate("/admin", { replace: true });
  if (rol === "comercio") navigate("/comercio", { replace: true });
  if (rol === "repartidor") navigate("/repartidor", { replace: true });
  if (rol === "emprendedor") navigate("/emprendedor", { replace: true });
}

function Login({ onLogin }) {
  const [email, setEmail] = React.useState(DEMO.email);
  const [password, setPassword] = React.useState(DEMO.password);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    const rol = data.rol || data.usuario?.rol;

    if (!response.ok || !data.token || !rol) {
      setError(data.msg || "Usuario sin permiso para este frontend");
      return;
    }

    const session = { ...data, rol };
    localStorage.setItem("token", session.token);
    localStorage.setItem("rol", rol);
    localStorage.setItem("usuario", JSON.stringify(session.usuario));
    localStorage.setItem("deliveryplus_session", JSON.stringify(session));
    onLogin(session);
    redirectByRole(rol, navigate);
  };

  return (
    <main className="app-shell">
      <section className="panel auth-panel">
        <h1>Acceso DeliveryPlus</h1>
        <form className="stack-form" onSubmit={submit}>
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <button type="submit">Entrar</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </section>
    </main>
  );
}

function Layout({ session, onLogout }) {
  const rol = session?.rol || session?.usuario?.rol;

  return (
    <div className="app-shell layout-shell">
      <aside className="side-menu">
        <h2>DeliveryPlus</h2>
        <Link to="/">Inicio</Link>
        {rol === "emprendedor" && <Link to="/emprendedor">Panel emprendedor</Link>}
        <Link to="/perfil">Perfil</Link>
        <Link to="/configuracion">Configuracion</Link>
        <a href={LANDING_URL} target="_blank" rel="noopener noreferrer">Ver guia de uso</a>
        <button type="button" onClick={onLogout}>Salir</button>
      </aside>
      <main className="content-panel">
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route
            path="/emprendedor"
            element={
              <ProtectedRoute rolPermitido={["emprendedor"]}>
                <EmprendedorHome />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<ProtectedRoute rolPermitido={["admin"]}><RolePage title="Admin" /></ProtectedRoute>} />
          <Route path="/comercio" element={<ProtectedRoute rolPermitido={["comercio"]}><RolePage title="Comercio" /></ProtectedRoute>} />
          <Route path="/repartidor" element={<ProtectedRoute rolPermitido={["repartidor"]}><RolePage title="Repartidor" /></ProtectedRoute>} />
          <Route path="/perfil" element={<Perfil usuario={session.usuario} />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function RoleRedirect() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const rol = localStorage.getItem("rol");

    if (rol === "admin") navigate("/admin", { replace: true });
    if (rol === "comercio") navigate("/comercio", { replace: true });
    if (rol === "repartidor") navigate("/repartidor", { replace: true });
    if (rol === "emprendedor") navigate("/emprendedor", { replace: true });
  }, [navigate]);

  return (
    <section className="panel">
      <h1>Redirigiendo</h1>
      <p>Preparando tu espacio de trabajo.</p>
    </section>
  );
}

function RolePage({ title }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      <p>Ruta protegida activa para el rol {title.toLowerCase()}.</p>
    </section>
  );
}

function Perfil({ usuario }) {
  return <section className="panel"><h1>Perfil</h1><p>{usuario.nombre}</p><p>{usuario.email}</p><p>Rol: {usuario.rol}</p></section>;
}

function Configuracion() {
  return <section className="panel"><h1>Configuracion</h1><p>Notificaciones y preferencias listas para conectar.</p></section>;
}

export default function App() {
  const [session, setSession] = React.useState(() => {
    const raw = localStorage.getItem("deliveryplus_session");
    return raw ? JSON.parse(raw) : null;
  });

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
    });
    socket.on("tracking-update", console.log);
    socket.on("pedido-update", console.log);

    return () => {
      socket.off("connect");
      socket.off("tracking-update");
      socket.off("pedido-update");
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    localStorage.removeItem("deliveryplus_session");
    setSession(null);
  };

  return (
    <BrowserRouter>
      {!session ? (
        <Routes>
          <Route path="*" element={<Login onLogin={setSession} />} />
        </Routes>
      ) : (
        <Layout session={session} onLogout={logout} />
      )}
    </BrowserRouter>
  );
}
