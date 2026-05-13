import React, { useEffect, useState } from "react";
import { getPedidosAsignados, cambiarEstadoPedido } from "../services/apiRepartidor";
import { socket } from "../services/socket";

function RepartidorHome() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition((pos) => {
        const tracking = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          repartidorId: JSON.parse(localStorage.getItem("usuario") || "{}").id
        };

        socket.emit("tracking", tracking);

        fetch("http://localhost:4001/api/posicion/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(tracking)
        }).catch(() => {});
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!usuario.id) return undefined;

    socket.emit("join-repartidor", usuario.id);

    socket.on(`repartidor_${usuario.id}`, (data) => {
      if (data.tipo === "nuevo_pedido") {
        new Audio("/sonidos/nuevo_pedido.mp3").play().catch(() => {});
        if (navigator.vibrate) navigator.vibrate(200);
        alert(data.mensaje);
        cargarPedidos();
      }

      if (data.tipo === "clima_peligroso") {
        new Audio("/sonidos/alerta_clima.mp3").play().catch(() => {});
      }
    });

    socket.on(`negocio_${usuario.id}`, (data) => {
      if (data.tipo === "nuevo_pedido") {
        new Audio("/sonidos/nuevo_pedido.mp3").play().catch(() => {});
      }
    });

    socket.on(`emprendedor_${usuario.id}`, (data) => {
      if (data.tipo === "nueva_venta") {
        new Audio("/sonidos/venta.mp3").play().catch(() => {});
      }
    });

    socket.on("alerta_clima", (data) => {
      alert("Clima peligroso: " + data.mensaje);
    });

    socket.on("tracking-update", console.log);
    socket.on("pedido-update", console.log);

    return () => {
      socket.off(`repartidor_${usuario.id}`);
      socket.off(`negocio_${usuario.id}`);
      socket.off(`emprendedor_${usuario.id}`);
      socket.off("alerta_clima");
      socket.off("tracking-update");
      socket.off("pedido-update");
    };
  }, []);

  async function cargarPedidos() {
    const data = await getPedidosAsignados();
    setPedidos(data);
  }

  async function actualizarEstado(id, estado) {
    await cambiarEstadoPedido(id, estado);
    cargarPedidos();
  }

  return (
    <div>
      <h1>Panel del Repartidor</h1>
      <h3>Pedidos asignados</h3>

      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            {p.producto} - {p.cliente} - Estado: {p.estado}
            <br />
            <button onClick={() => actualizarEstado(p.id, "en_camino")}>En camino</button>
            <button onClick={() => actualizarEstado(p.id, "entregado")}>Entregado</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepartidorHome;
