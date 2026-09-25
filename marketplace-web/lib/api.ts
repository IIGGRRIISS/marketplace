const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (res.status === 204) return undefined as unknown as T;

  const data = await res.json().catch(() => null);

if (!res.ok) {
  let message = `HTTP ${res.status}`;
  if (typeof data?.error === "string") {
    message = data.error;
  } else if (data?.error?.fieldErrors) {
    // Flatten Zod field errors into "field: message" lines
    const parts: string[] = [];
    for (const [field, msgs] of Object.entries(data.error.fieldErrors)) {
      if (Array.isArray(msgs) && msgs.length) {
        parts.push(`${field}: ${msgs.join(", ")}`);
      }
    }
    if (parts.length) message = parts.join(" · ");
  } else if (Array.isArray(data?.error?.formErrors) && data.error.formErrors.length) {
    message = data.error.formErrors.join(" · ");
  }
  throw new Error(message);
}

  return data as T;
}