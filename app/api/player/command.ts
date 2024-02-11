const { VLC_AUTH, VLC_REQUEST_URL } = process.env;

function url(path: string, qs?: Record<string, string | number>): string {
  // Encoding the URL properly cause issue with filename containing spaces
  let _url = `${VLC_REQUEST_URL}/${path}`;
  if (qs) {
    _url += `?${Object.entries(qs)
      .map(([k, v]) => `${k}=${v}`)
      .join("&")}`;
  }
  return _url;
}

async function request(url: string) {
  return await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${VLC_AUTH}`).toString("base64")}`,
    },
  });
}

export async function status(qs: Record<string, string | number> = {}) {
  const result = await request(url("status.json", qs));
  return await result.json();
}

export async function playlist() {
  const result = await request(url("playlist.json"));
  return await result.json();
}
