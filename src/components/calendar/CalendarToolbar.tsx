import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  MenuItem,
  Select } from '@mui/material';
import { ToolbarProps, View } from 'react-big-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ToggleButtonGroupComponent from '@/components/calendar/ToggleButtonGroup';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type {IEventoCalendario} from './BigCalendar';

const CalendarToolBar = ({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<IEventoCalendario, object>) => {
  return(
    <Box 
      display="flex" 
      justifyContent={'space-between'} 
      alignItems="center" 
      mb={2} 
      px={2}>
        <Box display="flex" gap={1}>
          <Button variant="outlined" sx={{ borderRadius: '16px' }} onClick={()=> onNavigate('TODAY')}>Hoy</Button>
          <IconButton onClick={()=> onNavigate('PREV')}> <ChevronLeftIcon/> </IconButton>
          <IconButton onClick={()=> onNavigate('NEXT')}> <ChevronRightIcon/> </IconButton>
        </Box>
        <Typography variant="h6">
          {
            (() => {
              const parsedDate = new Date(label);
              if (!isNaN(parsedDate.getTime())) {
                return format(parsedDate, "MMMM yyyy", { locale: es }).replace(/^\w/, (c) => c.toUpperCase());
              }
              return label; // Mostrar el label tal cual si no es una fecha válida
            })()
          }
        </Typography>
      <Select
        value={view}
        onChange={(e) => onView(e.target.value as View)}
        size="small"
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="month">Mes</MenuItem>
        <MenuItem value="week">Semana</MenuItem>
        <MenuItem value="day">Día</MenuItem>
      </Select>
      <ToggleButtonGroupComponent/>
    </Box>
  );
}

export default CalendarToolBar;