import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { API_URL, guardarSesion, login as loginRequest } from "./api";
import { socket } from "./services/socket";
import "./App.css";

const LANDING_URL = "http://localhost:4000/landing/#hero";
const ROLE = "comercio";
const DEMO = { email: "comercio@deliveryplus.local", password: "comercio123" };

function Login({ onLogin }) {
  const [email, setEmail] = React.useState(DEMO.email);
  const [password, setPassword] = React.useState(DEMO.password);
  const [error, setError] = React.useState("");
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const data = await loginRequest({ email, password }).catch((error) => ({ msg: error.message }));
    if (!data.token || data.usuario?.rol !== ROLE) { setError(data.msg || "Usuario sin permiso para comercios"); return; }
    guardarSesion(data);
    localStorage.setItem("deliveryplus_comercio_session", JSON.stringify(data));
    onLogin(data);
  };
  return <main className="dp-shell"><section className="dp-card"><h1>Comercios DeliveryPlus</h1><form className="dp-form" onSubmit={submit}><input value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="Email" /><input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} placeholder="Password" /><button>Entrar</button>{error && <p>{error}</p>}</form></section></main>;
}

function Layout({ session, onLogout }) {
  return <div className="dp-shell dp-layout"><aside className="dp-menu"><h2>Comercios</h2><Link to="/">Home</Link><Link to="/dashboard">Dashboard</Link><Link to="/perfil">Perfil</Link><Link to="/configuracion">Configuracion</Link><a href={LANDING_URL} target="_blank" rel="noopener noreferrer">Ver guia de uso</a><button onClick={onLogout}>Salir</button></aside><main className="dp-content"><Routes><Route path="/" element={<Home />} /><Route path="/dashboard" element={<Dashboard token={session.token} />} /><Route path="/perfil" element={<Perfil usuario={session.usuario} />} /><Route path="/configuracion" element={<Configuracion />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></main></div>;
}

function Home() { return <section className="dp-card"><h1>Home Comercios</h1><p>Gestion de pedidos, ventas y despacho.</p></section>; }
function Dashboard({ token }) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { fetch(`${API_URL}/comercios/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then((r)=>r.json()).then(setData).catch(()=>setData(null)); }, [token]);
  return <section className="dp-card"><h1>Dashboard</h1><p>Pedidos pendientes: {data?.pedidosPendientes ?? 0}</p><p>Ventas hoy: {data?.ventasHoy ?? 0}</p></section>;
}
function Perfil({ usuario }) { return <section className="dp-card"><h1>Perfil</h1><p>{usuario.nombre}</p><p>{usuario.email}</p><p>Rol: {usuario.rol}</p></section>; }
function Configuracion() { return <section className="dp-card"><h1>Configuracion</h1><p>Preferencias de comercio y notificaciones.</p></section>; }

export default function App() {
  const [session, setSession] = React.useState(() => { const raw = localStorage.getItem("deliveryplus_comercio_session"); return raw ? JSON.parse(raw) : null; });
  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
    });
    if (session?.usuario?.id) {
      socket.emit("join-comercio", session.usuario.id);
    }
    socket.on("tracking-update", console.log);
    socket.on("pedido-update", console.log);

    return () => {
      socket.off("connect");
      socket.off("tracking-update");
      socket.off("pedido-update");
    };
  }, [session]);
  const logout = () => { localStorage.removeItem("deliveryplus_comercio_session"); setSession(null); };
  if (!session) return <Login onLogin={setSession} />;
  return <BrowserRouter><Layout session={session} onLogout={logout} /></BrowserRouter>;
}
