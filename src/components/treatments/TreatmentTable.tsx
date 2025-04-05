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
import { Treatment } from '@/domain/entities/Treatments';

interface TreatmentTableProps {
  treatments: Treatment[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (treatment: Treatment) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function TreatmentTable({
  treatments,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: TreatmentTableProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (treatments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled 
            ? 'No hay tratamientos inhabilitados' 
            : 'No hay tratamientos disponibles'}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(treatments) && treatments.length > 0 ? (
            treatments.map((treatment) => (
              <TableRow key={treatment.idtratamiento}>
                <TableCell>{treatment.idtratamiento}</TableCell>
                <TableCell>{treatment.nombre}</TableCell>
                <TableCell>{treatment.descripcion}</TableCell>
                <TableCell>BS. {Number(treatment.precio).toFixed(2)}</TableCell>
                <TableCell>
                  {!showDisabled ? (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(treatment)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDelete(treatment.idtratamiento)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onRestore(treatment.idtratamiento)}
                        title="Restaurar Tratamiento"
                      >
                        <Restore />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDeletePermanently(treatment.idtratamiento)}
                        title="Eliminar Permanentemente"
                      >
                        <DeleteForever />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No hay tratamientos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}