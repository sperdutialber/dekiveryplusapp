import { http } from "./http";

export async function getProductos() {
  const res = await http.get("/emprendedor/productos");
  return res.data;
}

export async function crearProducto(producto) {
  const res = await http.post("/emprendedor/productos", producto);
  return res.data;
}

export async function actualizarProducto(id, producto) {
  const res = await http.put(`/emprendedor/productos/${id}`, producto);
  return res.data;
}

export async function eliminarProducto(id) {
  const res = await http.delete(`/emprendedor/productos/${id}`);
  return res.data;
}
