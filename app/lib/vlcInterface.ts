function url(path: string, qs?: Record<string, string | number>): string {
  let _url = `http://192.168.1.5:3000${path}`;
  // Encoding the URL properly cause issue with filename containing spaces
  if (qs) {
    _url += `?${Object.entries(qs)
      .map(([k, v]) => `${k}=${v}`)
      .join("&")}`;
  }
  return _url;
}

export async function status(qs: Record<string, string | number> = {}) {
  const result = await fetch(url("/player/status"));
  return await result.json();
}

export async function focus() {
  await fetch(url("/focus"), { method: "POST" });
}

export async function play(file: string) {
  await fetch(url("/player/play", { file }), { method: "POST" });
}

export async function togglePause() {
  await fetch(url("/player/togglePause"), { method: "POST" });
}

export async function stop() {
  await fetch(url("/player/stop"), { method: "POST" });
}

export async function seek(value: number) {
  await fetch(url("/player/seek", { value }), { method: "POST" });
}
