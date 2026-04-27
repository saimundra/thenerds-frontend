import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './auth';

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api';
    }
  }

  return '/api';
}

const API_BASE_URL = resolveApiBaseUrl();

function normalizeApiPath(path: string): string {
  const [pathname, query] = path.split('?');
  const trimmedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return query === undefined ? trimmedPath : `${trimmedPath}?${query}`;
}

async function requestJson(url: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error(
      `Network error while requesting ${url}. Make sure frontend and backend servers are running.`
    );
  }
}

function extractMessageFromPayload(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload.trim() || null;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    const first = data.non_field_errors[0];
    if (typeof first === 'string' && first.trim()) {
      return first;
    }
  }

  for (const [field, value] of Object.entries(data)) {
    if (field === 'detail' || field === 'non_field_errors') {
      continue;
    }

    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (typeof first === 'string' && first.trim()) {
        return `${field}: ${first}`;
      }
    }

    if (typeof value === 'string' && value.trim()) {
      return `${field}: ${value}`;
    }
  }

  return null;
}

async function getResponseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const json = (await response.json()) as unknown;
      const fromJson = extractMessageFromPayload(json);
      if (fromJson) {
        return fromJson;
      }
    } catch {
      // Fall through to generic status messages.
    }
  } else {
    try {
      const text = await response.text();
      if (text.trim()) {
        return text;
      }
    } catch {
      // Fall through to generic status messages.
    }
  }

  if (response.status === 400) return 'Invalid request. Please check your inputs.';
  if (response.status === 401) return 'Session expired. Please sign in again.';
  if (response.status === 403) return 'You do not have permission to perform this action.';
  if (response.status === 404) return 'Requested resource was not found.';
  if (response.status === 409) return 'A conflicting record already exists.';
  if (response.status >= 500) return 'Server error. Please try again shortly.';

  return `API error ${response.status}`;
}

export function getReadableError(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await requestJson(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = (await response.json()) as { access: string };
  const oldRefresh = getRefreshToken();
  if (oldRefresh) {
    setTokens(data.access, oldRefresh);
  }
  return data.access;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = normalizeApiPath(path);
  const access = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (access) {
    headers.set('Authorization', `Bearer ${access}`);
  }

  let response = await requestJson(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed}`);
      response = await requestJson(`${API_BASE_URL}${normalizedPath}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const message = await getResponseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
