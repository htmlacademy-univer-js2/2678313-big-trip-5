import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import { HOUR_IN_MINUTES, DAY_IN_MINUTES } from '../const.js';

const formatDateForInput = (date) => dayjs(date).format('DD/MM/YY HH:mm');
const formatDateForPoint = (date) => dayjs(date).toISOString();
const hasValidDateRange = (dateFrom, dateTo) => dayjs(dateTo).isAfter(dayjs(dateFrom));

const destroyDatepickers = (dateFromPicker, dateToPicker) => {
  dateFromPicker?.destroy();
  dateToPicker?.destroy();
};

const createDatepickers = (dateFromInput, dateToInput, dateFrom, dateTo, onDateFromChange, onDateToChange) => {
  const startDate = dayjs(dateFrom).toDate();
  const endDate = dayjs(dateTo).toDate();

  const dateFromPicker = flatpickr(dateFromInput, {
    dateFormat: 'd/m/y H:i',
    enableTime: true,
    'time_24hr': true,
    defaultDate: startDate,
    onChange: onDateFromChange
  });

  const dateToPicker = flatpickr(dateToInput, {
    dateFormat: 'd/m/y H:i',
    enableTime: true,
    'time_24hr': true,
    defaultDate: endDate,
    minDate: startDate,
    onChange: onDateToChange
  });

  return { dateFromPicker, dateToPicker };
};

const initDatepickers = (view, dateFromPicker, dateToPicker, dateFrom, dateTo, onDateFromChange, onDateToChange) => {
  destroyDatepickers(dateFromPicker, dateToPicker);

  const dateFromInput = view.element.querySelector('[name="event-start-time"]');
  const dateToInput = view.element.querySelector('[name="event-end-time"]');

  return createDatepickers(dateFromInput, dateToInput, dateFrom, dateTo, onDateFromChange, onDateToChange);
};

const clearDatepickers = (dateFromPicker, dateToPicker) => {
  destroyDatepickers(dateFromPicker, dateToPicker);

  return { dateFromPicker: null, dateToPicker: null };
};

const normalizeDateRange = (dateFrom, dateTo) => ({
  dateFrom,
  dateTo: dayjs(dateTo).isBefore(dateFrom) ? dateFrom : dateTo
});

const formatDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (diff < HOUR_IN_MINUTES) {
    return `${diff}M`;
  }

  if (diff < DAY_IN_MINUTES) {
    const hours = Math.floor(diff / HOUR_IN_MINUTES);
    const minutes = diff % HOUR_IN_MINUTES;

    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  const days = Math.floor(diff / DAY_IN_MINUTES);
  const restHours = Math.floor((diff % DAY_IN_MINUTES) / HOUR_IN_MINUTES);
  const restMinutes = diff % HOUR_IN_MINUTES;

  return `${String(days).padStart(2, '0')}D ${String(restHours).padStart(2, '0')}H ${String(restMinutes).padStart(2, '0')}M`;
};

export { formatDateForInput, formatDateForPoint, hasValidDateRange, destroyDatepickers, createDatepickers, initDatepickers, clearDatepickers, normalizeDateRange, formatDuration };
