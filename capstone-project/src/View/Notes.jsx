import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import logout from 'capstone-project/src/Assets/logout.svg';

// Register fonts, sizes, colors
import Quill from 'quill';
const Font = Quill.import('formats/font');
Font.whitelist = ['sans', 'serif', 'monospace'];
Quill.register(Font, true);

export function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCompleteNote = () => {
    if (noteTitle.trim() && currentNote.trim()) {
      let updatedNotes;

      if (editingIndex !== null) {
        updatedNotes = notes.map((note, idx) =>
          idx === editingIndex
            ? { ...note, title: noteTitle, content: currentNote }
            : note
        );
      } else {
        const newNote = { title: noteTitle, content: currentNote, pinned: false };
        updatedNotes = [...notes, newNote];
      }

      setNotes(updatedNotes.sort((a, b) => b.pinned - a.pinned));
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

  const handleDeleteNote = () => {
    if (editingIndex !== null) {
      setNotes(notes.filter((_, idx) => idx !== editingIndex));
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
    }
  };

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

  const selectNote = (note, index) => {
    setNoteTitle(note.title);
    setCurrentNote(note.content);
    setEditingIndex(index);
  };

  const toolbarOptions = [
    [{ 'font': Font.whitelist }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ];

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

        {/* Buttons */}
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
            {editingIndex !== null && notes[editingIndex]?.pinned ? "Unpin Note" : "Pin Note"}
          </button>
        </div>

        {/* Note Input Area */}
        <div className="content">
          <div className="notes-container">
            <input
              type="text"
              className="note-title"
              placeholder="Enter This Note's Title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />

            {/* Rich Text Editor */}
            <ReactQuill
              value={currentNote}
              onChange={setCurrentNote}
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              className="rich-editor"
              placeholder="Start typing your note here..."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Notes;
