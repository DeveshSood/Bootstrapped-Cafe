const API_BASE = '/api/auth';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Safely parse JSON from a fetch Response.
 * If the body isn't valid JSON (e.g. an HTML error page from the proxy),
 * this returns a structured error object instead of crashing.
 */
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // Server returned non-JSON (HTML error page, empty body, etc.)
    console.error('Non-JSON response:', text.slice(0, 300));
    return {
      message: res.status >= 500
        ? 'Server is temporarily unavailable. Please try again in a moment.'
        : res.status === 404
        ? 'The requested resource was not found.'
        : `Unexpected server response (${res.status}). Please try again.`,
    };
  }
}

/**
 * Wrapper around fetch that handles network errors gracefully.
 */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    // Network failure — server unreachable, CORS blocked, DNS fail, etc.
    throw new Error(
      'Unable to connect to the server. Please check your internet connection and try again.'
    );
  }
}

export async function apiRegister(name, email, password) {
  const res = await safeFetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function apiLogin(email, password) {
  const res = await safeFetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function apiGetProfile(token) {
  const res = await safeFetch(`${API_BASE}/profile`, {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load profile');
  return data;
}

export async function apiUpdateProfile(token, updates) {
  const res = await safeFetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
}

export async function apiAddAddress(token, address) {
  const res = await safeFetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(address),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to add address');
  return data;
}

export async function apiUpdateAddress(token, addressId, updates) {
  const res = await safeFetch(`${API_BASE}/addresses/${addressId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update address');
  return data;
}

export async function apiDeleteAddress(token, addressId) {
  const res = await safeFetch(`${API_BASE}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete address');
  return data;
}

export async function apiSetDefaultAddress(token, addressId) {
  const res = await safeFetch(`${API_BASE}/addresses/${addressId}/default`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to set default address');
  return data;
}

export async function apiSyncCart(token, cart) {
  const res = await safeFetch(`${API_BASE}/cart`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ cart }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to sync cart');
  return data;
}

export async function apiGetCart(token) {
  const res = await safeFetch(`${API_BASE}/cart`, {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load cart');
  return data;
}

// ─── Order API ──────────────────────────────────────────

export async function apiGetUserOrders(token) {
  const res = await safeFetch('/api/orders/my', {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load orders');
  return data;
}

export async function apiGetOrder(orderId) {
  const res = await safeFetch(`/api/orders/${orderId}`);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load order');
  return data;
}

export async function apiGetAllOrders(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await safeFetch(`/api/orders/all?${query}`, {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load orders');
  return data;
}

export async function apiUpdateOrderStatus(token, orderId) {
  const res = await safeFetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update order status');
  return data;
}

export async function apiRequestCancellation(token, orderId, reason) {
  const res = await safeFetch(`/api/orders/${orderId}/cancel-request`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to request cancellation');
  return data;
}

export async function apiApproveCancellation(token, orderId) {
  const res = await safeFetch(`/api/orders/${orderId}/cancel-approve`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to approve cancellation');
  return data;
}

export async function apiRejectCancellation(token, orderId) {
  const res = await safeFetch(`/api/orders/${orderId}/cancel-reject`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to reject cancellation');
  return data;
}

export async function apiDeleteOrder(token, orderId, reason) {
  const res = await safeFetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete order');
  return data;
}

export async function apiGetOrderStats(token) {
  const res = await safeFetch('/api/orders/stats', {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load order stats');
  return data;
}

export async function apiUpdateSequence(token, newSequence) {
  const res = await safeFetch('/api/orders/sequence', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ newSequence }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update sequence');
  return data;
}
