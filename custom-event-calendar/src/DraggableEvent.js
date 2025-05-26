import React from 'react';
import { useDrag } from 'react-dnd';

function DraggableEvent({ event }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'event',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className="event"
      style={{
        backgroundColor: event.color,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {event.title}
    </div>
  );
}

export default DraggableEvent;
