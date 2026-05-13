import React, { useState } from "react";
import { loginUsuario } from "../services/apiUsuarios";
import { useNavigate } from "react-router-dom";

function redirectByRole(rol, navigate) {
  if (rol === "admin") navigate("/admin");
  if (rol === "comercio") navigate("/comercio");
  if (rol === "repartidor") navigate("/repartidor");
  if (rol === "emprendedor") navigate("/emprendedor");
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUsuario({ email, password });
    const rol = data.rol || data.usuario?.rol;

    if (data.token && rol) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("deliveryplus_session", JSON.stringify({ ...data, rol }));

      redirectByRole(rol, navigate);
    } else {
      alert("Error: " + (data.error || data.msg || "No se pudo iniciar sesion"));
    }
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default LoginForm;
