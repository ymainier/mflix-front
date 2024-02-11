export async function status(qs: Record<string, string | number> = {}) {
  const result = await fetch("/api/player/status");
  return await result.json();
}

export async function focus() {
  await fetch("/api/player/focus", { method: "POST" });
}

export async function play(_file: string) {
  const file = _file.replace(/^\/Volumes/, "/mnt");
  await fetch(`/api/player/play?${new URLSearchParams({ file }).toString()}`, {
    method: "POST",
  });
}

export async function togglePause() {
  await fetch("/api/player/pause", { method: "POST" });
}

export async function stop() {
  await fetch("/api/player/stop", { method: "POST" });
}

export async function seek(value: number) {
  await fetch(
    `/api/player/seek?${new URLSearchParams({ value: `${value}` }).toString()}`,
    {
      method: "POST",
    }
  );
}
