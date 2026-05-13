import React, { useState } from "react";

function PedidoForm({ onPedidoCreado }) {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoPedido = { cliente, producto, precio };

    const response = await fetch("http://localhost:4001/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPedido),
    });

    const data = await response.json();
    onPedidoCreado(data);

    setCliente("");
    setProducto("");
    setPrecio("");
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <h3>Crear Pedido</h3>
      <input type="text" placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
      <input type="text" placeholder="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} required />
      <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      <button type="submit">Guardar Pedido</button>
    </form>
  );
}

export default PedidoForm;
