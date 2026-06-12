// Body-level modal so it survives view re-renders. One modal at a time.
let host = null;
export function openModal(html, { wide = false } = {}) {
  closeModal();
  host = document.createElement('div');
  host.className = 'modal-scrim';
  host.innerHTML = `<div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  host.addEventListener('mousedown', (e) => { if (e.target === host) closeModal(); });
  document.body.appendChild(host);
  document.addEventListener('keydown', esc);
  return host.querySelector('.modal');
}
export function closeModal() {
  if (host) { host.remove(); host = null; document.removeEventListener('keydown', esc); }
}
function esc(e) { if (e.key === 'Escape') closeModal(); }
export function modalEl() { return host?.querySelector('.modal'); }
