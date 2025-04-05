import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { addNote, deleteNote, updateNote, pinNote, getNote } from '../Model/notesModel.js';

export const useNotesViewModel = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // The pinned property is stored as datatype BIT in MySQL. 
  // When taken from the database, it returns a BUFFER. Access it by doing .pinned.data[0] (0 or 1)
  const [notePinned, setNotePinned] = useState();

  const username = jwtDecode(localStorage.getItem('authToken')).username;
  if (!username) {
    console.error("No credentials found. Please log in");
    return;
  }

  useEffect(() => {
    const getAllNote = async () => {
      const result = await getNote(username);
      if (result && result.data) {
        setNotes(result.data.sort((a, b) => b.pinned - a.pinned));
      }
    };

    if (username) {
      getAllNote();
    }
  }, [username, notes]);

  const handleCompleteNote = async () => {
    if (noteTitle === '' || currentNote === '') {
      alert("All fields need to be filled");
      return;
    }

    const result = await addNote(editingIndex, username, noteTitle, currentNote, notePinned);
    if (result) {
      alert('Success!');
    } else {
      alert('Error adding note');
    }

    if (noteTitle.trim() && currentNote.trim()) {
      let updatedNotes;

      if (editingIndex !== null) {
        updatedNotes = updateNote(notes, editingIndex, noteTitle, currentNote);
      } else {
        const newNote = { name: noteTitle, description: currentNote, pinned: false };
        updatedNotes = [...notes, newNote];
      }

      setNotes(updatedNotes.sort((a, b) => b.pinned - a.pinned));
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
      setNotePinned(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNote('');
    setNoteTitle('');
    setEditingIndex(null);
  };

  const handleDeleteNote = async () => {
    const result = await deleteNote(editingIndex);
    if (result) {
      const updatedNotes = notes.filter((_, idx) => idx !== editingIndex);
      setNotes(updatedNotes);
      setCurrentNote('');
      setNoteTitle('');
      setEditingIndex(null);
    } else {
      alert('Error deleting note');
    }
  };


  const handlePinNote = async () => {
    if (editingIndex !== null) {
      const result = await pinNote(editingIndex, notePinned);
      if (result) {
        setNotePinned(!notePinned);
      } else {
        alert('Error pinning note');
      }
    }
  };

  const selectNote = (note, index) => {
    setNoteTitle(note.name);
    setCurrentNote(note.description);
    setEditingIndex(index);
    setNotePinned(note.pinned);
  };

  return {
    notes,
    currentNote,
    noteTitle,
    editingIndex,
    notePinned,
    setNoteTitle,
    setCurrentNote,
    setNotePinned,
    handleCompleteNote,
    handleNewNote,
    handleDeleteNote,
    handlePinNote,
    selectNote,
  };
};
