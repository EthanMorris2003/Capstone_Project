import axios from 'axios';

export const getNote = async (username) => {
  try {
    const response = await axios.get('http://localhost:5000/get_note', {
      params: {username}
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving notes:', error);
    return false;
  }
};

export const addNote = async (username, noteTitle, noteContent) => {
  try {
    const response = await axios.post('http://localhost:5000/add_note', {
      username,
      noteTitle,
      noteContent,
    });
    if (response.data === "Note added successfully") {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding note:', error);
    return false;
  }
};

export const deleteNote = async (editingIndex) => {
  try {
    const response = await axios.post('http://localhost:5000/delete_note', {
      noteId: editingIndex
    });
    if (response.data === "Note deleted successfully") {
      alert(response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding note:', error);
    return false;
  }
};

export const updateNote = (notes, editingIndex, newTitle, newContent) => {
  return notes.map((note, idx) =>
    idx === editingIndex ? { ...note, title: newTitle, content: newContent } : note
  );
};

export const pinNote = (notes, editingIndex) => {
  return notes.map((note, idx) =>
    idx === editingIndex ? { ...note, pinned: !note.pinned } : note
  ).sort((a, b) => b.pinned - a.pinned);
};
