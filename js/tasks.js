const CATEGORY_MAP = {
    '70': { code: '70%', label: 'Prática' },
    '20': { code: '20%', label: 'Social' },
    '10': { code: '10%', label: 'Estudo' }
};

function getTaskCategory(id) {
    const match = id && id.match(/-(\d{2})-/);
    return CATEGORY_MAP[match ? match[1] : ''] || { code: '—', label: '—' };
}

function getTaskTitle(checkbox) {
    const title = checkbox.closest('label')?.querySelector('.font-medium');
    return title ? title.textContent.trim() : checkbox.getAttribute('data-id');
}

function statusMarkup(checked) {
    if (checked) {
        return '<span class="text-[10px] font-semibold text-emerald-400 whitespace-nowrap">Concluída</span>';
    }
    return '<span class="text-[10px] font-semibold text-slate-500 whitespace-nowrap">Em andamento</span>';
}

function renderGoalSummary() {
    const goal1 = document.getElementById('summary-goal-1');
    const goal2 = document.getElementById('summary-goal-2');
    if (!goal1 || !goal2) return;

    const rows = { 1: [], 2: [] };

    document.querySelectorAll('.checkbox-custom').forEach((checkbox) => {
        const id = checkbox.getAttribute('data-id');
        const goal = checkbox.getAttribute('data-goal');
        if (!id || !rows[goal]) return;

        const category = getTaskCategory(id);
        const checked = Boolean(appState.tasks[id] || checkbox.checked);
        const accent = goal === '2' ? 'text-purple-500' : 'text-emerald-500';

        rows[goal].push(`
            <label class="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-2 rounded-lg border border-slate-800/60 bg-slate-900/70 hover:bg-slate-900 cursor-pointer">
                <input type="checkbox" class="summary-checkbox rounded border-slate-700 ${accent} focus:ring-emerald-500/20 bg-slate-950" data-id="${id}" ${checked ? 'checked' : ''}>
                <span class="text-xs font-medium text-slate-100 leading-snug">${getTaskTitle(checkbox)}</span>
                <span class="text-[10px] text-slate-400 whitespace-nowrap">${category.code} · ${category.label}</span>
                <span data-summary-status="${id}">${statusMarkup(checked)}</span>
            </label>
        `);
    });

    goal1.innerHTML = rows[1].join('');
    goal2.innerHTML = rows[2].join('');
}

function syncTaskCheckboxes(id, checked) {
    document.querySelectorAll(`.checkbox-custom[data-id="${id}"], .summary-checkbox[data-id="${id}"]`).forEach((checkbox) => {
        checkbox.checked = checked;
    });

    document.querySelectorAll(`[data-summary-status="${id}"]`).forEach((badge) => {
        badge.innerHTML = statusMarkup(checked);
    });
}

function restoreTasks() {
    document.querySelectorAll('.checkbox-custom').forEach((checkbox) => {
        const id = checkbox.getAttribute('data-id');
        if (appState.tasks[id]) {
            checkbox.checked = true;
        }
    });
    renderGoalSummary();
}

function setupTaskListeners() {
    document.addEventListener('change', (event) => {
        const checkbox = event.target;
        if (!checkbox.matches('.checkbox-custom, .summary-checkbox')) return;

        const id = checkbox.getAttribute('data-id');
        appState.tasks[id] = checkbox.checked;
        syncTaskCheckboxes(id, checkbox.checked);
        saveState();
        updateProgress();
    });
}

function updateProgress() {
    const allCheckboxes = Array.from(document.querySelectorAll('.checkbox-custom'));
    const totalTasks = allCheckboxes.length;
    const completedTasks = allCheckboxes.filter((checkbox) => checkbox.checked).length;
    const globalPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('global-progress-text').textContent = `${globalPercent}%`;
    document.getElementById('global-progress-bar').style.width = `${globalPercent}%`;
    document.getElementById('stat-completed-tasks').textContent = `${completedTasks}/${totalTasks}`;

    const goal1Checkboxes = allCheckboxes.filter((checkbox) => checkbox.getAttribute('data-goal') === '1');
    const goal1Done = goal1Checkboxes.filter((checkbox) => checkbox.checked).length;
    const goal1Percent = goal1Checkboxes.length > 0 ? Math.round((goal1Done / goal1Checkboxes.length) * 100) : 0;

    document.getElementById('goal1-progress-percent').textContent = `${goal1Percent}%`;
    document.getElementById('goal1-progress-bar').style.width = `${goal1Percent}%`;

    const goal2Checkboxes = allCheckboxes.filter((checkbox) => checkbox.getAttribute('data-goal') === '2');
    const goal2Done = goal2Checkboxes.filter((checkbox) => checkbox.checked).length;
    const goal2Percent = goal2Checkboxes.length > 0 ? Math.round((goal2Done / goal2Checkboxes.length) * 100) : 0;

    document.getElementById('goal2-progress-percent').textContent = `${goal2Percent}%`;
    document.getElementById('goal2-progress-bar').style.width = `${goal2Percent}%`;
}
