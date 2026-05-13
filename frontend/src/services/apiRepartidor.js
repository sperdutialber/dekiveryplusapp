import { http } from "./http";

export async function getPedidosAsignados() {
  const response = await http.get("/repartidor/pedidos");
  return response.data;
}

export async function cambiarEstadoPedido(id, estado) {
  const response = await http.put(`/repartidor/pedidos/${id}/estado`, { estado });
  return response.data;
}
