import React from 'react';
import { format, isSameDay } from 'date-fns';
import { isEventOnDate } from './RecurringEventUtils';

export default function DroppableCell({
  day,
  monthStart,
  events,
  onDateClick,
  onEventClick,
  onEventDrop,   // new prop for handling drop
}) {
  const isCurrentMonth = day.getMonth() === monthStart.getMonth();

  // Filter events on this day
  const dayEvents = events.filter(event => {
    return isEventOnDate(event, day);
  });

  // Allow drop by preventing default
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop - update event date
  const handleDrop = (e) => {
    e.preventDefault();

    const eventId = e.dataTransfer.getData('text/plain');          // event ID
    const originalDateStr = e.dataTransfer.getData('event-date');  // original date string in 'yyyy-MM-dd'

    if (eventId && originalDateStr) {
      const originalDate = new Date(originalDateStr);
      onEventDrop(eventId, day, originalDate);
    }
  };

  return (
    <div
      className={`col cell ${isCurrentMonth ? '' : 'disabled'}`}
      onClick={() => onDateClick(day)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: 'relative', minHeight: 80, border: '1px solid #ddd', padding: 4 }}
    >
      <div className="number">{format(day, 'd')}</div>

      {dayEvents.map(event => (
        <div
          key={`${event.id}-${format(day, 'yyyy-MM-dd')}`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', event.id);
            e.dataTransfer.setData('event-date', format(day, 'yyyy-MM-dd'));
          }}
          style={{
            backgroundColor: event.color,
            color: '#fff',
            padding: '2px 4px',
            marginTop: 2,
            borderRadius: 4,
            cursor: 'grab',
            fontSize: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          title={event.title}
        >
          <span style={{ flex: 1, userSelect: 'none' }}>
            {event.title} @ {event.time}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginLeft: 6,
              fontWeight: 'bold',
              userSelect: 'none',
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Edit event"
          >
            ✎
          </button>
        </div>
      ))}
    </div>
  );
}
