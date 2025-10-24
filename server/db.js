import { users, products } from './mockDB.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveToFile() {
  const content = `export const users = ${JSON.stringify(users, null, 2)};\n\nexport const products = ${JSON.stringify(products, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, 'mockDB.js'), content, 'utf8');
}

export function getUsers() {
  return users;
}

export function getProducts() {
  return products;
}

export function addUser(user) {
  const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1 };
  users.push(newUser);
  saveToFile();
  return newUser;
}

export function updateUser(id, updatedData) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    saveToFile();
    return users[index];
  }
  return null;
}

export function deleteUser(id) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    saveToFile();
    return true;
  }
  return false;
}

export function addProduct(product) {
  const newProduct = { ...product, id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1 };
  products.push(newProduct);
  saveToFile();
  return newProduct;
}

export function updateProduct(id, updatedData) {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveToFile();
    return products[index];
  }
  return null;
}

export function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    saveToFile();
    return true;
  }
  return false;
}

