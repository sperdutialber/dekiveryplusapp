import { http } from "./http";

export async function registrarUsuario(usuario) {
  const response = await http.post("/auth/registro", usuario);
  return response.data;
}

export async function loginUsuario(credentials) {
  const response = await http.post("/auth/login", credentials);
  return response.data;
}
