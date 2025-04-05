import axios from 'axios';

export const getNote = async (username) => {
  try {
    const response = await axios.get('http://localhost:5000/get_note', {
      params: {username}
    });

    const returnData = response.data;
    return returnData;

  } catch (error) {
    console.error('Error retrieving notes:', error);
    return false;
  }
};

export const addNote = async (editingIndex, username, noteTitle, noteContent, notePinned) => {
  try {
    const response = await axios.post('http://localhost:5000/add_note', {
      noteId: editingIndex,
      username: username,
      noteTitle: noteTitle,
      noteContent: noteContent,
      notePinned: notePinned
    });
    if (response.data === "Note added successfully" || response.data === "Note modified successfully") {
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

export const pinNote = async (editingIndex, notePinned) => {
  try {
    const response = await axios.post('http://localhost:5000/pin_note', {
      noteId: editingIndex,
      notePinned: (notePinned > 0)? 0 : 1
    });

    if (response.data === "Note pinned successfully") {
      return true;
    }
  } catch (error) {
    console.error('Error pinning note:', error);
    return false;
  }
};
