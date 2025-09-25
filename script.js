let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const modeToggle = document.getElementById('mode-toggle');

function renderTasks() {
  taskList.innerHTML = '';
  let completed = 0;
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('draggable', 'true');

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${idx})">
      <label>${task.text}</label>
      <button class="edit-btn" onclick="editTask(${idx})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${idx})">Delete</button>
    `;

  
    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', idx);
    });
    
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      li.style.borderTop = '2px solid var(--accent)';
    });
    
    li.addEventListener('dragleave', () => {
      li.style.borderTop = '';
    });
    
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      let draggedIndex = e.dataTransfer.getData('text/plain');
      let targetIndex = idx;
      tasks.splice(targetIndex, 0, tasks.splice(draggedIndex, 1)[0]);
      renderTasks();
    });

    taskList.appendChild(li);
    if (task.completed) completed++;
  });
  updateProgress(completed, tasks.length);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  if (taskInput.value.trim()) {
    tasks.push({ text: taskInput.value.trim(), completed: false });
    taskInput.value = '';
    renderTasks();
  }
}

function toggleComplete(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  renderTasks();

  if (tasks[idx].completed) {
    // Check overall completion percent
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    if (totalCount > 0 && completedCount === totalCount) {
      // Full completion celebration
      strongCelebrate();
    }
    else {
      // Small celebration for single task complete
      smallCelebrate(idx);
    }
  }
}


function deleteTask(idx) {
  tasks.splice(idx, 1);
  renderTasks();
}

function editTask(idx) {
  const newText = prompt("Edit task:", tasks[idx].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[idx].text = newText.trim();
    renderTasks();
  }
}

function updateProgress(completed, total) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  progressBar.style.width = percent + "%";
  progressText.innerText = percent + "% Completed";
}


modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if(document.body.classList.contains('dark')) modeToggle.innerText = "Light Mode";
  else modeToggle.innerText = "Dark Mode";
});

function smallCelebrate(idx) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.backgroundColor = '#fbc531';
  particle.style.borderRadius = '50%';
  particle.style.width = '12px';
  particle.style.height = '12px';

  let taskItems = document.querySelectorAll('#task-list li');
  if(taskItems[idx]) {
    let rect = taskItems[idx].getBoundingClientRect();
    particle.style.left = rect.left + 'px';
    particle.style.top = rect.top + 'px';
    particle.style.opacity = '1';
    particle.style.transform = 'translate(0, 0) scale(1)';
    particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';

    document.body.appendChild(particle);
    setTimeout(() => {
      particle.style.transform = 'translate(50px, -50px) scale(0)';
      particle.style.opacity = '0';
    }, 10);
    setTimeout(() => particle.remove(), 1100);
  }
}


function strongCelebrate() {
  const colors = ['#fbc531', '#8f44fd', '#271a61', '#ff3864', '#23d160', '#ff7f50', '#6495ed'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = 9999;
  document.body.appendChild(container);

  const particleCount = 70;

  for(let i=0; i<particleCount; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 12 + 6 + 'px';
    particle.style.position = 'absolute';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.width = size;
    particle.style.height = size;
    particle.style.left = (window.innerWidth / 2) + (Math.random() * 200 - 100) + 'px';
    particle.style.top = (window.innerHeight / 2) + (Math.random() * 200 - 100) + 'px';
    particle.style.opacity = '1';
    particle.style.transform = `translate(0, 0) scale(1)`;

    const angle = Math.random() * 2 * Math.PI;
    particle.style.setProperty('--move-x', Math.cos(angle));
    particle.style.setProperty('--move-y', Math.sin(angle));

    particle.style.animation = `explode 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards`;
    particle.style.animationDelay = (Math.random() * 0.6) + 's';

    container.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
      if(container.childElementCount === 0) {
        container.remove();
      }
    });
  }
}



const BACKGROUND = document.getElementById('background-3d');

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  const size = Math.random() * 60 + 40; // 40px se 100px
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  
  bubble.style.top = Math.random() * 100 + 'vh';
  bubble.style.left = Math.random() * 100 + 'vw';
  
  const rotateX = Math.random() * 360;
  const rotateY = Math.random() * 360;
  const rotateZ = Math.random() * 360;
  
  bubble.style.animationName = `bubbleMove${Math.floor(Math.random() * 3) + 1}`;
  bubble.style.animationDuration = (Math.random() * 10 + 5) + 's'; // 5s - 15s
  
  BACKGROUND.appendChild(bubble);
  bubble.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
}

for(let i = 0; i < 20; i++) {
  createBubble();
}

const bg = document.getElementById('parallax-space-bg');

window.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  let offsetX = (e.clientX - centerX) / centerX; // range: -1 to 1
  let offsetY = (e.clientY - centerY) / centerY;


  const orbits = document.querySelectorAll('#parallax-space-bg .orbit');
  orbits.forEach((orbit, i) => {
    let factor = (i + 1) * 3; // farthest moves slowest
    let dx = offsetX * factor;
    let dy = offsetY * factor;

    orbit.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${orbit.style.animationName === 'spinReverse' ? -performance.now()/100 : performance.now()/100}deg)`;
  });

  
  const nebulas = document.querySelectorAll('.nebula');
  nebulas.forEach((nebula, i) => {
    let nfactor = (i+1)*5;
    nebula.style.transform = `translate3d(${offsetX * nfactor * 0.3}px, ${offsetY * nfactor * 0.3}px, 0)`;
  });

  const sun = document.querySelector('.sun');
  sun.style.transform = `translate3d(calc(50% + ${offsetX * 15}px), calc(50% + ${offsetY * 15}px), 0) scale(${1 + Math.sin(performance.now()/1000) * 0.07})`;
});

const quotes = [
  "Stay focused and never give up!",
  "One step at a time is progress.",
  "Your productivity is your power.",
  "Make each day count!",
  "Success starts with self-discipline."
];

function showQuote() {
  const quoteEl = document.getElementById('quote');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteEl.innerText = quotes[randomIndex];
}

window.onload = () => {
  renderTasks();
  showQuote();
};

addBtn.addEventListener('click', addTask);

