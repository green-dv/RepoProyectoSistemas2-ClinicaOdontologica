'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Autocomplete,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PictureAsPdf as PdfIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useDebtReports } from '@/presentation/hooks/useReportDebts';
import { DebtReportsHandlers } from '@/presentation/handlers/useDebtsReportHandler';
import { Patient } from '@/domain/entities/Patient';

const DebtReportsComponent: React.FC = () => {
    const {
        debts,
        loading,
        error,
        searchQuery,
        patients,
        searchLoading,
        selectedPatient,
        setSearchQuery,
        setSelectedPatient,
        fetchDebtReport,
        clearPatientSearch,
    } = useDebtReports();

    const initialLoadRef = useRef(false);

    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            fetchDebtReport(null);
        }
    }, []); 

    const totals = DebtReportsHandlers.calculateTotals(debts);

    const handlePatientSelect = (patient: Patient | null) => {
        if (patient) {
            DebtReportsHandlers.handlePatientSelect(
                patient,
                setSelectedPatient,
                setSearchQuery,
                fetchDebtReport
            );
        }
    };

    const handleClearPatient = () => {
        DebtReportsHandlers.handleClearPatient(clearPatientSearch, fetchDebtReport);
    };

    const handleExportPDF = () => {
        try {
            DebtReportsHandlers.handleExportToPDF(debts, selectedPatient);
        } catch (error) {
            console.error('Error al exportar PDF:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <ReportIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Reporte de Deudas de Pacientes
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Consulta y exporta los reportes de deudas por paciente
                </Typography>
            </Box>

            {/* Filtros */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Filtros de Búsqueda
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={patients}
                                getOptionLabel={(option) => `${option.nombres} ${option.apellidos}`}
                                loading={searchLoading}
                                value={selectedPatient}
                                onChange={(_, newValue) => handlePatientSelect(newValue)}
                                inputValue={searchQuery}
                                onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Buscar Paciente"
                                        placeholder="Escriba el nombre del paciente"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                            endAdornment: (
                                                <>
                                                    {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => {
                                    // Extraer key de props para evitar el error
                                    const { key, ...otherProps } = props;
                                    return (
                                        <Box component="li" key={key} {...otherProps}>
                                            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2">
                                                    {option.nombres} {option.apellidos}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {option.idpaciente}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                }}
                                noOptionsText="No se encontraron pacientes"
                                loadingText="Buscando..."
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<ReportIcon />}
                                    onClick={() => DebtReportsHandlers.handleGenerateReport(fetchDebtReport)}
                                    disabled={loading}
                                >
                                    Generar Reporte General
                                </Button>
                                {selectedPatient && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={handleClearPatient}
                                        disabled={loading}
                                    >
                                        Limpiar Filtro
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Resumen de Totales */}
            {debts.length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Resumen de Totales
                            {selectedPatient && (
                                <Chip
                                    label={`${selectedPatient.nombres} ${selectedPatient.apellidos}`}
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4" color="primary">
                                        {totals.cantidadPacientes}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pacientes con Deuda
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4" color="success.main">
                                        {DebtReportsHandlers.formatCurrency(totals.totalPagado)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Pagado
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4" color="error.main">
                                        {DebtReportsHandlers.formatCurrency(totals.totalDeuda)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Deuda
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Tabla de Resultados */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Resultados del Reporte
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<PdfIcon />}
                            onClick={handleExportPDF}
                            disabled={loading || debts.length === 0}
                            color="error"
                        >
                            Exportar PDF
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : debts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <MoneyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron deudas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedPatient 
                                    ? 'El paciente seleccionado no tiene deudas pendientes'
                                    : 'No hay pacientes con deudas pendientes en este momento'
                                }
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Paciente</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombres</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellidos</TableCell>
                                        
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total Pagado</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Deuda</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {debts.map((debt) => (
                                        <TableRow key={debt.idpaciente} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                            <TableCell>{debt.idpaciente}</TableCell>
                                            <TableCell>{debt.nombres}</TableCell>
                                            <TableCell>{debt.apellidos}</TableCell>
                                            <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                                                {DebtReportsHandlers.formatCurrency(Number(debt.total_pagado))}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                {DebtReportsHandlers.formatCurrency(Number(debt.deuda))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DebtReportsComponent;