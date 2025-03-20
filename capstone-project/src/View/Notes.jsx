import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCompleteNote = async () => {
    if (noteTitle == '' || currentNote == '') {
      alert("All fields need to be filled");
      return;
    }

    let username = jwtDecode(localStorage.getItem('authToken')).username;
    if (!username) {
      console.error("Please log in before adding a note");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/add_note', {
        username: username,
        noteTitle: noteTitle,
        noteContent: currentNote
      });
      console.log(response);
      if (response.data === "Note added successfully") {
        alert('Note added successfully');
      } else {
        alert('Error adding note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note');
    }

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
    <div className='body'>
      <div className="container">

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
                {note.title} + {index}
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
  );
}

export default Notes;
