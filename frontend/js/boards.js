const boardsList = document.getElementById('boardsList');
const message = document.getElementById('message');
const boardForm = document.getElementById('boardForm');
const boardModal = new bootstrap.Modal(document.getElementById('boardModal'));
 
let editingBoardId = null;
let users = [];
 
// Wyświetlanie komunikatów
function showMessage(text, type = 'danger') {
  message.textContent = '';
 
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = text;
  message.appendChild(alert);
}
 
// Pobieranie informacji o zalogowanym użytkowniku
async function loadUser() {
  const user = await api('/auth/me');
  document.getElementById('userName').textContent =
    `${user.firstName} ${user.lastName}`;
}
 
// Pobieranie użytkowników do wyświetlania autorów
async function loadUsers() {
  users = await api('/users');
}
 
// Wyświetlanie jednej tablicy
function createBoardCard(board) {
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';
 
  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';
 
  const body = document.createElement('div');
  body.className = 'card-body';
 
  const title = document.createElement('h2');
  title.className = 'card-title h5';
  title.textContent = board.name;
 
  const description = document.createElement('p');
  description.className = 'card-text text-secondary';
  description.textContent = board.description || 'Brak opisu';
 
  const author = document.createElement('p');
  author.className = 'small text-muted';
 
  const owner = users.find(user => Number(user.id) === Number(board.ownerId));
  author.textContent = owner
    ? `Autor: ${owner.firstName} ${owner.lastName}`
    : `Autor ID: ${board.ownerId}`;
 
  const buttons = document.createElement('div');
  buttons.className = 'd-flex flex-wrap gap-2';
 
  const openBtn = document.createElement('a');
  openBtn.className = 'btn btn-primary btn-sm';
  openBtn.href = `board.html?id=${encodeURIComponent(board.id)}`;
  openBtn.textContent = 'Otwórz';
 
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-outline-secondary btn-sm';
  editBtn.textContent = 'Edytuj';
  editBtn.addEventListener('click', () => openEditModal(board));
 
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-outline-danger btn-sm';
  deleteBtn.textContent = 'Usuń';
  deleteBtn.addEventListener('click', () => deleteBoard(board.id));
 
  buttons.append(openBtn, editBtn, deleteBtn);
  body.append(title, description, author, buttons);
  card.appendChild(body);
  col.appendChild(card);
 
  return col;
}
 
// Pobieranie tablic z API
async function loadBoards() {
  const boards = await api('/boards');
 
  boardsList.textContent = '';
 
  if (boards.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-secondary';
    empty.textContent = 'Nie masz jeszcze żadnych tablic.';
    boardsList.appendChild(empty);
    return;
  }
 
  boards.forEach(board => {
    boardsList.appendChild(createBoardCard(board));
  });
}
 
// Otwieranie formularza nowej tablicy
document.getElementById('newBoardBtn').addEventListener('click', () => {
  editingBoardId = null;
  boardForm.reset();
  document.getElementById('boardModalTitle').textContent = 'Nowa tablica';
  boardModal.show();
});
 
// Otwieranie formularza edycji tablicy
function openEditModal(board) {
  editingBoardId = board.id;
  document.getElementById('boardModalTitle').textContent = 'Edytuj tablicę';
  document.getElementById('boardName').value = board.name;
  document.getElementById('boardDescription').value = board.description || '';
  boardModal.show();
}
 
 
 // Dodawanie lub edycja tablicy
boardForm.addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const nameInput = document.getElementById('boardName');
  const descriptionInput = document.getElementById('boardDescription');
 
  // Usuwanie poprzednich błędów
  nameInput.classList.remove('is-invalid');
 
  // Pobieranie danych formularza
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
 
  // Walidacja nazwy tablicy
  if (name.length < 1 || name.length > 80) {
    nameInput.classList.add('is-invalid');
    nameInput.focus();
    return;
  }
 
  try {
    // Dodawanie lub aktualizacja tablicy
    if (editingBoardId === null) {
      await api('/boards', 'POST', { name, description });
    } else {
      await api(`/boards/${editingBoardId}`, 'PUT', { name, description });
    }
 
    boardModal.hide();
    await loadBoards();
    showMessage('Tablica została zapisana.', 'success');
  } catch (error) {
    // Wyświetlanie błędu zwróconego przez API
    showMessage(error.message || 'Nie udało się zapisać tablicy.');
  }
});
 
 
// Usuwanie tablicy po potwierdzeniu
async function deleteBoard(id) {
  if (!confirm('Czy na pewno chcesz usunąć tę tablicę?')) return;
 
  try {
    await api(`/boards/${id}`, 'DELETE');
    await loadBoards();
    showMessage('Tablica została usunięta.', 'success');
  } catch (error) {
    showMessage(error.message || 'Nie udało się usunąć tablicy.');
  }
}
 
// Wylogowanie użytkownika
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await api('/auth/logout', 'POST');
    window.location.href = 'login.html';
  } catch (error) {
    showMessage('Nie udało się wylogować.');
  }
});
 
// Uruchomienie strony
async function init() {
  try {
    await loadUser();
    await loadUsers();
    await loadBoards();
  } catch (error) {
    showMessage(error.message || 'Nie udało się pobrać danych.');
  }
}
 
init();