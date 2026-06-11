// Mobile menu toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));
