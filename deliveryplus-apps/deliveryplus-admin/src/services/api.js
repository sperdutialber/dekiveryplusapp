const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Función auxiliar para headers
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET genérico
export const apiGet = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { ...authHeaders() }
  });
  return response.json();
};

// POST genérico
export const apiPost = async (path, data) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  return response.json();
};

// PUT genérico
export const apiPut = async (path, data) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  return response.json();
};

// DELETE genérico
export const apiDelete = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  return response.json();
};

// Auth
export const login = async (email, password) => {
  return apiPost('/auth/login', { email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const obtenerPerfil = () => {
  const raw = localStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
};

export const guardarSesion = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
};
