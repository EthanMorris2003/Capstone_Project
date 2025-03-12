import { useState } from 'react';
import logout from 'capstone-project/src/Assets/logout.svg';

export function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to complete and save a note
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

  // Function to create a new empty note
  const handleNewNote = () => {
    setCurrentNote('');
    setNoteTitle('');
    setEditingIndex(null);
  };

  // Function to delete a note
  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, idx) => idx !== index));

    // Reset editing state if deleting the currently selected note
    if (index === editingIndex) {
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
    }
  };

  // Function to select a note from the list
  const selectNote = (note, index) => {
    setNoteTitle(note.title);
    setCurrentNote(note.content);
    setEditingIndex(index);
  };

  return (
    <div className='body'>
      <div className="container">

        {/* Notes Sidebar */}
        <div className="notes-sidebar">
          <h3>Previous Notes</h3>
          <hr className="notes-divider" />
          <div className="notes-list">
            {notes.map((note, index) => (
              <div key={index} className={`note-item ${index === editingIndex ? 'selected' : ''}`}>
                <span className="note-text" onClick={() => selectNote(note, index)}>
                  {note.title}
                </span>
     
          
              </div>
            ))}
          </div>
        </div>

        {/* Buttons for Creating and Deleting Notes */}
        <div className="new-note-button">
          <button className="add-note" onClick={handleNewNote}>+ New Note</button>
          <button className="complete-note" onClick={handleCompleteNote}>Complete Note</button>
          <button 
            className="delete-note-btn" 
            onClick={() => handleDeleteNote(editingIndex)} 
            disabled={editingIndex === null}
          >
            Delete Note
          </button>
        </div>

        {/* Notes Input Area */}
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
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Notes;
