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
import { Habit } from '@/domain/entities/Habits';

interface HabitTableProps {
  habits: Habit[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (habit: Habit) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function HabitTable({
  habits,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently
}: HabitTableProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (habits.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled 
            ? 'No hay hábitos inhabilitadas' 
            : 'No hay hábitos disponibles'}
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
          {Array.isArray(habits) && habits.length > 0 ? (
            habits.map((habit, index) => (
              <TableRow key={index}>
                <TableCell>{habit.idhabito}</TableCell>
                <TableCell>{habit.habito}</TableCell>
                <TableCell>
                  {!showDisabled ? (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(habit)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDelete(habit.idhabito)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        color="primary" 
                        onClick={() => onRestore(habit.idhabito)}
                        title="Restaurar Tratamiento"
                      >
                        <Restore />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => onDeletePermanently(habit.idhabito)}
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
                No hay hábitos disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}