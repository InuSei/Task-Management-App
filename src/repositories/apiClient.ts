/** fetch that throws on non-2xx, so repository callers can roll back optimistic updates. */
export async function requestJson(url: string, method = 'GET', body?: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method,
    cache: 'no-store',
    ...(body !== undefined && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error(`${method} ${url} failed with ${response.status}`);
  return response.status === 204 || response.status === 201 ? null : response.json();
}
