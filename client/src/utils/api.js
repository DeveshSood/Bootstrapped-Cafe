const API_BASE = '/api/auth';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Safely parse JSON from a fetch Response, returning a structured error if body is not valid JSON. */
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
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

/** Wrapper around fetch that converts network failures into user-friendly errors. */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    throw new Error(
      'Unable to connect to the server. Please check your internet connection and try again.'
    );
  }
}

/* ─── Auth API ─────────────────────────────────────────── */

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

/* ─── Address API ──────────────────────────────────────── */

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

/* ─── Cart API ─────────────────────────────────────────── */

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

/* ─── Daily Menu API ─────────────────────────────────────── */

export const apiGetDailyMenu = async (dateStr = null) => {
  const url = dateStr ? `/api/daily-menu?date=${dateStr}` : '/api/daily-menu';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch daily menu');
  return res.json();
};

export async function apiGetSchedule(token) {
  const res = await safeFetch(`/api/daily-menu/schedule`, {
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to load schedule');
  return data;
}

export async function apiSetOverride(token, overrideData) {
  const res = await safeFetch(`/api/daily-menu/override`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(overrideData),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to set override');
  return data;
}

export async function apiDeleteOverride(token, date) {
  const res = await safeFetch(`/api/daily-menu/override/${date}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete override');
  return data;
}

/* ─── Custom Bowls API ─────────────────────────────────── */

export async function apiSaveCustomBowl(token, bowlData) {
  const res = await safeFetch(`${API_BASE}/custom-bowls`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(bowlData),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to save bowl');
  return data;
}

export async function apiDeleteCustomBowl(token, bowlId) {
  const res = await safeFetch(`${API_BASE}/custom-bowls/${bowlId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete bowl');
  return data;
}

export async function apiUpdateCustomBowl(token, bowlId, bowlData) {
  const res = await safeFetch(`${API_BASE}/custom-bowls/${bowlId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(bowlData),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update bowl');
  return data;
}

/* ─── Order API ────────────────────────────────────────── */

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

export async function apiUpdateOrderStatus(token, orderId, bodyData = {}) {
  const res = await safeFetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
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
