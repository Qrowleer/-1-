import { getUsers, addUser as apiAddUser } from './api.js';

export async function loginUser(login, password) {
  const users = await getUsers();
  const user = users.find(u => u.login === login && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Неверный логин или пароль' };
}

export async function registerUser(login, password, name) {
  const users = await getUsers();
  if (users.find(u => u.login === login)) {
    return { success: false, error: 'Пользователь с таким логином уже существует' };
  }
  const newUser = await apiAddUser({ login, password, name, role: 'user' });
  return { success: true, user: newUser };
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}
