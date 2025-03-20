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
      let updatedNotes;

      if (editingIndex !== null) {
        updatedNotes = notes.map((note, idx) =>
          idx === editingIndex
            ? { ...note, title: noteTitle, content: currentNote } // Keep pin status
            : note
        );
      } else {
        const newNote = { title: noteTitle, content: currentNote, pinned: false };
        updatedNotes = [...notes, newNote]; // Add new note at the bottom
      }

      setNotes(updatedNotes.sort((a, b) => b.pinned - a.pinned)); // Keep pinned notes at the top
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

  // Function to delete a selected note
  const handleDeleteNote = () => {
    if (editingIndex !== null) {
      setNotes(notes.filter((_, idx) => idx !== editingIndex));
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
    }
  };

  // Function to pin or unpin a note
  const handlePinNote = () => {
    if (editingIndex !== null) {
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note, idx) =>
          idx === editingIndex ? { ...note, pinned: !note.pinned } : note
        );

        return updatedNotes.sort((a, b) => b.pinned - a.pinned);
      });
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
              <div 
                key={index} 
                className={`note-item ${index === editingIndex ? 'selected' : ''}`} 
                onClick={() => selectNote(note, index)}
              >

                {note.title} {note.pinned && "📌"}
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
            onClick={handleDeleteNote} 
            disabled={editingIndex === null}
          >
            Delete Note
          </button>
        </div>

        {/* Pin Note Button at Bottom-Right */}
        <div className="pin-note-button-container">
          <button 
            className="pin-note-btn" 
            onClick={handlePinNote} 
            disabled={editingIndex === null}
          >
            {editingIndex !== null && notes[editingIndex]?.pinned ? "Unpin Note" : "Pin Note"}
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
