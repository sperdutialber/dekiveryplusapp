import React, { useState } from "react";
import { registrarUsuario } from "../services/apiUsuarios";

function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("negocio");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuario = { nombre, email, password, rol };
    const data = await registrarUsuario(usuario);
    alert("Usuario registrado: " + data.nombre);
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <h3>Registro</h3>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="negocio">Negocio</option>
        <option value="repartidor">Repartidor</option>
        <option value="emprendedor">Emprendedor</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
}

export default RegistroForm;
