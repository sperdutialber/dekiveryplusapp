import React, { useEffect, useState } from "react";
import LandingLink from "../components/LandingLink";

function EmprendedorHome() {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem("emprendedor_productos");
    return guardados ? JSON.parse(guardados) : [];
  });
  const [pedidos, setPedidos] = useState([]);
  const [notificaciones] = useState([
    "Nuevo pedido confirmado para retiro hoy 18:30.",
    "El repartidor asignado actualizo su ubicacion hace 2 minutos.",
    "Tu QR de acceso rapido ya esta disponible para compartir."
  ]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:4000/api/pedidos", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => null);

    if (!response || !response.ok) {
      setPedidos([]);
      return;
    }

    const pedidosData = await response.json().catch(() => []);
    setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nuevoProducto = {
      id: `prod-${Date.now()}`,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio || 0),
      stock: Number(form.stock || 0)
    };
    const actualizados = [...productos, nuevoProducto];
    setProductos(actualizados);
    localStorage.setItem("emprendedor_productos", JSON.stringify(actualizados));
    setForm({ nombre: "", descripcion: "", precio: "", stock: "" });
  }

  function handleDelete(id) {
    const actualizados = productos.filter((producto) => producto.id !== id);
    setProductos(actualizados);
    localStorage.setItem("emprendedor_productos", JSON.stringify(actualizados));
  }

  const pedidosVisibles = pedidos.length
    ? pedidos
    : [
        { id: "demo-1", cliente: "Lucia", producto: "Torta casera", estado: "confirmado" },
        { id: "demo-2", cliente: "Martin", producto: "Box desayuno", estado: "en preparacion" }
      ];

  return (
    <div className="emprendedor-shell">
      <section className="hero">
        <h1>Panel del Emprendedor</h1>
        <p>Inicio, pedidos recibidos, estado del repartidor, notificaciones, landing y QR en un solo lugar.</p>
      </section>

      <section className="grid-layout">
        <div className="panel">
          <h3>Inicio</h3>
          <p>Resumen rapido de tu tienda y accesos principales para operar hoy.</p>
          <div className="status-grid">
            <div className="status-card">
              <strong>{pedidosVisibles.length}</strong>
              <span>Pedidos recibidos</span>
            </div>
            <div className="status-card">
              <strong>{productos.length}</strong>
              <span>Productos activos</span>
            </div>
            <div className="status-card">
              <strong>1</strong>
              <span>Repartidor en curso</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Estado del repartidor</h3>
          <p>Repartidor asignado en ruta. Proxima entrega estimada en 18 minutos.</p>
          <p className="muted-text">Ultima actualizacion: hace 2 minutos.</p>
        </div>
      </section>

      <section className="grid-layout">
        <div className="panel">
          <h3>Pedidos recibidos</h3>
          <ul className="pedido-list">
            {pedidosVisibles.map((pedido) => (
              <li key={pedido.id}>
                <strong>{pedido.producto}</strong>
                <span>{pedido.cliente}</span>
                <span>{pedido.estado}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Notificaciones</h3>
          <ul className="simple-list">
            {notificaciones.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <LandingLink />

      <section className="panel">
        <h3>Crear producto</h3>
        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <input
            placeholder="Precio"
            type="number"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <button type="submit">Crear</button>
        </form>
      </section>

      <section className="panel">
        <h3>QR y catalogo</h3>
        <ul className="simple-list">
          {productos.map((producto) => (
            <li key={producto.id}>
              {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
              <button type="button" onClick={() => handleDelete(producto.id)}>Eliminar</button>
            </li>
          ))}
          {productos.length === 0 && <li>No hay productos cargados todavia.</li>}
        </ul>
      </section>
    </div>
  );
}

export default EmprendedorHome;
