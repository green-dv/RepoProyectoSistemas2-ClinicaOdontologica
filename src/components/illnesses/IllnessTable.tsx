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
import { Illness } from '@/domain/entities/Illnesses';

interface IllnessTableProps {
  illnesses: Illness[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (enfermedad: Illness) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function IllnessTable({
  illnesses,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: IllnessTableProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (illnesses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled 
            ? 'No hay enfermedades inhabilitadas' 
            : 'No hay enfermedades disponibles'}
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
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(illnesses) && illnesses.length > 0 ? (
            illnesses.map((enfermedad, index) => (
              <TableRow key={index}>
                <TableCell>{enfermedad.idenfermedad}</TableCell>
                <TableCell>{enfermedad.enfermedad}</TableCell>
                <TableCell>
                  {!showDisabled ? (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(enfermedad)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDelete(enfermedad.idenfermedad)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onRestore(enfermedad.idenfermedad)}
                        title="Restaurar Tratamiento"
                      >
                        <Restore />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDeletePermanently(enfermedad.idenfermedad)}
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
                No hay enfermedades disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}