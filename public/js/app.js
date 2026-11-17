const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('form[data-confirm]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  });
});

const fechaInput = document.querySelector('input[name="fecha"]');
if (fechaInput) {
  fechaInput.addEventListener('change', () => {
    if (!fechaInput.value) return;
    const [year, month, day] = fechaInput.value.split('-').map(Number);
    const weekDay = new Date(year, month - 1, day).getDay();
    if (weekDay === 0 || weekDay === 6) {
      fechaInput.setCustomValidity('Selecciona una fecha de lunes a viernes.');
      fechaInput.reportValidity();
    } else {
      fechaInput.setCustomValidity('');
    }
  });
}

