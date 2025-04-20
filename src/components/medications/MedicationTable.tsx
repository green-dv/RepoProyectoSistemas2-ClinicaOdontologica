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
import { Medication } from '@/domain/entities/Medications';

interface MedicationTableProps {
  medications: Medication[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (medication: Medication) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function MedicationTable({
  medications,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: MedicationTableProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (medications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled 
            ? 'No hay medicaciones inhabilitadas' 
            : 'No hay medicaciones disponibles'}
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
          {Array.isArray(medications) && medications.length > 0 ? (
            medications.map((medication, index) => (
              <TableRow key={index}>
                <TableCell>{medication.idmedicacion}</TableCell>
                <TableCell>{medication.medicacion}</TableCell>
                <TableCell>
                  {!showDisabled ? (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(medication)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDelete(medication.idmedicacion)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onRestore(medication.idmedicacion)}
                        title="Restaurar Tratamiento"
                      >
                        <Restore />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDeletePermanently(medication.idmedicacion)}
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
                No hay medicación disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}