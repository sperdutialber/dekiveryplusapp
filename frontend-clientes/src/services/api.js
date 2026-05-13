import { http } from "./http";

export const API_URL = "http://localhost:4000/api";

export async function login(email, password) {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
}

export function guardarSesion(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("rol", data.rol || data.usuario?.rol || "");
  localStorage.setItem("usuario", JSON.stringify(data.usuario));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");
}

export function obtenerPerfil() {
  const raw = localStorage.getItem("usuario");
  return raw ? JSON.parse(raw) : null;
}

export async function getPedidos() {
  const res = await http.get("/pedidos");
  return res.data;
}

export async function getEstado() {
  const res = await http.get("/status");
  return res.data;
}
