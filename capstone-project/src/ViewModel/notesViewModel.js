import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { addNote, deleteNote, updateNote, pinNote, getNote } from '../Model/notesModel.js';

export const useNotesViewModel = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const username = jwtDecode(localStorage.getItem('authToken')).username;
  if (!username) {
    console.error("No credentials found. Please log in");
    return;
  }

  useEffect(() => {
    const getAllNote = async () => {
      const result = await getNote(username);
      if (result && result.data) {
        setNotes(result.data);
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

    console.log(editingIndex);
    const result = await addNote(editingIndex, username, noteTitle, currentNote);
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

  const handlePinNote = () => {
    if (editingIndex !== null) {
      const updatedNotes = pinNote(notes, editingIndex);
      setNotes(updatedNotes);
    }
  };

  const selectNote = (note, index) => {
    setNoteTitle(note.name);
    setCurrentNote(note.description);
    setEditingIndex(index);
  };

  return {
    notes,
    currentNote,
    noteTitle,
    editingIndex,
    setNoteTitle,
    setCurrentNote,
    handleCompleteNote,
    handleNewNote,
    handleDeleteNote,
    handlePinNote,
    selectNote,
  };
};
