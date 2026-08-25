function calculateStreak() {
    let activeDays = 0;
    for (let day = 0; day < 7; day++) {
        const checkedCount = appState.habits.filter((habit) => habit.days[day]).length;
        if (checkedCount >= 2) activeDays++;
    }

    const streakElem = document.getElementById('stat-habit-streak');
    if (streakElem) {
        streakElem.textContent = `${activeDays} dia${activeDays !== 1 ? 's' : ''}`;
    }
}

function toggleHabit(habitIndex, dayIndex) {
    appState.habits[habitIndex].days[dayIndex] = !appState.habits[habitIndex].days[dayIndex];
    saveState();
    calculateStreak();
}

function renderHabits() {
    const tbody = document.getElementById('habit-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    appState.habits.forEach((habit, habitIndex) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-850/40 transition';

        const daysHtml = habit.days.map((checked, dayIndex) => `
            <td class="py-3 px-2 text-center">
                <input type="checkbox"
                    class="habit-day rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950 cursor-pointer"
                    data-habit="${habitIndex}"
                    data-day="${dayIndex}"
                    ${checked ? 'checked' : ''}>
            </td>
        `).join('');

        tr.innerHTML = `
            <td class="py-3 px-4 font-medium text-slate-200 text-xs">${habit.name}</td>
            ${daysHtml}
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.habit-day').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const habitIndex = Number(event.target.dataset.habit);
            const dayIndex = Number(event.target.dataset.day);
            toggleHabit(habitIndex, dayIndex);
        });
    });

    calculateStreak();
}
