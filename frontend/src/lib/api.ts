/**
 * AgentSentry API Configuration & Dynamic URL Resolver
 * 
 * Supports:
 * - Single container deployment (Google Cloud Run / Docker) -> relative /api paths
 * - Netlify deployment with Netlify Edge proxy or BACKEND_URL -> relative /api paths
 * - Netlify frontend with external Cloud Run backend -> VITE_API_URL environment variable
 * - Local development -> relative paths proxied by Vite / localhost
 */
export const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return `${API_BASE}${path}`;
}
