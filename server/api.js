const API_URL = 'http://localhost:3000/api';

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return await response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return await response.json();
}

export async function addUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
}

export async function addProduct(productData) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await response.json();
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  return await response.json();
}

