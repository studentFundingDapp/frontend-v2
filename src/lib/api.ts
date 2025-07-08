const BASE_URL = "http://studybae.online:8000/api";

export async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: any,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}
