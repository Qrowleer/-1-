import { getProducts as apiGetProducts } from './api.js';

export async function loadProducts() {
    return await apiGetProducts();
}

export function renderProductCard(product) {
    return `
    <div class="card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="foto">
      <div class="container">
      <h4><b>${product.name}</b></h4>
      <a href="products.html?id=${product.id}">Просмотреть описание</a>
      </div>
    </div>
  `;
}

export async function renderProductList(container) {
    const products = await loadProducts();
    container.innerHTML = products.map(renderProductCard).join('');
}
