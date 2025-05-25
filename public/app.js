const API = 'http://localhost:3000/tareas';

async function renderTasks() {
  const res = await fetch('http://localhost:3000/tareas');
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completada ? "completed" : "";

    const text = document.createElement("span");
    text.textContent = `${task.texto} (Fecha: ${task.fecha} ${task.hora})`; 
    text.style.flexGrow = "1";
    
    const actions = document.createElement("div");
    actions.className = "actions";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completada ? "Desmarcar" : "Completar";
    completeBtn.onclick = () => toggleTask(task.id, task.completada ? 0 : 1);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(text);
    li.appendChild(actions);
    list.appendChild(li);
  });
}


async function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("taskDate");
  const timeInput = document.getElementById("taskTime");

  const texto = input.value.trim();
  const fecha = dateInput.value;
  const hora = timeInput.value;

  if (!texto || !fecha || !hora) {
    return alert("Por favor completa texto, fecha y hora");
  }

  await fetch('http://localhost:3000/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto, fecha, hora })
  });

  input.value = "";
  dateInput.value = "";
  timeInput.value = "";
  renderTasks();
  playSound();
  showAlert("¡Tarea agregada!");
}



async function toggleTask(id, completada) {
  await fetch(`http://localhost:3000/tareas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completada })
  });
  renderTasks();
}


function editTask(index) {
  const newText = prompt("Editar tarea:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

async function deleteTask(id) {
  if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;

  await fetch(`http://localhost:3000/tareas/${id}`, { method: 'DELETE' });
  renderTasks();
}


function playSound() {
  const sound = document.getElementById("alertSound");
  sound.play();
}

function showAlert(message) {
  const alert = document.getElementById("alertMsg");
  alert.textContent = message;
  alert.style.display = "block";
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

async function checkTaskReminders() {
  const res = await fetch("http://localhost:3000/tareas");
  const tasks = await res.json();

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  for (const task of tasks) {
    if (
      !task.notificado &&
      task.fecha === currentDate &&
      task.hora === currentTime
    ) {
      alert(`🔔 ¡Hora de: ${task.texto}!`);
      playSound();

      // Actualizar "notificado" a 1
      await fetch(`http://localhost:3000/tareas/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificado: 1 })
      });
    }
  }
}


// Revisar cada minuto
setInterval(checkTaskReminders, 60000);

