import React, { useEffect, useState } from "react";

function MetricasNegocio() {
  const [data, setData] = useState({ totalVentas: 0, pedidosHoy: 0 });

  useEffect(() => {
    fetch("http://localhost:4001/api/metricas/negocio", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ totalVentas: 0, pedidosHoy: 0 }));
  }, []);

  return (
    <div>
      <h1>Metricas del Negocio</h1>
      <p>Total ventas: ${data.totalVentas}</p>
      <p>Pedidos hoy: {data.pedidosHoy}</p>
    </div>
  );
}

export default MetricasNegocio;
