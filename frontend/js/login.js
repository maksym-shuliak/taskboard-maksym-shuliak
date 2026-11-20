document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: document.getElementById('login').value,
      password: document.getElementById('password').value
    })
  });
  if (res.ok) {
    window.location.href = 'boards.html';
  } else {
    const data = await res.json();
    document.getElementById('message').textContent =
  data.error || 'Błąd logowania';
  }
});
 
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
 
// Przełączanie formularzy
loginTab.addEventListener('click', () => {
  loginForm.classList.remove('d-none');
  registerForm.classList.add('d-none');
 
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
 
  document.getElementById('message').textContent = '';
});
 
registerTab.addEventListener('click', () => {
  loginForm.classList.add('d-none');
  registerForm.classList.remove('d-none');
 
  loginTab.classList.remove('active');
  registerTab.classList.add('active');
 
  document.getElementById('message').textContent = '';
});
 
 
 // Rejestracja nowego użytkownika
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const loginInput = document.getElementById('registerLogin');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('confirmPassword');
 
  const message = document.getElementById('message');
  message.textContent = '';
 
  // Usuwanie poprzednich błędów
  const inputs = [
    loginInput,
    firstNameInput,
    lastNameInput,
    passwordInput,
    confirmInput
  ];
 
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
  });
 
  // Pobieranie danych z formularza
  const login = loginInput.value.trim();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
 
  let valid = true;
 
  // Walidacja loginu
  if (login.length < 3 || login.length > 30) {
    loginInput.classList.add('is-invalid');
    valid = false;
  }
 
  // Walidacja imienia
  if (!firstName) {
    firstNameInput.classList.add('is-invalid');
    valid = false;
  }
 
  // Walidacja nazwiska
  if (!lastName) {
    lastNameInput.classList.add('is-invalid');
    valid = false;
  }
 
  // Walidacja hasła
  if (password.length < 8) {
    passwordInput.classList.add('is-invalid');
    valid = false;
  }
 
  // Sprawdzanie zgodności haseł
  if (!confirmPassword || password !== confirmPassword) {
    confirmInput.classList.add('is-invalid');
    valid = false;
  }
 
  if (!valid) {
    message.textContent = 'Popraw błędy w formularzu.';
    return;
  }
 
  try {
    // Wysyłanie danych do API
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login,
        firstName,
        lastName,
        password
      })
    });
 
    const data = await res.json();
 
    if (res.ok) {
      window.location.href = 'boards.html';
    } else {
      message.textContent = data.error || 'Błąd rejestracji';
 
      // Oznaczenie pola loginu przy konflikcie
      if (res.status === 409) {
        loginInput.classList.add('is-invalid');
      }
    }
  } catch (error) {
    message.textContent = 'Nie można połączyć się z serwerem.';
  }
});