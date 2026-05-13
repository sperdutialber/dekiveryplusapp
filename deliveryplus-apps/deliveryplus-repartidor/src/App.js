import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { API_URL, actualizarPosicion, guardarSesion, login as loginRequest } from "./api";
import { socket } from "./services/socket";
import "./App.css";

const LANDING_URL = "http://localhost:4000/landing/#hero";
const ROLE = "repartidor";
const DEMO = { email: "repartidor@deliveryplus.local", password: "repartidor123" };

function Login({ onLogin }) {
  const [email, setEmail] = React.useState(DEMO.email);
  const [password, setPassword] = React.useState(DEMO.password);
  const [error, setError] = React.useState("");
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const data = await loginRequest({ email, password }).catch((error) => ({ msg: error.message }));
    if (!data.token || data.usuario?.rol !== ROLE) { setError(data.msg || "Usuario sin permiso para repartidores"); return; }
    guardarSesion(data);
    localStorage.setItem("deliveryplus_repartidor_session", JSON.stringify(data));
    onLogin(data);
  };
  return <main className="dp-shell"><section className="dp-card"><h1>Repartidores DeliveryPlus</h1><form className="dp-form" onSubmit={submit}><input value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="Email" /><input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} placeholder="Password" /><button>Entrar</button>{error && <p>{error}</p>}</form></section></main>;
}

function Layout({ session, onLogout }) {
  return <div className="dp-shell dp-layout"><aside className="dp-menu"><h2>Repartidores</h2><Link to="/">Home</Link><Link to="/dashboard">Dashboard</Link><Link to="/perfil">Perfil</Link><Link to="/configuracion">Configuracion</Link><a href={LANDING_URL} target="_blank" rel="noopener noreferrer">Ver guia de uso</a><button onClick={onLogout}>Salir</button></aside><main className="dp-content"><Routes><Route path="/" element={<Home />} /><Route path="/dashboard" element={<Dashboard token={session.token} repartidorId={session.usuario?.id} />} /><Route path="/perfil" element={<Perfil usuario={session.usuario} />} /><Route path="/configuracion" element={<Configuracion />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></main></div>;
}

function Home() { return <section className="dp-card"><h1>Home Repartidores</h1><p>Pedidos asignados, tracking y estado operativo.</p></section>; }
function Dashboard({ token, repartidorId }) {
  const enviarTracking = async () => {
    const trackingPayload = { lat: -27.37, lng: -55.9, estado: "disponible", repartidorId };
    socket.emit("tracking", trackingPayload);
    await actualizarPosicion(-27.37, -55.9, "disponible");
  };
  return <section className="dp-card"><h1>Dashboard</h1><p>Tracking listo para emitir ubicacion local.</p><button onClick={enviarTracking}>Enviar tracking demo</button></section>;
}
function Perfil({ usuario }) { return <section className="dp-card"><h1>Perfil</h1><p>{usuario.nombre}</p><p>{usuario.email}</p><p>Rol: {usuario.rol}</p></section>; }
function Configuracion() { return <section className="dp-card"><h1>Configuracion</h1><p>Estado, disponibilidad y notificaciones.</p></section>; }

export default function App() {
  const [session, setSession] = React.useState(() => { const raw = localStorage.getItem("deliveryplus_repartidor_session"); return raw ? JSON.parse(raw) : null; });
  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
    });
    if (session?.usuario?.id) {
      socket.emit("join-repartidor", session.usuario.id);
    }
    socket.on("tracking-update", console.log);
    socket.on("pedido-update", console.log);

    return () => {
      socket.off("connect");
      socket.off("tracking-update");
      socket.off("pedido-update");
    };
  }, [session]);
  const logout = () => { localStorage.removeItem("deliveryplus_repartidor_session"); setSession(null); };
  if (!session) return <Login onLogin={setSession} />;
  return <BrowserRouter><Layout session={session} onLogout={logout} /></BrowserRouter>;
}
