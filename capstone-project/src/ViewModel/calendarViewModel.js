import { useState } from 'react';

export const calendarViewModel = () => {
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);

  // Open modal near click position
  const handleSelectSlot = ({ start, end, action, box }) => {
    if (action === 'select') {
      setModalData({
        start,
        end,
        title: '',
        assignedStaff: '',
        x: box?.clientX || 300, // Default X position
        y: box?.clientY || 200, // Default Y position
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setModalData((prev) => ({ ...prev, title: e.target.value }));
  };

  // Handle staff selection
  const handleStaffSelect = (e) => {
    setModalData((prev) => ({ ...prev, assignedStaff: e.target.value }));
  };

  // Handle adding event after selecting color
  const handleColorSelect = (color) => {
    if (!modalData?.title.trim()) {
      alert('Please enter an event title!');
      return;
    }
    if (!modalData.assignedStaff) {
      alert('Please assign a staff member!');
      return;
    }

    setEvents([...events, { ...modalData, color }]);
    setModalData(null); // Close modal
  };

  return {
    events,
    modalData,
    handleSelectSlot,
    handleInputChange,
    handleStaffSelect,
    handleColorSelect
  }
};