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
import {Date as DateObj} from "@/domain/entities/Dates";
import React, { useState } from 'react';
import { Popover, Typography, Button, Box } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Edit, Delete, Restore, DeleteForever } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarToolbar from './CalendarToolbar';
import { es } from 'date-fns/locale';

import "@/app/styles/react-big-calendar.css";


const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        es: es,
      },
});


interface IEventoCalendario {
    id: number;
    title: string;
    start: globalThis.Date;
    end: globalThis.Date;
  }

interface CalendarComponentProps extends Omit<CalendarProps, 'localizer'> {
    onSelectSlot?: (slotInfo: any) => void;
    onSelectEvent?: (event: any) => void;
    onContextMenu?: (event: React.MouseEvent, calendarEvent: any) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdate: () => void;
}
export function Calendar(props: CalendarComponentProps) {
    const { onSelectEvent, events, onEdit, onDelete } = props; // Asegúrate de que onSelectEvent, onEdit y onDelete estén siendo pasados como props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [eventInfo, setEventInfo] = useState<IEventoCalendario | null>(null);

    const handleEventClick = (calendarEvent: IEventoCalendario, e: React.SyntheticEvent<HTMLElement>) => {
        setEventInfo(calendarEvent);
        setAnchorEl(e.currentTarget as HTMLElement);
    };

    return (
        <><BigCalendar
            {...props}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            views={['month', 'week', 'day']}
            style={{ height: 800 }}
            selectable
            onSelectSlot={props.onSelectSlot}
            onSelectEvent={(event, e) => handleEventClick(event as IEventoCalendario, e)}
            components={{
                toolbar: CalendarToolbar,
                event: (eventProps) => (
                  <div
                    onClick={(e) => handleEventClick(eventProps.event as IEventoCalendario, e)}
                  >
                    {eventProps.title}
                  </div>
                ),
              }} />
                <Popover
                    open={!!eventInfo}
                    anchorEl={anchorEl}
                    onClose={() => setEventInfo(null)}
                    PaperProps={{
                        sx: {
                          p: 2,
                          ml: 1,
                          borderRadius: 2,
                          boxShadow: 4,
                        }
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    >
                    <Typography variant="h6">{eventInfo?.title}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1, pb: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <TodayIcon />
                            <Typography>
                            {
                                (() => {
                                try {
                                    const adjustedDate = new Date(eventInfo!.start);
                                    return format(adjustedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
                                } catch {
                                    return 'Fecha no disponible';
                                }
                                })()
                            }
                            </Typography>
                        </Box>
        
                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon />
                            <Typography>
                            {
                                eventInfo?.start && eventInfo?.end
                                    ? (() => {
                                        const start = new Date(eventInfo.start);
                                        const end = new Date(eventInfo.end);
                                        return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
                                        })()
                                    : 'Fecha no disponible'
                            }
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                        {
                            eventInfo?.id
                                ? (() => {
                                    return (
                                        <>
                                            <IconButton color="primary" onClick={() => onEdit(eventInfo?.id)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => onDelete(eventInfo?.id)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                    );
                                    })()
                                : 'Fecha no disponible'
                        }
                        </Box>
                    </Box>
                </Popover>
            </>
    );
}