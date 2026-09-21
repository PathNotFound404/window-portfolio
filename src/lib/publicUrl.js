// Resolves a path to a file in public/ (e.g. "/backgrounds/x.jpg") against the site's base URL,
// so it still works when the site is served from a sub-path like GitHub Pages.
// Absolute URLs (https:, mailto:, ...) pass through unchanged.
export function publicUrl(path) {
  if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
