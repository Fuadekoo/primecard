import NodeGeocoder from "node-geocoder";

export const runtime = "nodejs";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  // fetchOptions: { headers: { "User-Agent": "primecard/1.0 (contact@example.com)" } },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return new Response(JSON.stringify({ error: "Invalid coordinates" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const res = await geocoder.reverse({ lat, lon: lng });
    const first = res?.[0];
    const name =
      first?.formattedAddress ||
      first?.city ||
      (first?.extra && "neighborhood" in first.extra
        ? first.extra.neighborhood
        : undefined) ||
      `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return new Response(JSON.stringify({ name }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ name: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
}
