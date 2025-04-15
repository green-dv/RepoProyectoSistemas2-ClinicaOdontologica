'use client';
import * as React from 'react';
import {
  Box, CircularProgress, Typography,
  FormControl, InputLabel, MenuItem, Select, SelectChangeEvent
} from '@mui/material';
import { Status } from '@/domain/entities/Status';

interface StatusDropDownProps {
  idcita?: number;
  isDropDownLoading: boolean;
  status: Status[];
  onChange: (idcita: number | null, newStatus: number) => void;
  selectedStatus: number;
  isFilter?: boolean;
}

export function StatusDropDown({
  idcita,
  isDropDownLoading,
  status,
  onChange,
  selectedStatus,
  isFilter = false
}: StatusDropDownProps) {

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newStatus = Number(event.target.value);
    const citaId = isFilter ? null : idcita ?? null;
    onChange(citaId, newStatus);
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
    <FormControl fullWidth>
      <InputLabel id={`status-label-${idcita ?? 'filter'}`}>Estado</InputLabel>
      <Select<number> // 👈 aquí le indicas que manejarás números
        labelId={`status-label-${idcita ?? 'filter'}`}
        value={selectedStatus}
        onChange={handleChange}
        label="Estado"
      >
        {isFilter && <MenuItem value={0}>Todos</MenuItem>}
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
