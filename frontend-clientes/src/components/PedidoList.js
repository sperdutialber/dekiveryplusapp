import React, { useEffect, useState } from "react";
import { getPedidos } from "../services/api";
import PedidoForm from "./PedidoForm";

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    const data = await getPedidos();
    setPedidos(data);
  }

  const handlePedidoCreado = (nuevoPedido) => {
    setPedidos([...pedidos, nuevoPedido]);
  };

  return (
    <div>
      <PedidoForm onPedidoCreado={handlePedidoCreado} />
      <ul className="pedido-list">
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <strong>{pedido.cliente}</strong>
            <span>{pedido.producto}</span>
            <span>${pedido.precio}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PedidoList;
