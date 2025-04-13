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
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';

interface MedicalAttentionTableProps {
  medicalAttentions: MedicalAttention[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (medicalAttention: MedicalAttention) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function MedicalAttentionTable({
  medicalAttentions,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: MedicalAttentionTableProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (medicalAttentions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled 
            ? 'No hay descripciones inhabilitadas' 
            : 'No hay descripciones disponibles'}
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
          {Array.isArray(medicalAttentions) && medicalAttentions.length > 0 ? (
            medicalAttentions.map((medicalAttention, index) => (
              <TableRow key={index}>
                <TableCell>{medicalAttention.idatencionmedica}</TableCell>
                <TableCell>{medicalAttention.atencion}</TableCell>
                <TableCell>
                  {!showDisabled ? (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(medicalAttention)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDelete(medicalAttention.idatencionmedica)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onRestore(medicalAttention.idatencionmedica)}
                        title="Restaurar Tratamiento"
                      >
                        <Restore />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDeletePermanently(medicalAttention.idatencionmedica)}
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
                No hay descripciones disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}