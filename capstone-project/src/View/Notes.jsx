import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import logout from 'capstone-project/src/Assets/logout.svg';
import { useNotesViewModel } from '../ViewModel/notesViewModel';

// Register fonts, sizes, colors
import Quill from 'quill';
const Font = Quill.import('formats/font');
Font.whitelist = ['sans', 'serif', 'monospace'];
Quill.register(Font, true);

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

  const toolbarOptions = [
    [{ 'font': Font.whitelist }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ];

  return (
    <div className="body">
      <div className="container">
        <div className="notes-sidebar">
          <h3>Previous Notes</h3>
          <hr className="notes-divider" />

          {/* Main editor */}
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
            {editingIndex !== null && notePinned ? "Unpin Note" : "Pin Note"}
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
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              className="rich-editor"
              placeholder="Start typing your note here..."
              onChange={(value) => setCurrentNote(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
