document.documentElement.classList.add('js');
document.documentElement.classList.add(('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0)
  ? 'touch'
  : 'no-touch');
