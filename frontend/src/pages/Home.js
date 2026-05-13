import React from "react";
import PedidoList from "../components/PedidoList";

function Home() {
  return (
    <div>
      <h2>Pedidos</h2>
      <p>
        <a href="http://localhost:4000/landing/#hero" target="_blank" rel="noopener noreferrer">
          Ver guia de uso
        </a>
      </p>
      <PedidoList />
    </div>
  );
}

export default Home;
