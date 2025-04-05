import { useNotesViewModel } from '../ViewModel/notesViewModel';

export function Notes() {
  const {
    notes,
    currentNote,
    noteTitle,
    editingIndex,
    notePinned,
    setNoteTitle,
    setCurrentNote,
    handleCompleteNote,
    handleNewNote,
    handleDeleteNote,
    handlePinNote,
    selectNote,
  } = useNotesViewModel();

  return (
    <div className="body">
      <div className="container">
        <div className="notes-sidebar">
          <h3>Previous Notes</h3>
          <hr className="notes-divider" />
          <div className="notes-list">
            {notes.map((note) => (
              <div
                key={note.noteId}
                className={`note-item ${note.noteId === editingIndex ? 'selected' : ''}`}
                onClick={() => selectNote(note, note.noteId)}
              >
                {note.name} {Boolean(note.pinned) && "📌"}
              </div>
            ))}
          </div>
        </div>

        <div className="new-note-button">
          <button className="add-note" onClick={handleNewNote}>+ New Note</button>
          <button className="complete-note" onClick={handleCompleteNote}>Complete Note</button>
          <button
            className="delete-note-btn"
            onClick={handleDeleteNote}
            disabled={editingIndex === null}
          >
            Delete Note
          </button>
        </div>

        <div className="pin-note-button-container">
          <button
            className="pin-note-btn"
            onClick={handlePinNote}
            disabled={editingIndex === null}
          >
            {editingIndex !== null && notePinned ? "Unpin Note" : "Pin Note"}
          </button>
        </div>

        <div className="content">
          <div className="notes-container">
            <input
              type="text"
              className="note-title"
              placeholder="Enter This Note's Title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              className="notes-area"
              placeholder="Start typing your note here..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
