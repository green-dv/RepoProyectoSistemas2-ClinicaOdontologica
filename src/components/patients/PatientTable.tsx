
import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

import {
  Box,
  Paper,
  List,
  Divider,
  Pagination,
} from '@mui/material';
import { Patient } from '@/domain/entities/Patient';
import { usePatientList } from '@/presentation/hooks/usePatientList';
import { usePatientActionHandlers } from '@/presentation/handlers/usePatientListHandler';
import {
  PatientListHeader,
  PatientListFilters,
  PatientListItem,
  PatientListSkeleton,
  PatientListEmptyState,
  PatientListError,
} from '@/components/patients/PatientList';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  totalPatients: number;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  showDisabled: boolean;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
  onRestorePatient: (patient: Patient) => void;
  onDeletePermanently: (patient: Patient) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRefresh: () => void;
  onCreatePatient: () => void;
  onToggleDisabled: (showDisabled: boolean) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  loading,
  error,
  totalPatients,
  page,
  rowsPerPage,
  searchQuery,
  showDisabled,
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  onRestorePatient,
  onDeletePermanently,
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  onCreatePatient,
  onToggleDisabled,
}) => {

  const {
    totalPages,
    searchPlaceholder,
    emptyMessage,
    listTitle,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleToggleDisabled,
    formatDate,
  } = usePatientList({
    patients,
    totalPatients,
    page,
    rowsPerPage,
    searchQuery,
    showDisabled,
    loading,
    onPageChange,
    onRowsPerPageChange,
    onSearchChange,
    onToggleDisabled,
  });

  const {
    handleViewPatient,
    handleEditPatient,
    handleDeletePatient,
    handleRestorePatient,
    handleDeletePermanently,
    handleRefresh,
    handleCreatePatient,
  } = usePatientActionHandlers({
    onViewPatient,
    onEditPatient,
    onDeletePatient,
    onRestorePatient,
    onDeletePermanently,
    onRefresh,
    onCreatePatient,
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <PatientListHeader
        title={listTitle}
        showDisabled={showDisabled}
        loading={loading}
        onRefresh={handleRefresh}
        onCreatePatient={handleCreatePatient}
      />

      {/* Error Alert */}
      {error && <PatientListError error={error} />}

      {/* Filters */}
      <PatientListFilters
        searchQuery={searchQuery}
        searchPlaceholder={searchPlaceholder}
        rowsPerPage={rowsPerPage}
        showDisabled={showDisabled}
        loading={loading}
        onSearchChange={handleSearchChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onToggleDisabled={handleToggleDisabled}
      />

      {/* Patient List */}
      <Paper sx={{ width: '100%', mb: 2, p: 0 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {loading ? (
            <PatientListSkeleton rowsPerPage={rowsPerPage} />
          ) : patients.length === 0 ? (
            <PatientListEmptyState message={emptyMessage} />
          ) : (
            patients.map((patient, index) => (
              <React.Fragment key={patient.idpaciente}>
                <PatientListItem
                  patient={patient}
                  showDisabled={showDisabled}
                  formatDate={formatDate}
                  onViewPatient={handleViewPatient}
                  onEditPatient={handleEditPatient}
                  onDeletePatient={handleDeletePatient}
                  onRestorePatient={handleRestorePatient}
                  onDeletePermanently={handleDeletePermanently}
                />
                {index < patients.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
          disabled={loading || totalPatients === 0}
        />
      </Box>
    </Box>
  );
};