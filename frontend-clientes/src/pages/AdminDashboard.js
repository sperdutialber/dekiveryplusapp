import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AdminDashboard() {
  const [data, setData] = useState({
    usuarios: 0,
    pedidosTotales: 0,
    pedidosEntregados: 0,
    pedidosActivos: 0,
    totalPagos: 0,
    totalComisiones: 0,
    billeteraRepartidor: 0,
    billeteraNegocio: 0,
    billeteraEmprendedor: 0
  });
  const [posiciones, setPosiciones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4001/api/admin/resumen", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then(setData)
      .catch(() =>
        setData({
          usuarios: 0,
          pedidosTotales: 0,
          pedidosEntregados: 0,
          pedidosActivos: 0,
          totalPagos: 0,
          totalComisiones: 0,
          billeteraRepartidor: 0,
          billeteraNegocio: 0,
          billeteraEmprendedor: 0
        })
      );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:4001/api/posicion/todos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then((res) => res.json())
        .then(setPosiciones)
        .catch(() => setPosiciones([]));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Panel de Administracion</h1>
      <div>
        <p>Usuarios totales: {data.usuarios}</p>
        <p>Pedidos totales: {data.pedidosTotales}</p>
        <p>Pedidos entregados: {data.pedidosEntregados}</p>
        <p>Pedidos activos: {data.pedidosActivos}</p>
        <p>Total pagos: ${data.totalPagos}</p>
        <p>Total comisiones DeliveryPlus: ${data.totalComisiones}</p>
        <p>Ingresos repartidores: ${data.billeteraRepartidor}</p>
        <p>Ingresos negocios: ${data.billeteraNegocio}</p>
        <p>Ingresos emprendedores: ${data.billeteraEmprendedor}</p>
      </div>
      <h2>Mapa de Repartidores</h2>
      <MapContainer center={[-27.37, -55.9]} zoom={13} style={{ height: "500px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {posiciones.map((p, i) => (
          <Marker key={i} position={[Number(p.lat), Number(p.lng)]}>
            <Popup>Repartidor #{p.repartidor_id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default AdminDashboard;
