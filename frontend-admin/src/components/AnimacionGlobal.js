export default function AnimacionGlobal({ tipo }) {
  if (!tipo) return null;

  if (tipo === "lluvia") return <div className="lluvia"></div>;
  if (tipo === "tormenta") return <div className="tormenta"></div>;
  if (tipo === "nuevoPedido") return <div className="pedido-anim"></div>;

  return null;
}
