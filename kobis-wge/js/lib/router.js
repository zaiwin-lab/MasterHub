// Minimal hash router. Routes: #/path/:param
const routes = [];
let notFound = () => '<div class="empty">Not found</div>';

export function route(pattern, handler) { routes.push({ pattern, parts: pattern.split('/'), handler }); }
export function setNotFound(fn) { notFound = fn; }

export function current() {
  const hash = (location.hash || '#/').slice(1) || '/';
  const [path] = hash.split('?');
  const segs = path.split('/').filter(Boolean);
  for (const r of routes) {
    const rp = r.parts.filter(Boolean);
    if (rp.length !== segs.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < rp.length; i++) {
      if (rp[i].startsWith(':')) params[rp[i].slice(1)] = decodeURIComponent(segs[i]);
      else if (rp[i] !== segs[i]) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params, path };
  }
  return { handler: notFound, params: {}, path };
}

export function go(path) { location.hash = path.startsWith('#') ? path : '#' + path; }
export function onChange(fn) { window.addEventListener('hashchange', fn); }
export function path() { return (location.hash || '#/').slice(1).split('?')[0]; }
