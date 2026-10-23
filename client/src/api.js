const API = 'http://localhost:5000/api';

export async function request(path, method = 'GET', body) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const headers = { 'Content-Type': 'application/json' };
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}