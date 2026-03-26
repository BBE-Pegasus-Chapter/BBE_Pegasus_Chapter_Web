/* Nav active link */
document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', e => {
    document.querySelectorAll('.nav-menu a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

/* Button ripple */
document.querySelectorAll('.btn-cta, .btn-register').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    r.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
      background:rgba(255,255,255,0.25);border-radius:50%;
      transform:scale(0);animation:ripple .55s ease-out forwards;pointer-events:none
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});