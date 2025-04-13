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
  TablePagination,
  CircularProgress,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Restore as RestoreIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface PatientsTableProps {
  patients: Patient[];
  showDisabled: boolean;
  isLoading: boolean;
  pagination: Pagination;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export default function PatientsTable({
  patients,
  showDisabled,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently,
  onPaginationChange
}: PatientsTableProps) {
  
  //  paginación
  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationChange(newPage, pagination.pageSize);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPaginationChange(0, newPageSize); 
  };

  // calculo apara mostrar los pacientes por pagina 
  const startIndex = pagination.page * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const displayedPatients = patients.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (patients.length === 0) {
    return <p>No se encontraron pacientes.</p>;
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Teléfono Personal</TableCell>
              <TableCell>Sexo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.idpaciente}>
                <TableCell>{patient.nombres}</TableCell>
                <TableCell>{patient.apellidos}</TableCell>
                <TableCell>{patient.telefonopersonal}</TableCell>
                <TableCell>{patient.sexo ? 'Masculino' : 'Femenino'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(patient)} color="primary" aria-label="editar">
                    <EditIcon />
                  </IconButton>
                  
                  {!showDisabled ? (
                    <IconButton onClick={() => onDelete(patient.idpaciente)} color="error" aria-label="eliminar">
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton onClick={() => onRestore(patient.idpaciente)} color="success" aria-label="restaurar">
                        <RestoreIcon />
                      </IconButton>
                      <IconButton onClick={() => onDeletePermanently(patient.idpaciente)} color="error" aria-label="eliminar permanentemente">
                        <DeleteForeverIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={patients.length}
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}