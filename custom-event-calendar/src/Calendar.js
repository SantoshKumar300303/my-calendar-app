import React, { useState } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format
} from 'date-fns';

import EventForm from './EventForm';
import './Calendar.css';
import DroppableCell from './DroppableCell';

function Calendar({ events, setEvents }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(null);

  // Check for event conflicts except self (when editing)
  const hasConflict = (eventToCheck) => {
    return events.some(ev => {
      if (ev.id === eventToCheck.id) {
        return false; // skip self when editing or checking
      }
      return ev.date === eventToCheck.date && ev.time === eventToCheck.time;
    });
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    setFormData({
      title: '',
      date: format(day, 'yyyy-MM-dd'),
      time: '',
      description: '',
      recurrence: 'None',
      color: '#3174ad',
    });
  };

  const handleEventClick = (event) => {
    setSelectedDate(new Date(event.date + 'T00:00:00'));
    setFormData(event);
  };

  const handleEventDrop = (eventId, newDate, originalDate) => {
    const newDateStr = format(newDate, 'yyyy-MM-dd');

    setEvents(prevEvents => {
      return prevEvents.map(event => {
        if (event.id === Number(eventId)) {
          if (event.recurrence === 'None') {
            // Non-recurring event: update date directly
            return { ...event, date: newDateStr };
          }
          // Recurring event: create a new one-time event instance at newDate
          return [
            event,
            {
              ...event,
              id: Date.now(),
              date: newDateStr,
              recurrence: 'None',
              title: `${event.title} (moved instance)`,
            },
          ];
        }
        return event;
      }).flat();
    });
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <button onClick={prevMonth}>Prev</button>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <button onClick={nextMonth}>Next</button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eee";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        days.push(
          <DroppableCell
            key={cloneDay.toString()}
            day={cloneDay}
            monthStart={monthStart}
            events={events}
            onDateClick={onDateClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(startOfMonth(currentMonth), -1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {selectedDate && formData && (
        <EventForm
          formData={formData}
          setFormData={setFormData}
          onClose={() => setSelectedDate(null)}
          onSave={(event) => {
            const eventWithId = {
              ...event,
              date: format(new Date(event.date), 'yyyy-MM-dd'),
              id: event.id ? event.id : Date.now(),
              recurrence: event.recurrence || 'None',
            };

            if (hasConflict(eventWithId)) {
              alert('Cannot save event. Conflict with another event at the same date and time.');
              return;
            }

            const isEdit = events.some(ev => ev.id === eventWithId.id);
            if (isEdit) {
              setEvents(events.map(ev => (ev.id === eventWithId.id ? eventWithId : ev)));
            } else {
              setEvents([...events, eventWithId]);
            }
            setSelectedDate(null);
          }}
          onDelete={() => {
            setEvents(prevEvents => prevEvents.filter(ev => ev.id !== formData.id));
            setSelectedDate(null);
          }}
          isEditing={formData.id !== undefined}
        />
      )}
    </div>
  );
}

export default Calendar;
