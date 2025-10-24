import { validateForm } from '../server/validation.js';
import { loginUser, registerUser, getCurrentUser, logoutUser, isAdmin } from '../server/auth.js';
import { renderProductList } from '../server/products.js';
import { getProducts, getUsers, addUser, updateUser, deleteUser, addProduct, updateProduct, deleteProduct, uploadImage } from '../server/api.js';

if (document.querySelector('.hhh form')) {
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('input');
  
  if(inputs.length === 3) {
  const loginInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { isValid, loginError, passwordError } = validateForm(loginInput.value, passwordInput.value);
    if (!isValid) {
      alert(`${loginError}`);
      return;
    }
    const result = await loginUser(loginInput.value, passwordInput.value);
    if (result.success) {
      alert('Вход успешен!');
      if (result.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      alert(result.error);
    }
  });
  }

  if(inputs.length > 3) {
    const nameInput = form.querySelector('input[placeholder="Имя"]');
    const loginInput = form.querySelector('input[placeholder="Логин"]');
    const passwordInput = form.querySelector('input[type="password"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const { isValid, loginError, passwordError } = validateForm(loginInput.value, passwordInput.value);
      if (!isValid) {
        alert(`${loginError || passwordError}`);
        return;
      }
      const result = await registerUser(loginInput.value, passwordInput.value, nameInput.value);
      if (result.success) {
        alert('Регистрация успешна!');
        window.location.href = 'vhod.html';
      } else {
        alert(result.error);
      }
    });
  }
}

if (document.querySelector('.cart')) {
  const container = document.querySelector('.cart');
  renderProductList(container);
}

if (document.querySelector('.product-page')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    const products = await getProducts();
    const product = products.find(p => p.id == productId);
    if (product) {
      document.querySelector('.product-page img').src = product.image;
      document.querySelector('.product-info h1').textContent = product.name;
      document.querySelector('.product-info p').textContent = product.description;
      document.querySelector('.product-info .price').textContent = `${product.price} ₽`;
    }
  }
}

if (document.querySelector('.admin-content')) {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    alert('Доступ запрещен!');
    window.location.href = 'vhod.html';
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
    window.location.href = 'vhod.html';
  });

  async function renderUsers() {
    const users = await getUsers();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.login}</td>
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn-edit" onclick="window.editUser(${user.id})">Редактировать</button>
          <button class="btn-delete" onclick="window.removeUser(${user.id})">Удалить</button>
        </td>
      </tr>
    `).join('');
  }

  async function renderProducts() {
    const products = await getProducts();
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description.substring(0, 50)}...</td>
        <td>${product.price} ₽</td>
        <td>
          <button class="btn-edit" onclick="window.editProduct(${product.id})">Редактировать</button>
          <button class="btn-delete" onclick="window.removeProduct(${product.id})">Удалить</button>
        </td>
      </tr>
    `).join('');
  }

  window.editUser = async function(id) {
    const users = await getUsers();
    const user = users.find(u => u.id === id);
    showModal('Редактировать пользователя', 'user', user);
  };

  window.removeUser = async function(id) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      await deleteUser(id);
      await renderUsers();
    }
  };

  window.editProduct = async function(id) {
    const products = await getProducts();
    const product = products.find(p => p.id === id);
    showModal('Редактировать товар', 'product', product);
  };

  window.removeProduct = async function(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      await deleteProduct(id);
      await renderProducts();
    }
  };

  let uploadedImageUrl = null;

  function showModal(title, type, data = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');

    modalTitle.textContent = title;
    uploadedImageUrl = data?.image || null;
    
    if (type === 'user') {
      modalForm.innerHTML = `
        <input type="text" id="userLogin" placeholder="Логин" value="${data ? data.login : ''}" required>
        <input type="password" id="userPassword" placeholder="Пароль" value="${data ? data.password : ''}" required>
        <input type="text" id="userName" placeholder="Имя" value="${data ? data.name : ''}" required>
        <select id="userRole">
          <option value="user" ${data && data.role === 'user' ? 'selected' : ''}>Пользователь</option>
          <option value="admin" ${data && data.role === 'admin' ? 'selected' : ''}>Администратор</option>
        </select>
        <button type="submit">Сохранить</button>
      `;
    } else if (type === 'product') {
      modalForm.innerHTML = `
        <input type="text" id="productName" placeholder="Название" value="${data ? data.name : ''}" required>
        <input type="text" id="productDescription" placeholder="Описание" value="${data ? data.description : ''}" required>
        <input type="number" id="productPrice" placeholder="Цена" value="${data ? data.price : ''}" required>
        <div class="image-upload">
          <label for="productImage">Изображение:</label>
          <input type="file" id="productImage" accept="image/*">
          <div id="imagePreview">${uploadedImageUrl ? `<img src="${uploadedImageUrl}" style="max-width: 200px; margin-top: 10px;">` : ''}</div>
          <div id="uploadProgress"></div>
        </div>
        <button type="submit">Сохранить</button>
      `;

      const imageInput = document.getElementById('productImage');
      imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const progressDiv = document.getElementById('uploadProgress');
          const previewDiv = document.getElementById('imagePreview');
          
          progressDiv.textContent = 'Загрузка изображения...';
          
          try {
            const result = await uploadImage(file);
            uploadedImageUrl = result.url;
            previewDiv.innerHTML = `<img src="${uploadedImageUrl}" style="max-width: 200px; margin-top: 10px;">`;
            progressDiv.textContent = 'Изображение загружено!';
            setTimeout(() => progressDiv.textContent = '', 2000);
          } catch (error) {
            progressDiv.textContent = 'Ошибка загрузки!';
            console.error('Upload error:', error);
          }
        }
      });
    }

    modalForm.onsubmit = async (e) => {
      e.preventDefault();
      if (type === 'user') {
        const userData = {
          login: document.getElementById('userLogin').value,
          password: document.getElementById('userPassword').value,
          name: document.getElementById('userName').value,
          role: document.getElementById('userRole').value
        };
        if (data) {
          await updateUser(data.id, userData);
        } else {
          await addUser(userData);
        }
        await renderUsers();
      } else if (type === 'product') {
        if (!uploadedImageUrl) {
          alert('Пожалуйста, загрузите изображение');
          return;
        }

        const productData = {
          name: document.getElementById('productName').value,
          description: document.getElementById('productDescription').value,
          price: parseInt(document.getElementById('productPrice').value),
          image: uploadedImageUrl
        };
        
        if (data) {
          await updateProduct(data.id, productData);
        } else {
          await addProduct(productData);
        }
        await renderProducts();
      }
      modal.style.display = 'none';
      uploadedImageUrl = null;
    };

    modal.style.display = 'block';
  }

  document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
    uploadedImageUrl = null;
  };

  window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
      uploadedImageUrl = null;
    }
  };

  document.getElementById('addUserBtn').addEventListener('click', () => {
    showModal('Добавить пользователя', 'user');
  });

  document.getElementById('addProductBtn').addEventListener('click', () => {
    showModal('Добавить товар', 'product');
  });

  renderUsers();
  renderProducts();
}
