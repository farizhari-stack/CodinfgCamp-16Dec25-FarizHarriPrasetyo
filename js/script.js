// --------- CUSTOM MODAL LOGIC ---------
const modalEl = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalInputs = document.getElementById('modal-inputs');
const btnCancel = document.getElementById('modal-cancel');
const btnConfirm = document.getElementById('modal-confirm');

function showModal({ title, description = '', fields = [], confirmText = "Confirm", cancelText = "Cancel", isAlert = false }) {
    return new Promise((resolve) => {
        if (!modalEl) {
            if (isAlert) { alert(description || title); resolve(true); return; }
            if (fields.length === 0) { resolve(confirm(title + '\n' + description)); return; }
            if (fields.length === 1) { resolve({ [fields[0].id]: prompt(title, fields[0].value) }); return; }
            resolve(null); return; 
        }

        modalTitle.textContent = title;
        if (description) {
            modalDesc.textContent = description;
            modalDesc.classList.remove('hidden');
        } else {
            modalDesc.classList.add('hidden');
        }

        btnConfirm.textContent = confirmText;
        if (isAlert) {
            btnCancel.classList.add('hidden');
        } else {
            btnCancel.textContent = cancelText;
            btnCancel.classList.remove('hidden');
        }

        modalInputs.innerHTML = '';
        const inputEls = [];

        fields.forEach(field => {
            const wrapper = document.createElement('div');
            const label = document.createElement('label');
            label.className = "block text-[10px] font-tech text-sky-500/80 mb-2 uppercase tracking-widest";
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.placeholder = field.placeholder || '';
            input.value = field.value || '';
            input.className = "w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-200 placeholder-slate-600 transition-all outline-none";
            
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            modalInputs.appendChild(wrapper);
            inputEls.push({ id: field.id, el: input });
        });

        modalEl.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        setTimeout(() => {
            modalEl.classList.remove('opacity-0');
            modalEl.querySelector('.glass-card').classList.remove('scale-95');
        }, 10);

        if (inputEls.length > 0) inputEls[0].el.focus();

        const close = (result) => {
            modalEl.classList.add('opacity-0');
            modalEl.querySelector('.glass-card').classList.add('scale-95');
            document.body.style.overflow = ''; // Restore scroll
            setTimeout(() => {
                modalEl.classList.add('hidden');
                resolve(result);
            }, 300);
            
            btnCancel.removeEventListener('click', onCancel);
            btnConfirm.removeEventListener('click', onConfirm);
            document.removeEventListener('keydown', onKey);
        };

        const onCancel = () => close(null);
        const onConfirm = () => {
            if (fields.length === 0) return close(true); // Confirmation/Alert
            const result = {};
            inputEls.forEach(inp => {
                result[inp.id] = inp.el.value;
            });
            close(result);
        };
        const onKey = (e) => {
            if (e.key === 'Escape' && !isAlert) onCancel();
            if (e.key === 'Enter') onConfirm();
        };

        btnCancel.addEventListener('click', onCancel);
        btnConfirm.addEventListener('click', onConfirm);
        document.addEventListener('keydown', onKey);
    });
}
// --------- END CUSTOM MODAL ---------

// State Variables
let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
let links = JSON.parse(localStorage.getItem('dashboard_links')) || [
    { id: '1', title: 'Mainframe', url: 'https://github.com', icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2"></path>' },
    { id: '2', title: 'Archives', url: 'https://stackoverflow.com', icon: '<path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke-width="2"></path>' },
];

// Initialize Theme & Name
const savedTheme = localStorage.getItem('dashboard_theme') || 'dark';
const themeToggleBtn = document.querySelector('[data-purpose="theme-toggle"]');

function updateThemeUI(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<svg class="h-6 w-6 text-sky-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`;
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<svg class="h-6 w-6 text-yellow-500 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`;
        }
    }
}

updateThemeUI(savedTheme === 'dark');

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentlyDark = document.documentElement.classList.contains('dark');
        const nextTheme = currentlyDark ? 'light' : 'dark';
        updateThemeUI(nextTheme === 'dark');
        localStorage.setItem('dashboard_theme', nextTheme);
    });
}

const nameEl = document.getElementById('greeting-name');
if (nameEl) {
    nameEl.textContent = localStorage.getItem('dashboard_name') || 'Operative';
    nameEl.addEventListener('click', async () => {
        const res = await showModal({
            title: "Update Designation",
            fields: [{ id: "name", label: "New Designation", value: nameEl.textContent }]
        });
        if (res && res.name && res.name.trim() !== '') {
            nameEl.textContent = res.name.trim();
            localStorage.setItem('dashboard_name', res.name.trim());
        }
    });
}

// Clock Logic
function updateClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    const timeGreetingEl = document.getElementById('greeting-time');
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    if (timeGreetingEl) {
        if (hour < 12) timeGreetingEl.textContent = "Good Morning, ";
        else if (hour < 18) timeGreetingEl.textContent = "Good Afternoon, ";
        else timeGreetingEl.textContent = "Good Evening, ";
    }
}
setInterval(updateClock, 1000);
updateClock();

// Pomodoro Logic
let timeLeft = 1500; // 25 minutes
let totalTime = 1500;
let timerId = null;
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start');
const progressCircle = document.getElementById('timer-progress');
const circumference = 2 * Math.PI * 132;

function updateDisplay() {
    if (!timerDisplay) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (progressCircle) {
        const offset = circumference - (timeLeft / totalTime) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
}

// Expose setTimer globally for the inline onclick handlers in HTML
window.setTimer = function (minutes) {
    clearInterval(timerId);
    timerId = null;
    timeLeft = minutes * 60;
    totalTime = timeLeft;
    if (startBtn) {
        startBtn.textContent = 'Initiate';
        startBtn.classList.remove('bg-sky-500', 'text-white');
    }
    updateDisplay();
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startBtn.textContent = 'Resume';
            startBtn.classList.remove('bg-sky-500', 'text-white');
        } else {
            startBtn.textContent = 'Standby';
            startBtn.classList.add('bg-sky-500', 'text-white');
            timerId = setInterval(async () => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    timerId = null;
                    startBtn.textContent = 'Complete';
                    await showModal({ title: "Focus Session Complete", description: "Excellent work, Operative.", isAlert: true, confirmText: "Acknowledge" });
                }
            }, 1000);
        }
    });
}

const resetBtn = document.getElementById('timer-reset');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        setTimer(totalTime / 60);
    });
}

// Ensure the time display handles custom prompt 
if (timerDisplay) {
    timerDisplay.parentElement.classList.add('cursor-pointer');
    timerDisplay.parentElement.addEventListener('click', async () => {
        const res = await showModal({
            title: "Configure Focus Time",
            description: "Duration in minutes (1-120)",
            fields: [{ id: "time", label: "Minutes", value: Math.floor(totalTime / 60) }]
        });
        if (res) {
            const parsedTime = parseInt(res.time);
            if (!isNaN(parsedTime) && parsedTime > 0 && parsedTime <= 120) {
                setTimer(parsedTime);
            } else {
                await showModal({ title: "Error", description: "Invalid time entered. Must be between 1 and 120 minutes.", isAlert: true, confirmText: "Dismiss" });
            }
        }
    });
}

updateDisplay();

// To-Do Logic
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-todo');
const container = document.getElementById('todo-container');
const counter = document.getElementById('task-counter');

function saveTasks() {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateCounter() {
    if (!counter) return;
    const count = tasks.filter(t => !t.completed).length;
    counter.textContent = `${count} Active Objective${count !== 1 ? 's' : ''}`;
}

function renderTasks() {
    if (!container) return;
    container.innerHTML = '';
    
    // Sort tasks: Active first, Completed last
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return b.createdAt - a.createdAt; // Newer active first
        return a.completed ? 1 : -1;
    });

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `flex items-center justify-between p-5 rounded-2xl glass-card group transition-all ${task.completed ? 'completed opacity-50' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-center gap-4 flex-1">
                <div class="relative flex items-center justify-center">
                    <input class="w-6 h-6 rounded-lg border-2 cursor-pointer appearance-none transition-all" type="checkbox" ${task.completed ? 'checked' : ''} style="background-color: var(--input-bg); border-color: var(--input-border);"/>
                    <svg class="absolute w-4 h-4 text-sky-500 pointer-events-none opacity-0 check-icon transition-opacity ${task.completed ? '!opacity-100' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path></svg>
                </div>
                <span class="font-medium tracking-wide transition-all flex-1 cursor-pointer pl-2 border-l-2 border-transparent hover:border-sky-500/50 ${task.completed ? 'line-through' : ''}" title="Double-click to edit">${task.text}</span>
            </div>
            <button class="delete-btn text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10 opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;

        // Checkbox Toggle
        li.querySelector('input').addEventListener('change', (e) => {
            const index = tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks[index].completed = e.target.checked;
                saveTasks();
            }
        });

        // Delete
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        });

        // Edit on double click
        const span = li.querySelector('span');
        span.addEventListener('dblclick', async () => {
            if (task.completed) return; // Prevent editing completed tasks
            const res = await showModal({
                title: "Edit Objective",
                fields: [{ id: "text", label: "Objective Description", value: task.text }]
            });
            if (res && res.text && res.text.trim() !== "" && res.text.trim() !== task.text) {
                const newText = res.text.trim();
                // Check dupes
                if (tasks.some(t => t.text.toLowerCase() === newText.toLowerCase() && t.id !== task.id)) {
                    await showModal({ title: "Duplication Detected", description: "An objective with this exact name already exists.", isAlert: true, confirmText: "Understood" });
                    return;
                }
                const index = tasks.findIndex(t => t.id === task.id);
                if (index !== -1) {
                    tasks[index].text = newText;
                    saveTasks();
                }
            }
        });

        container.appendChild(li);
    });

    updateCounter();
}

async function addTask() {
    if (!input) return;
    const text = input.value.trim();
    if (text === "") return;

    // Prevent duplicate tasks (case-insensitive)
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        await showModal({ title: "Duplication Detected", description: "This objective already exists in your active matrix.", isAlert: true, confirmText: "Understood" });
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    input.value = "";
    saveTasks();
}

if (addBtn) addBtn.addEventListener('click', addTask);
if (input) {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
}

// Initial render for To-Do
renderTasks();

// Quick Links Logic
const linksContainer = document.getElementById('quick-links-container');
const addLinkBtn = document.getElementById('add-link-btn');

function saveLinks() {
    localStorage.setItem('dashboard_links', JSON.stringify(links));
    renderLinks();
}

function renderLinks() {
    if (!linksContainer) return;
    linksContainer.innerHTML = '';

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "glass-card flex flex-col items-center justify-center p-8 rounded-3xl hover:-translate-y-2 transition-all group overflow-hidden relative";
        
        let genericIcon = '<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>';
        const svgIcon = link.icon || genericIcon;

        a.innerHTML = `
            <div class="absolute inset-0 bg-sky-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            
            <button class="delete-link-btn absolute top-2 right-2 p-1.5 bg-sky-500/10 rounded-lg opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all z-20 text-slate-500 shadow-xl" data-id="${link.id}">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div class="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow border border-sky-500/20 relative z-10 transition-all">
                <svg class="h-6 w-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">${svgIcon}</svg>
            </div>
            <span class="text-[10px] font-tech text-center tracking-[0.2em] uppercase text-slate-400 group-hover:text-primary transition-colors relative z-10 break-words w-full px-2">${link.title}</span>
        `;
        
        // Prevent generic link click when deleting
        const deleteBtn = a.querySelector('.delete-link-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const confirmed = await showModal({
                title: "Confirm Deletion",
                description: `Are you sure you want to remove the connection to ${link.title}?`,
                confirmText: "Disconnect"
            });
            if (confirmed) {
                links = links.filter(l => l.id !== link.id);
                saveLinks();
            }
        });

        linksContainer.appendChild(a);
    });
}

if (addLinkBtn) {
    addLinkBtn.addEventListener('click', async () => {
        const res = await showModal({
            title: "Add Neural Vector",
            description: "Establish a new quick link to an external node.",
            fields: [
                { id: "title", label: "Portal Designation (Title)", placeholder: "e.g., GitHub" },
                { id: "url", label: "Uplink Vector (URL)", placeholder: "https://" }
            ]
        });
        
        // Verify res properly exists (not cancelled)
        if (!res) return;
        
        if (!res.title || res.title.trim() === '' || !res.url || res.url.trim() === '') {
            await showModal({ title: "Operation Failed", description: "Both title and URL are required.", isAlert: true, confirmText: "Dismiss" });
            return;
        }
        
        let url = res.url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newLink = {
            id: Date.now().toString(),
            title: res.title.trim(),
            url: url,
            icon: '<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2"></path>' // Default lightning icon
        };

        links.push(newLink);
        saveLinks();
    });
}

// Initial render for Links
renderLinks();
