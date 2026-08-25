document.addEventListener('DOMContentLoaded', () => {
    loadState();
    restoreTasks();
    renderHabits();
    setupTaskListeners();
    initNotes();
    updateProgress();
});
