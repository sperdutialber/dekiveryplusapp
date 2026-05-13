import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { cerrarSesion, consultarIA, guardarSesion, login, obtenerPerfil } from "./api";
import { socket } from "./services/socket";
import { useAnimacion } from "./hooks/useAnimacion";
import AnimacionGlobal from "./components/AnimacionGlobal";

function Login({ onLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const submit = async (e) => {
    e.preventDefault();
    const data = await login({ email, password });
    if (!data.token || data.usuario?.rol !== "emprendedor") {
      setError(data.error || "Credenciales invalidas o rol sin permiso");
      return;
    }
    guardarSesion(data);
    onLogin(data.usuario);
  };
  return <form onSubmit={submit}><h2>Login Emprendedor</h2><input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" /><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" /><button>Entrar</button><p>{error}</p></form>;
}

export default function App() {
  const [user, setUser] = React.useState(obtenerPerfil());
  const { animacion, activar } = useAnimacion();

  React.useEffect(() => {
    if (!user?.id) return;
    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
    });
    socket.emit("join-emprendedor", user.id);
    socket.on(`emprendedor_${user.id}`, (data) => {
      if (data?.tipo === "nueva_venta") activar("nuevoPedido");
      if (data?.mensaje) alert(data.mensaje);
    });
    socket.on("alerta_clima", () => activar("lluvia"));
    socket.on("pedido-update", console.log);
    return () => {
      socket.off("connect");
      socket.off(`emprendedor_${user.id}`);
      socket.off("alerta_clima");
      socket.off("pedido-update");
    };
  }, [user, activar]);

  React.useEffect(() => {
    if (!user?.id) return;
    consultarIA("ia/precios", { trigger: "cliente-emprendedor" }).catch(() => {});
    consultarIA("ia/stock", { trigger: "cliente-emprendedor" }).catch(() => {});
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <BrowserRouter>
      <AnimacionGlobal tipo={animacion} />
      <div className="app-shell">
        <nav><Link to="/inicio">Inicio</Link> | <Link to="/productos">Productos</Link> | <Link to="/ventas">Ventas</Link> | <Link to="/metricas">Metricas</Link> | <a href="http://localhost:4000/landing/#hero" target="_blank" rel="noopener noreferrer">Ver guia de uso</a> | <button onClick={()=>{cerrarSesion();setUser(null);}}>Salir</button></nav>
        <main className="app-main">
          <Routes>
            <Route path="/inicio" element={<h2>Inicio</h2>} />
            <Route path="/productos" element={<h2>Productos</h2>} />
            <Route path="/ventas" element={<h2>Ventas</h2>} />
            <Route path="/metricas" element={<h2>Metricas</h2>} />
            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
