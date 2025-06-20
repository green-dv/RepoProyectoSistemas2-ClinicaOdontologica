'use client';
import React, {useEffect} from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Typography, Box, CircularProgress
} from '@mui/material';
import { Edit, Delete, Restore, DeleteForever } from '@mui/icons-material';
import { Date } from '@/domain/entities/Dates';
import { StatusDropDown } from '@/components/dates/StatusDropDown';
import { updateDateStatus } from '@/application/usecases/dates';
import { Status } from '@/domain/entities/Status';
import { fetchStatus } from '@/application/usecases/status'

interface DatesProps {
  dates: Date[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (date: Date) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
  onUpdate: () => void;
}

export function DatesTable({
  dates,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently,
  onUpdate
}: DatesProps) {
  const [status, setStatus] = React.useState<Status[]>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await fetchStatus();
      setStatus(statuses);
    };

    fetchStatuses();
  }, []);

  const handleStatusChange = async (idcita: number | null, newStatus: number) => {
    if (idcita === null) {
      console.error('idcita is null, cannot update status');
      return;
    }
    try {
      await updateDateStatus(idcita, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } 
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (dates.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled ? 'No hay fechas inhabilitadas' : 'No hay fechas disponibles'}
        </Typography>
      </Box>
    );
  }

  return (
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
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dates.map((date) => (
            <TableRow key={date.idcita}>
              <TableCell>{date.paciente}</TableCell>
              <TableCell>{date.fecha}</TableCell>
              <TableCell>{date.fechacita}</TableCell>
              <TableCell>{date.descripcion}</TableCell>
              <TableCell>{date.estado}</TableCell>
              <TableCell>{date.fechaconsulta || ' - '}</TableCell>
              <TableCell>
                {(() => {
                  const totalMin = date.duracionaprox * 60;
                  const h = Math.floor(totalMin / 60);
                  const m = Math.round(totalMin % 60);
                  return `${h ? `${h} hora${h > 1 ? 's' : ''}` : ''}${h && m ? ' - ' : ''}${m ? `${m} minuto${m > 1 ? 's' : ''}` : ''}`;
                })()}
              </TableCell>
              <TableCell>
                <StatusDropDown
                  idcita={date.idcita}
                  status={status}
                  isDropDownLoading={isLoading}
                  selectedStatus={date.idestado}
                  onChange={handleStatusChange}
                />
              </TableCell>
              <TableCell>
                {!showDisabled ? (
                  <>
                    <IconButton color="primary" onClick={() => onEdit(date)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(date.idcita)}>
                      <Delete />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton color="primary" onClick={() => onRestore(date.idcita)} title="Restaurar Tratamiento">
                      <Restore />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDeletePermanently(date.idcita)} title="Eliminar Permanentemente">
                      <DeleteForever />
                    </IconButton>
                    
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default DatesTable;