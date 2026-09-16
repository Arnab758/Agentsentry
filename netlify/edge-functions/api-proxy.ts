/**
 * Netlify Edge Function: Dynamic API & Telemetry Proxy
 * 
 * When running on Netlify with an external backend (e.g. Google Cloud Run),
 * this Edge Function streams all /api/* and /v1/* requests directly to BACKEND_URL
 * without CORS limitations, buffer truncation, or SSE connection drops.
 */
export default async (request: Request, context: any) => {
  // Check for BACKEND_URL or VITE_API_URL in Netlify environment
  // @ts-ignore
  const backendUrl = Netlify?.env?.get?.("BACKEND_URL") || Netlify?.env?.get?.("VITE_API_URL");

  if (backendUrl) {
    const url = new URL(request.url);
    const targetBase = backendUrl.replace(/\/$/, "");
    const targetUrl = `${targetBase}${url.pathname}${url.search}`;

    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", url.host);

    try {
      return await fetch(targetUrl, {
        method: request.method,
        headers: headers,
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
        redirect: "manual"
      });
    } catch (err) {
      console.error("[Netlify Edge Proxy Error]", err);
      return new Response(JSON.stringify({ error: "Failed to forward request to backend", details: String(err) }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // If no external backend configured, proceed to Netlify Functions or static fallback
  return context.next();
};
