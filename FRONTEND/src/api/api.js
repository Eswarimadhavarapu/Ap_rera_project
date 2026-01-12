// Detect environment
const isProduction = import.meta.env.MODE === "production";

/**
 * Backend Base URL
 * - Dev: DevTunnel backend (8080)
 * - Prod: real domain
 */
const DEV_BACKEND_URL = "https://0jv8810n-8080.inc1.devtunnels.ms";
const PROD_BACKEND_URL = "https://your-production-domain.com";

export const BASE_URL = isProduction
  ? PROD_BACKEND_URL
  : DEV_BACKEND_URL;

// ================================
// 🔁 API FETCH WRAPPER
// ================================
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    mode: "cors",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const raw = await res.text();

  // Detect tunnel HTML error
  if (raw.startsWith("<!DOCTYPE html>")) {
    throw new Error("Backend not reachable or DevTunnel expired");
  }

  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      (data && (data.error || data.message)) ||
      `HTTP ${res.status}`
    );
  }

  return data;
}

// ================================
// API HELPERS
// ================================
export const apiGet = (url) =>
  apiFetch(url, { method: "GET" });

export const apiPost = (url, body) =>
  apiFetch(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const apiPut = (url, body) =>
  apiFetch(url, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const apiDelete = (url) =>
  apiFetch(url, { method: "DELETE" });
