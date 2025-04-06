'use client';
import {
    Calendar as BigCalendar,
    CalendarProps,
    momentLocalizer,
    Views,
} from 'react-big-calendar';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export function Calendar(props: Omit<CalendarProps, "localizer">) {
    return (
        <BigCalendar
            {...props}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            views={['month', 'week', 'day']}
            style={{ height: 600 }}
        />
    );
}