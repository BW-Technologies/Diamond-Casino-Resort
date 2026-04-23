export function getAssetUrl(path: string) {
  if (!path) return path;
  if (path.startsWith('http')) return path;
  
  // Get Vite's base URL (defaults to '/' but correctly scoped by vite.config.ts)
  const base = import.meta.env.BASE_URL;
  
  // If base is already applied, don't re-apply
  if (path.startsWith(base)) return path;
  
  // Handle absolute paths by stripping the leading slash and appending to base
  if (path.startsWith('/')) {
    return `${base}${path.slice(1)}`;
  }
  
  return `${base}${path}`;
}
