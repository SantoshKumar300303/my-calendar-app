import React from 'react';

export default function EventForm({ formData, setFormData, onSave, onClose, onDelete, isEditing }) {
  // Date string format for input
  const formattedDate = formData.date || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: 320,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h3>{isEditing ? 'Edit Event' : 'Add Event'} on {formattedDate}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>Title*:</label><br />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Date:</label><br />
            <input
              type="date"
              value={formattedDate}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
              }}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Time:</label><br />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Description:</label><br />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Recurrence:</label><br />
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Event Color:</label><br />
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={{ flex: 1, marginRight: 5 }}>Save</button>
            <button type="button" onClick={onClose} style={{ flex: 1, marginRight: 5 }}>Cancel</button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete();
                  }
                }}
                style={{ flex: 1, backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
