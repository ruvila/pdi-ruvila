function normalizeNotes(notes) {
    if (Array.isArray(notes)) {
        return notes.map((note, index) => {
            if (typeof note === 'string') {
                return { id: `note-${index}-${Date.now()}`, text: note, createdAt: Date.now() };
            }
            return {
                id: note.id || `note-${index}-${Date.now()}`,
                text: note.text || '',
                createdAt: note.createdAt || Date.now()
            };
        }).filter((note) => note.text.trim());
    }

    if (typeof notes === 'string' && notes.trim()) {
        return [{ id: `note-migrated-${Date.now()}`, text: notes.trim(), createdAt: Date.now() }];
    }

    return [];
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatNoteDate(timestamp) {
    return new Date(timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderNotes() {
    const list = document.getElementById('notes-list');
    if (!list) return;

    if (!appState.notes.length) {
        list.innerHTML = `
            <p class="text-xs text-slate-500 col-span-full">Nenhuma nota ainda. Escreva acima e clique em Salvar Notas.</p>
        `;
        return;
    }

    list.innerHTML = appState.notes.map((note) => `
        <article class="relative bg-slate-950 border border-slate-800 rounded-xl p-4 pr-10">
            <button type="button" class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition" data-delete-note="${note.id}" aria-label="Excluir nota">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <p class="text-[10px] text-slate-500 mb-2">${formatNoteDate(note.createdAt)}</p>
            <p class="text-xs text-slate-200 whitespace-pre-wrap break-words">${escapeHtml(note.text)}</p>
        </article>
    `).join('');
}

function deleteNote(id) {
    appState.notes = appState.notes.filter((note) => note.id !== id);
    saveState();
    renderNotes();
}

function initNotes() {
    appState.notes = normalizeNotes(appState.notes);
    saveState();
    renderNotes();

    const saveBtn = document.getElementById('save-notes-btn');
    const journal = document.getElementById('journal-notes');
    const status = document.getElementById('save-status');
    const list = document.getElementById('notes-list');

    if (saveBtn && journal) {
        saveBtn.addEventListener('click', () => {
            const text = journal.value.trim();
            if (!text) return;

            appState.notes.unshift({
                id: `note-${Date.now()}`,
                text,
                createdAt: Date.now()
            });
            journal.value = '';
            saveState();
            renderNotes();
            status.classList.remove('hidden');
            setTimeout(() => status.classList.add('hidden'), 3000);
        });
    }

    if (list) {
        list.addEventListener('click', (event) => {
            const button = event.target.closest('[data-delete-note]');
            if (!button) return;
            deleteNote(button.getAttribute('data-delete-note'));
        });
    }
}
