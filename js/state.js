const STORAGE_KEY = 'pdi_ruvila_state';

const DEFAULT_HABITS = [
    { id: 'h1', name: 'Estudo CS50 ou Pós USP', days: [false, false, false, false, false, false, false] },
    { id: 'h2', name: 'Code Review Criterioso', days: [false, false, false, false, false, false, false] },
    { id: 'h3', name: 'Usar e aprimorar Agentes de IA em tasks do dia', days: [false, false, false, false, false, false, false] },
    { id: 'h4', name: 'Papo com PM ou Mentoria (Monique)', days: [false, false, false, false, false, false, false] },
    { id: 'h5', name: 'Anotar 1 insight no Diário de Bordo', days: [false, false, false, false, false, false, false] }
];

var appState = {
    tasks: {},
    habits: DEFAULT_HABITS.map((habit) => ({ ...habit, days: [...habit.days] })),
    notes: []
};

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        appState = {
            tasks: parsed.tasks || {},
            habits: Array.isArray(parsed.habits) ? parsed.habits : appState.habits,
            notes: parsed.notes
        };
    } catch (error) {
        console.error('Erro ao carregar estado salvo', error);
    }
}
