// No React needed. If you want to add interactivity, you can write vanilla JS here.
console.log('Naftal site loaded successfully');

// Mobile navbar toggle
const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
