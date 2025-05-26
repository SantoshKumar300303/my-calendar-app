import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Calendar from './Calendar';
import './App.css';

const LOCAL_STORAGE_KEY = 'myCalendarEvents';

function App() {
  // ✅ Load from localStorage ONCE when app loads
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing events from localStorage', e);
      return [];
    }
  });

  // ✅ Save to localStorage WHENEVER events change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>My Event Calendar</h1>
        <Calendar events={events} setEvents={setEvents} />
      </div>
    </DndProvider>
  );
}

export default App;
