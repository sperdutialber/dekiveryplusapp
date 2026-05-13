import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidos } from "../services/api";

function NegocioHome() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function cargar() {
      const data = await getPedidos();
      setPedidos(data);
    }
    cargar();
  }, []);

  return (
    <div>
      <h1>Panel del Negocio</h1>
      <h3>Pedidos del dia</h3>
      <p>
        <Link to="/metricas/negocio">Ver metricas del negocio</Link>
      </p>

      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            {p.producto} - ${p.precio} - Cliente: {p.cliente}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NegocioHome;
