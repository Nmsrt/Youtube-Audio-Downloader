// @ts-check

/**
 * POST a JSON body to an API endpoint and return the parsed response.
 * @param {string} path
 * @param {unknown} body
 * @returns {Promise<any>}
 * @throws {Error} With the server-provided message when the request fails.
 */
export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/**
 * Fetch the current download location.
 * @returns {Promise<{ downloadDir: string }>}
 */
export async function fetchLocation() {
  const res = await fetch('/api/location');
  return res.json();
}
