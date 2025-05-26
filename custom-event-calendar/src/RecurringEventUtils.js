import { isSameDay, differenceInWeeks, differenceInMonths, getDay } from 'date-fns';

export function isEventOnDate(event, date) {
  const eventDate = new Date(event.date);
  if (isSameDay(eventDate, date)) return true;
  if (event.recurrence === 'None') return false;
  if (date < eventDate) return false;

  switch (event.recurrence) {
    case 'Daily':
      return date >= eventDate;
    case 'Weekly':
      return (
        getDay(date) === getDay(eventDate) &&
        differenceInWeeks(date, eventDate) >= 0
      );
    case 'Monthly':
      return (
        date.getDate() === eventDate.getDate() &&
        differenceInMonths(date, eventDate) >= 0
      );
    case 'Custom':
      const weeksDiff = differenceInWeeks(date, eventDate);
      return (
        getDay(date) === getDay(eventDate) &&
        weeksDiff >= 0 &&
        weeksDiff % 2 === 0
      );
    default:
      return false;
  }
}
