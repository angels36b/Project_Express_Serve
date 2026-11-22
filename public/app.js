const TOKEN_KEY = 'todo_api_token';

const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authForm = document.getElementById('auth-form');
const tokenInput = document.getElementById('token-input');
const authError= document.getElementById('auth-error');

const authorFullname = document.getElementById('author-fullname');
const authorLogin = document.getElementById('author-login');
const logoutBtn = document.getElementById('logout-btn');

const runidForm = document.getElementById('runid-form');
const runidInput = document.getElementById('runid-input');
const createForm = document.getElementById('create-form');
const titleInput = document.getElementById('title-input');
const appError = document.getElementById('app-error');

const tasksList = document.getElementById('tasks-list');
const tasksCount = document.getElementById('tasks-count');

async function apiFetch(url, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY) || '';
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    disconnect();
    throw new Error('Unauthorized: invalid or missing API token.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}


async function connectAndLoad() {
  authError.hidden = true;
  appError.hidden = true;

  try {
    const author = await apiFetch('/api/author/');
    authorFullname.textContent = author.fullName;
    authorLogin.textContent = author.login;

    authSection.hidden = true;
    appSection.hidden = false;

    await loadTasks();
  } catch (err) {
    authError.textContent = err.message;
    authError.hidden = false;
  }
}

function disconnect() {
  sessionStorage.removeItem(TOKEN_KEY);
  tokenInput.value = '';
  appSection.hidden = true;
  authSection.hidden = false;
}

function renderTasks(tasks) {
  tasksList.innerHTML = '';
  tasksCount.textContent = String(tasks.length);

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'task-meta';
    empty.textContent = 'No tasks found for this runId.';
    tasksList.appendChild(empty);
    return;
  }

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTaskDone(task.id, checkbox.checked));

    const textBlock = document.createElement('div');
    const titleSpan = document.createElement('div');
    titleSpan.className = `task-title ${task.done ? 'done' : ''}`;
    titleSpan.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = `ID: ${task.id} | Created: ${task.createdAt}`;

    textBlock.appendChild(titleSpan);
    textBlock.appendChild(meta);
    left.appendChild(checkbox);
    left.appendChild(textBlock);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn secondary small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTaskTitle(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);
    tasksList.appendChild(li);
  }
}

async function loadTasks() {
  appError.hidden = true;
  const runId = runidInput.value.trim();
  try {
    const tasks = await apiFetch(`/api/tasks/?runId=${encodeURIComponent(runId)}`);
    renderTasks(tasks);
  } catch (err) {
    appError.textContent = err.message;
    appError.hidden = false;
  }
}

async function toggleTaskDone(id, done) {
  appError.hidden = true;
  try {
    await apiFetch(`/api/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ done })
    });
    await loadTasks();
  } catch (err) {
    appError.textContent = err.message;
    appError.hidden = false;
  }
}

async function editTaskTitle(task) {
  const nextTitle = prompt('Edit task title (1-200 characters):', task.title);
  if (nextTitle === null) return;

  appError.hidden = true;
  try {
    await apiFetch(`/api/tasks/${task.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ title: nextTitle })
    });
    await loadTasks();
  } catch (err) {
    appError.textContent = err.message;
    appError.hidden = false;
  }
}

async function removeTask(id) {
  appError.hidden = true;
  try {
    await apiFetch(`/api/tasks/${id}/`, {
      method: 'DELETE'
    });
    await loadTasks();
  } catch (err) {
    appError.textContent = err.message;
    appError.hidden = false;
  }
}


authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = tokenInput.value.trim();
  if (!token) return;
  sessionStorage.setItem(TOKEN_KEY, token);
  await connectAndLoad();
});

logoutBtn.addEventListener('click', disconnect);

runidForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await loadTasks();
});

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  appError.hidden = true;
  const title = titleInput.value;
  const runId = runidInput.value.trim();

  try {
    await apiFetch('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify({ title, runId })
    });
    titleInput.value = '';
    await loadTasks();
  } catch (err) {
    appError.textContent = err.message;
    appError.hidden = false;
  }
});

if (sessionStorage.getItem(TOKEN_KEY)) {
  connectAndLoad();
}