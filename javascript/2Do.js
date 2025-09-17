
  // Wait for DOM so elements are guaranteed to exist
  document.addEventListener('DOMContentLoaded', () => {
    console.log('To-Do app loaded');

    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    // Safe load from localStorage (defend against corrupted data)
    let tasks = [];
    try {
      const raw = localStorage.getItem('tasks');
      tasks = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(tasks)) tasks = [];
    } catch (err) {
      console.warn('localStorage tasks parse failed — resetting tasks.', err);
      tasks = [];
      localStorage.removeItem('tasks');
    }

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, i) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.done) span.classList.add('done');
        span.className = 'spacer';
        li.appendChild(span);

        const doneBtn = document.createElement('button');
        doneBtn.textContent = '✔';
        doneBtn.setAttribute('data-action','toggle');
        doneBtn.setAttribute('data-index', i);
        li.appendChild(doneBtn);

        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.setAttribute('data-action','delete');
        delBtn.setAttribute('data-index', i);
        li.appendChild(delBtn);

        taskList.appendChild(li);
      });
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (!text) return;
      tasks.push({ text, done: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }

    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });

    // Event delegation for done/delete buttons
    taskList.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      const idx = e.target.getAttribute('data-index');
      if (!action || idx === null) return;
      const i = Number(idx);
      if (action === 'toggle') {
        tasks[i].done = !tasks[i].done;
        saveTasks();
        renderTasks();
      } else if (action === 'delete') {
        tasks.splice(i, 1);
        saveTasks();
        renderTasks();
      }
    });

    // initial render
    renderTasks();
});