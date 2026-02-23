// ============================================================
//  TESNIM App — API Service
//  All communication with the PHP backend
//  Change API_BASE_URL when moving to a new host
// ============================================================

export const API_BASE_URL = 'https://smarti.rs/tesnim/api/index.php';

// ---- Helper ----
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Network error. Please check your connection.' };
  }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

// ============================================================
//  PRODUCTS
// ============================================================
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`products${query ? '?' + query : ''}`);
  },
  getFeatured: () => request('products/featured'),
  getById: (id) => request(`products/${id}`),
  search: (q) => request(`products/search?q=${encodeURIComponent(q)}`),
};

// ============================================================
//  CATEGORIES
// ============================================================
export const categoriesApi = {
  getAll: () => request('categories'),
};

// ============================================================
//  AUTH
// ============================================================
export const authApi = {
  register: (data) => request('auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (email, password) => request('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
};

// ============================================================
//  ORDERS
// ============================================================
export const ordersApi = {
  place: (token, orderData) => request('orders', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(orderData),
  }),
  getAll: (token) => request('orders', {
    headers: authHeaders(token),
  }),
  getById: (token, id) => request(`orders/${id}`, {
    headers: authHeaders(token),
  }),
  cancel: (token, id) => request(`orders/${id}/cancel`, {
    method: 'PUT',
    headers: authHeaders(token),
  }),
};

// ============================================================
//  WISHLIST
// ============================================================
export const wishlistApi = {
  getAll: (token) => request('wishlist', { headers: authHeaders(token) }),
  add: (token, productId) => request('wishlist', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  }),
  remove: (token, productId) => request(`wishlist/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  }),
};

// ============================================================
//  PROFILE
// ============================================================
export const profileApi = {
  get: (token) => request('profile', { headers: authHeaders(token) }),
  update: (token, data) => request('profile', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }),
  changePassword: (token, data) => request('profile/password', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }),
};
