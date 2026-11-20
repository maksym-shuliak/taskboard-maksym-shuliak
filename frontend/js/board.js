const boardId = new URLSearchParams(window.location.search).get('id');
const LABELS = { high: 'Wysoki', medium: 'Średni', low: 'Niski' };
const STATUSES = {
  todo: 'Do zrobienia',
  in_progress: 'W trakcie',
  done: 'Gotowe'
};
 
let taskUsers = [];
let editingTaskId = null;
 
const taskForm = document.getElementById('taskForm');
const modal = new bootstrap.Modal('#taskModal');
 
// Wyświetlanie komunikatów o błędach
function showError(error) {
  alert(error.message || 'Wystąpił błąd.');
}
 
// Formatowanie daty do formularza
function formatDate(value) {
  return value ? String(value).slice(0, 10) : '';
}
 
async function loadTasks() {
  // Pobieranie wartości filtrów
  const priority = document.getElementById('filterPriority').value;
  const assignee = document.getElementById('filterAssignee').value;
  const search = document.getElementById('filterSearch').value.trim();
 
  // Tworzenie parametrów zapytania do API
  const params = new URLSearchParams();
 
  if (priority) {
    params.set('priority', priority);
  }
 
  if (assignee && assignee !== 'none') {
    params.set('assigneeId', assignee);
  }
 
  if (search) {
    params.set('q', search);
  }
 
  // Pobieranie zadań z filtrowaniem po stronie serwera
  const tasks = await api(`/boards/${boardId}/tasks?${params}`);
 
 
  // Wyświetlanie zadań w trzech kolumnach
  for (const status of ['todo', 'in_progress', 'done']) {
    const column = document.getElementById(`col-${status}`);
    column.textContent = '';
   
    // Wybieranie zadań według statusu
    const columnTasks = tasks.filter(
    task => task.status === status);
 
    // Aktualizacja licznika zadań
    document.getElementById(`count-${status}`).textContent =
      columnTasks.length;
 
    // Tworzenie kart zadań
    for (const task of columnTasks) {
      const card = document.createElement('div');
      card.className = `card shadow-sm priority-${task.priority}`;
 
      const body = document.createElement('div');
      body.className = 'card-body p-3';
 
      // Tytuł zadania
      const title = document.createElement('h3');
      title.className = 'h6';
      title.textContent = task.title;
 
      // Priorytet zadania
      const badge = document.createElement('span');
      badge.className = 'badge text-bg-light';
      badge.textContent =
        'Priorytet: ' + (LABELS[task.priority] || task.priority);
 
      body.append(title, badge);
 
      // Termin wykonania
      if (task.deadline) {
        const deadline = document.createElement('p');
        const date = formatDate(task.deadline);
 
        // Pobieranie dzisiejszej daty
        const today = new Date();
        const currentDate = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, '0'),
          String(today.getDate()).padStart(2, '0')
        ].join('-');
 
        // Sprawdzanie, czy zadanie jest po terminie
        const isOverdue = date < currentDate && task.status !== 'done';
 
        deadline.className = isOverdue
          ? 'small text-danger fw-bold mt-2 mb-1'
          : 'small text-secondary mt-2 mb-1';
 
        deadline.textContent = isOverdue
          ? `Termin: ${date} (po terminie)`
          : `Termin: ${date}`;
 
        body.appendChild(deadline);
      }
 
      // Przypisana osoba
      if (task.assigneeId) {
        const user = taskUsers.find(
          u => Number(u.id) === Number(task.assigneeId)
        );
 
        const assignedUser = document.createElement('p');
        assignedUser.className = 'small text-secondary mt-1 mb-2';
        assignedUser.textContent = user
          ? `Przypisano: ${user.firstName} ${user.lastName}`
          : `Przypisano: użytkownik ${task.assigneeId}`;
 
        body.appendChild(assignedUser);
      }
 
      // Przyciski zadania
      const buttons = document.createElement('div');
      buttons.className = 'd-flex flex-wrap gap-2 mt-3';
 
      // Szczegóły zadania
      const detailsBtn = document.createElement('button');
      detailsBtn.type = 'button';
      detailsBtn.className = 'btn btn-outline-info btn-sm';
      detailsBtn.textContent = 'Szczegóły';
      detailsBtn.addEventListener('click', () => {
        showTaskDetails(task.id);
      });
 
      // Edycja zadania
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-outline-secondary btn-sm';
      editBtn.textContent = 'Edytuj';
      editBtn.addEventListener('click', () => {
        editTask(task.id);
      });
 
 
      // Przycisk zmiany statusu zadania
      const statusBtn = document.createElement('button');
      statusBtn.type = 'button';
      statusBtn.className = 'btn btn-outline-success btn-sm';
 
      // Tekst przycisku zależny od statusu
      const statusButtonLabels = {
        todo: 'Przenieś do: W trakcie',
        in_progress: 'Przenieś do: Gotowe',
        done: 'Otwórz ponownie'
      };
 
      statusBtn.textContent = statusButtonLabels[task.status];
 
      statusBtn.addEventListener('click', () => {
        changeTaskStatus(task.id);
      });
 
      // Usuwanie zadania
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Usuń';
      deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
      });
 
      buttons.append(detailsBtn, editBtn, statusBtn, deleteBtn);
      body.appendChild(buttons);
 
      card.appendChild(body);
      column.appendChild(card);
    }
  }
}
 
// Otwieranie formularza nowego zadania
document.getElementById('newTaskBtn').addEventListener('click', () => {
  editingTaskId = null;
  taskForm.reset();
 
  document.getElementById('taskTitle').classList.remove('is-invalid');
  document.getElementById('taskModalTitle').textContent = 'Nowe zadanie';
 
  modal.show();
});
 
// Wyświetlanie szczegółów zadania
async function showTaskDetails(id) {
  try {
    const task = await api(`/tasks/${id}`);
 
    const user = taskUsers.find(
      u => Number(u.id) === Number(task.assigneeId)
    );
 
    const assignee = user
      ? `${user.firstName} ${user.lastName}`
      : 'Nieprzypisane';
 
    const details = document.getElementById('taskDetailsContent');
    details.textContent = '';
 
    // Informacje wyświetlane w oknie szczegółów
    const fields = [
      ['Tytuł', task.title],
      ['Opis', task.description || 'Brak opisu'],
      ['Status', STATUSES[task.status] || task.status],
      ['Priorytet', LABELS[task.priority] || task.priority],
      ['Termin', formatDate(task.deadline) || 'Brak terminu'],
      ['Przypisano', assignee]
    ];
 
    for (const [label, value] of fields) {
      const paragraph = document.createElement('p');
      paragraph.className = 'mb-3';
 
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
 
      paragraph.append(strong, document.createTextNode(value));
      details.appendChild(paragraph);
    }
 
    // Otwieranie okna ze szczegółami
    const detailsModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('taskDetailsModal')
    );
 
    detailsModal.show();
  } catch (error) {
    showError(error);
  }
}
 
// Pobieranie szczegółów zadania do edycji
async function editTask(id) {
  try {
    const task = await api(`/tasks/${id}`);
 
    editingTaskId = id;
 
    document.getElementById('taskModalTitle').textContent =
      'Edytuj zadanie';
 
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value =
      task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDeadline').value =
      formatDate(task.deadline);
    document.getElementById('taskAssignee').value =
      task.assigneeId || '';
 
    document.getElementById('taskTitle').classList.remove('is-invalid');
 
    modal.show();
  } catch (error) {
    showError(error);
  }
}
 
// Zmiana statusu zadania na kolejny
async function changeTaskStatus(id) {
  try {
    // Pobieranie aktualnych danych zadania
    const task = await api(`/tasks/${id}`);
 
    const nextStatus = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo'
    };
 
    // Zachowanie pozostałych danych zadania
    const taskData = {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: nextStatus[task.status],
      deadline: formatDate(task.deadline) || null,
      assigneeId: task.assigneeId || null,
      boardId: Number(task.boardId)
    };
 
    // Aktualizacja statusu w bazie danych
    await api(`/tasks/${id}`, 'PUT', taskData);
 
    // Odświeżenie listy zadań
    await loadTasks();
  } catch (error) {
    showError(error);
  }
}
 
// Zapisywanie nowego lub edytowanego zadania
taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const title = document.getElementById('taskTitle');
  const titleValue = title.value.trim();
 
  if (titleValue.length < 3 || titleValue.length > 100) {
    title.classList.add('is-invalid');
    return;
  }
 
  title.classList.remove('is-invalid');
 
  const taskData = {
    title: titleValue,
    description: document.getElementById('taskDescription').value.trim(),
    priority: document.getElementById('taskPriority').value,
    status: document.getElementById('taskStatus').value,
    deadline: document.getElementById('taskDeadline').value || null,
    assigneeId: document.getElementById('taskAssignee').value
      ? Number(document.getElementById('taskAssignee').value)
      : null,
    boardId: Number(boardId)
  };
 
  try {
    if (editingTaskId === null) {
      // Dodawanie nowego zadania
      await api('/tasks', 'POST', taskData);
    } else {
      // Aktualizacja istniejącego zadania
      await api(`/tasks/${editingTaskId}`, 'PUT', taskData);
    }
 
    modal.hide();
    taskForm.reset();
    editingTaskId = null;
 
    await loadTasks();
  } catch (error) {
    showError(error);
  }
});
 
// Usuwanie zadania po potwierdzeniu
async function deleteTask(id) {
  if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
    return;
  }
 
  try {
    await api(`/tasks/${id}`, 'DELETE');
    await loadTasks();
  } catch (error) {
    showError(error);
  }
}
 
// Filtrowanie zadań według priorytetu
document.getElementById('filterPriority').addEventListener('change', () => {
  loadTasks().catch(showError);
});
 
// Pobieranie użytkowników
async function loadUsers() {
 taskUsers = await api('/users');
 
  // Lista osób w formularzu zadania
  const select = document.getElementById('taskAssignee');
  select.textContent = '';
 
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Nieprzypisane';
  select.appendChild(emptyOption);
 
  for (const user of taskUsers) {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.firstName} ${user.lastName}`;
    select.appendChild(option);
  }
 
  // Lista osób w filtrze
  const filterAssignee = document.getElementById('filterAssignee');
  filterAssignee.textContent = '';
 
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'Wszyscy';
  filterAssignee.appendChild(allOption);
 
  const noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'Nieprzypisane';
  filterAssignee.appendChild(noneOption);
 
  for (const user of taskUsers) {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.firstName} ${user.lastName}`;
    filterAssignee.appendChild(option);
  }
}
 
// Pobieranie informacji o zalogowanym użytkowniku
async function loadCurrentUser() {
  const user = await api('/auth/me');
 
  document.getElementById('userName').textContent =
    `${user.firstName} ${user.lastName}`;
}
 
// Pobieranie informacji o tablicy
async function loadBoard() {
  const boards = await api('/boards');
 
  const board = boards.find(
    b => Number(b.id) === Number(boardId)
  );
 
  if (!board) {
    throw new Error('Nie znaleziono tablicy.');
  }
 
  document.getElementById('boardTitle').textContent = board.name;
  document.getElementById('boardBreadcrumb').textContent = board.name;
  document.getElementById('boardDescription').textContent =
    board.description || '';
}
 
// Filtrowanie według przypisanej osoby
document.getElementById('filterAssignee').addEventListener('change', () => {
  loadTasks().catch(showError);
});
 
// Wyszukiwanie zadań po tytule
document.getElementById('filterSearch').addEventListener('input', () => {
  loadTasks().catch(showError);
});
 
// Czyszczenie wszystkich filtrów
document.getElementById('clearFiltersBtn').addEventListener('click', () => {
  document.getElementById('filterPriority').value = '';
  document.getElementById('filterAssignee').value = '';
  document.getElementById('filterSearch').value = '';
 
  loadTasks().catch(showError);
});
 
// Uruchomienie strony
async function init() {
  try {
    if (!boardId || !/^[1-9]\d*$/.test(boardId)) {
      window.location.href = 'boards.html';
      return;
    }
 
    await loadCurrentUser();
    await loadUsers();
    await loadBoard();
    await loadTasks();
  } catch (error) {
    showError(error);
  }
}
 
init();
 