document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu?.classList.add('hidden')));

  // Theme cycling with a single icon (🎨) + White theme
  const themes = [
    {key:'ocean', label:'Ocean 🌊'},
    {key:'sunset', label:'Sunset 🌅'},
    {key:'forest', label:'Forest 🌲'},
    {key:'orchid', label:'Orchid 🌸'},
    {key:'white', label:'White ⚪'}
  ];
  const root = document.documentElement;
  let current = localStorage.getItem('theme-one') || 'ocean';
  root.setAttribute('data-theme', current);
  document.getElementById('themeBtn')?.addEventListener('click', () => {
    let idx = themes.findIndex(t => t.key === current);
    idx = (idx + 1) % themes.length;
    current = themes[idx].key;
    root.setAttribute('data-theme', current);
    localStorage.setItem('theme-one', current);
    showToast && showToast(`Theme changed to ${themes[idx].label}`);
  });

  // Filter + search
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project');
  const searchInput = document.getElementById('search');

  function setActive(btn) {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function applyFilter() {
    const active = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
    const q = (searchInput?.value || '').toLowerCase();
    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(' ');
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const matchesTag = active === 'all' || tags.includes(active);
      const matchesSearch = !q || title.includes(q);
      card.style.display = matchesTag && matchesSearch ? '' : 'none';
    });
  }
  filterButtons.forEach(btn => btn.addEventListener('click', () => { setActive(btn); applyFilter(); }));
  searchInput?.addEventListener('input', applyFilter);
  (function(){ const first = document.querySelector('[data-filter="all"]'); first && setActive(first); applyFilter(); })();

  // Modal
// Modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.getElementById('closeModal');

const liveBtn = document.getElementById('liveBtn');
const repoBtn = document.getElementById('repoBtn');

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.title || 'Project';
    modalDesc.textContent = btn.dataset.desc || '';

    // 🔥 Dynamic links
    liveBtn.href = btn.dataset.live || "#";
    repoBtn.href = btn.dataset.repo || "#";

    // Optional: hide button if no link
    liveBtn.style.display = btn.dataset.live ? "block" : "none";
    repoBtn.style.display = btn.dataset.repo ? "block" : "none";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });
});

function hideModal(){
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

closeModal?.addEventListener('click', hideModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});
  // const modal = document.getElementById('modal');
  // const modalTitle = document.getElementById('modalTitle');
  // const modalDesc = document.getElementById('modalDesc');
  // const closeModal = document.getElementById('closeModal');
  // document.querySelectorAll('.open-modal').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     modalTitle.textContent = btn.dataset.title || 'Project';
  //     modalDesc.textContent = btn.dataset.desc || '';
  //     modal.classList.remove('hidden');
  //     modal.classList.add('flex');
  //   });
  // });
  // function hideModal(){ modal.classList.add('hidden'); modal.classList.remove('flex'); }
  // closeModal?.addEventListener('click', hideModal);
  // modal?.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

  // Contact local storage
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  function getMessages() { try { return JSON.parse(localStorage.getItem('messages-one') || '[]'); } catch { return []; } }
  function saveMessages(list) { localStorage.setItem('messages-one', JSON.stringify(list)); }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    if (!name || !email || !message) { showToast('Please fill all fields'); return; }
    const messages = getMessages();
    messages.push({ name, email, message, date: new Date().toISOString() });
    saveMessages(messages);
    form.reset();
    showToast('Message saved');
    if (formNote) formNote.textContent = 'Saved locally. Export or clear any time.';
  });

  const mailtoBtn = document.getElementById('mailtoBtn');
  mailtoBtn?.addEventListener('click', () => {
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const subject = encodeURIComponent(`Hello from ${name || 'your portfolio'}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    mailtoBtn.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  });

  const exportBtn = document.getElementById('exportMessages');
  const clearBtn = document.getElementById('clearMessages');
  exportBtn?.addEventListener('click', () => {
    const messages = getMessages();
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'messages.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast('Exported messages');
  });
  clearBtn?.addEventListener('click', () => { localStorage.removeItem('messages-one'); showToast('Cleared messages'); });

  // Toast
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer;
  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 2000);
  }
  window.showToast = showToast;
});
