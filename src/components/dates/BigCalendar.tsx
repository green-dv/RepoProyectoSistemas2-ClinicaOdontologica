'use client';
import {
    Calendar as BigCalendar,
    CalendarProps,
    momentLocalizer,
    Views,
    dateFnsLocalizer,
} from 'react-big-calendar';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale'

const locales = {
    es: es,
  };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  export function Calendar(props: Omit<CalendarProps, "localizer">) {
    return (
        <BigCalendar
            {...props}
            localizer={localizer}
            startAccessor="start" // Usar directamente el campo `start`
            endAccessor="end"     // Usar directamente el campo `end`
            defaultView={Views.MONTH}
            views={['month', 'week', 'day']}
            style={{ height: 800 }}
        />
    );
}