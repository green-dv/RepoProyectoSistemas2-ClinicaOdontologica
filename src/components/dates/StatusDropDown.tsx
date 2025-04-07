'use client';
import * as React from 'react';
import { Box, CircularProgress, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Status } from '@/domain/entities/Status';

interface StatusDropDownProps {
  idcita: number;
  idstatus: number;
  isDropDownLoading: boolean;
  status: Status[];
  onChange: (idcita: number, newStatus: number) => void;
  selectedStatus: number;
}

export function StatusDropDown({
  idcita,
  isDropDownLoading,
  status,
  onChange,
  selectedStatus
}: StatusDropDownProps) {

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newStatus = Number(event.target.value);
    onChange(idcita, newStatus);
  };

  if (isDropDownLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (status.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          No hay estados disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth disabled={false}>
      <InputLabel id={`status-label-${idcita}`}>Estado</InputLabel>
      <Select
        labelId={`status-label-${idcita}`}
        value={selectedStatus}
        onChange={handleChange}
        label="Estado"
      >
        {status.map((estado) => (
          <MenuItem key={estado.idestado} value={estado.idestado}>
            {estado.descestado}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default StatusDropDown;
