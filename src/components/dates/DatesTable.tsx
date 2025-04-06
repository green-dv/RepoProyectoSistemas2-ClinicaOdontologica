'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Restore, DeleteForever } from '@mui/icons-material';
import { Date, DateDTO } from '@/domain/entities/Dates';



interface DatesProps {
  dates: Date[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (date: Date) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export function DatesTable({
  dates,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: DatesProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  if(dates.length === 0){
    return(
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled ? 'No hay fechas inhabilitadas' : 'No hay fechas disponibles'}
        </Typography>
      </Box>
    );
  }
  else if(dates.length > 0){
    return(
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Paciente</TableCell>
            <TableCell>Fecha Registrada</TableCell>
            <TableCell>Fecha Asignada</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Consulta</TableCell>
            <TableCell>Duración Aproximada</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(dates) && dates.length > 0 ? 
            (dates.map((date, index) => (
              <TableRow key={index}>
                <TableCell>{date.paciente}</TableCell>
                <TableCell>{date.fecha}</TableCell>
                <TableCell>{date.fechacita}</TableCell>
                <TableCell>{date.descripcion}</TableCell>
                <TableCell>{date.estadocita}</TableCell>
                <TableCell>{!date.fechaconsulta ? ' - ': date.fechaconsulta}</TableCell>
                <TableCell>
                  {(()=> {
                    let tiempo = "";
                    const totalMinutos = date.duracionaprox * 60;
                    const horas = Math.floor(totalMinutos / 60);
                    const minutos = Math.round(totalMinutos % 60);
                    if(horas == 1) tiempo += `${horas} hora`;
                    else if(horas > 1) tiempo += `${horas} horas`; 
                    if(horas > 0 && minutos > 0) tiempo += ' - ';
                    if(minutos == 1) tiempo += `${minutos} minuto`;
                    else if(minutos > 1) tiempo += `${minutos} minutos`;
                    return tiempo
                  })()}
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay tratamientos disponibles
                </TableCell>
              </TableRow>
              )
          }
        </TableBody>
      </Table>
    </TableContainer>
        )
  }
}
export default DatesTable;