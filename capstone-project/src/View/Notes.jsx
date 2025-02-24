import { useState } from 'react';
import logout from 'capstone-project/src/Assets/logout.svg';

export function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCompleteNote = () => {
    if (noteTitle.trim() && currentNote.trim()) {
      const newNote = { title: noteTitle, content: currentNote };
      let updatedNotes;

      if (editingIndex !== null) {
        updatedNotes = notes.filter((_, idx) => idx !== editingIndex);
      } else {
        updatedNotes = notes;
      }

      setNotes([newNote, ...updatedNotes]);
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
    }
  };

  const handleNewNote = () => {
    setCurrentNote('');
    setNoteTitle('');
    setEditingIndex(null);
  };

  const selectNote = (note, index) => {
    setNoteTitle(note.title);
    setCurrentNote(note.content);
    setEditingIndex(index);
  };

  return (
    <div className='homePage'>
      <div className='header'>
        <h1 className="header-title">Notes Section</h1>
        <div className="header-icons">
          <button className="logout-button">
            <img src={logout} alt="Logout Icon" className="logout-icon" />
          </button>
        </div>
      </div>

      <div className='body'>
        <div className="container">
          <div className="banner">
            <button>Dashboard</button>
            <button className="active">Notes</button>
            <button>Calendar</button>
          </div>

          <div className="notes-sidebar">
            <h3>Previous Notes</h3>
            <hr className="notes-divider" />
            <div className="notes-list">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className={`note-item ${index === editingIndex ? 'selected' : ''}`}
                  onClick={() => selectNote(note, index)}
                >
                  {note.title}
                </div>
              ))}
            </div>
          </div>

          <div className="new-note-button">
            <button className="add-note" onClick={handleNewNote}>+ New Note</button>
            <button className="complete-note" onClick={handleCompleteNote}>Complete Note</button>
          </div>

          <div className="content">
            <div className="notes-container">
              <input
                type="text"
                className="note-title"
                placeholder="Enter This Notes Title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              <textarea
                className="notes-area"
                placeholder="Start typing your note here..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
