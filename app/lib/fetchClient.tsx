"use client";
export function fetchClient(
  path: string,
  qs: Record<string, string>,
  options: Parameters<typeof fetch>[1]
) {
  if (typeof window === "undefined") {
    return;
  }
  const { origin } = window.location;
  const url = new URL(path, origin);
  for (const [name, value] of Object.entries(qs)) {
    url.searchParams.set(name, value);
  }
  return fetch(url, options);
}
