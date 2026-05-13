import { http } from "./services/http";

export const API_URL = "http://localhost:4000/api";
export const SOCKET_URL = "http://localhost:4000";

export async function login(payload) {
  const res = await http.post("/auth/login", payload);
  return res.data;
}

export function obtenerPerfil() {
  const raw = localStorage.getItem("usuario");
  return raw ? JSON.parse(raw) : null;
}

export function guardarSesion(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("rol", data.rol || data.usuario?.rol || "");
  localStorage.setItem("usuario", JSON.stringify(data.usuario));
}

export function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");
}

export async function obtenerPedidos() {
  const res = await http.get("/pedidos");
  return res.data;
}

export async function obtenerMetricas() {
  const res = await http.get("/metricas/emprendedor");
  return res.data;
}

export async function actualizarPosicion(lat, lng) {
  const res = await http.post("/repartidores/tracking", { lat, lng, estado: "en_camino" });
  return res.data;
}

export async function consultarIA(endpoint, payload) {
  try {
    const res = await http.post(`/${endpoint}`, payload);
    return res.data;
  } catch (error) {
    return { error: error.message };
  }
}
