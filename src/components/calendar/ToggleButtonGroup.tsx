import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter, usePathname } from 'next/navigation';

const ToggleButtonGroupComponent = () => {
  const router = useRouter();
  const pathname = usePathname(); // Ej: /calendar o /dates

  const isCalendar = pathname === '/calendar';

  return (
    <ToggleButtonGroup
      value={isCalendar ? 'calendar' : 'dates'}
      exclusive
      sx={{
        borderRadius: 5,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <ToggleButton
        value="calendar"
        onClick={() => {
          if (!isCalendar) router.push('/calendar');
        }}
        sx={{
          px: 2,
          py: 1,
          border: 'none',
          '&.Mui-selected, &.Mui-selected:hover': {
            bgcolor: 'primary.light',
            color: 'black',
          },
        }}
      >
        <CalendarMonthIcon />
      </ToggleButton>

      <ToggleButton
        value="dates"
        onClick={() => {
          if (isCalendar) router.push('/dates');
        }}
        sx={{
          px: 2,
          py: 1,
          border: 'none',
          '&.Mui-selected, &.Mui-selected:hover': {
            bgcolor: 'primary.light',
            color: 'black',
          },
        }}
      >
        <AccessTimeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtonGroupComponent;
