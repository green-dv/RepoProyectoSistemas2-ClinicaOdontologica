'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PaymentReportsPDF } from './PaymentPatientPDF';

interface PaymentPlanByPatientReport {
  idplanpago: number;
  descripcion: string;
  montotal: number;
  total_pagado: number;
  total_pendiente: number;
  cuotas_incompletas: number;
  porcentaje_pago: number;
}

import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

//para exportar a PDF jspdf Good
import jsPDF from "jspdf";

const exportToPDF = async (elementId: string, fileName: string) => {
    const pdf = new jsPDF({
        orientation: "landscape", 
        unit: "pt",
        format: "a4",
    });

    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Elemento no encontrado.");
        return;
    }

    try {
        await pdf.html(element, {
            callback: function(doc) {
                doc.save(`${fileName}.pdf`);
            },
            x: 10,
            y: 10,
            width: 800, 
            windowWidth: element.scrollWidth,
            autoPaging: 'text'
        });
    } catch (error) {
        console.error("PDF Export Error:", error);
    }
};

const PrintableContainer = styled(Box)(({ theme }) => ({
  '@media print': {
    '& .no-print': {
      display: 'none !important',
    },
    '& .print-break': {
      pageBreakAfter: 'always',
    },
    padding: '20px',
    fontSize: '12px',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '@media print': {
    backgroundColor: '#f5f5f5 !important',
    color: 'black !important',
    border: '1px solid #ddd',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '@media print': {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f9f9f9 !important',
    },
    '& td': {
      border: '1px solid #ddd',
    },
  },
}));

const HiddenPDFContainer = styled(Box)({
  position: 'absolute',
  left: '-9999px',
  top: '-9999px',
  width: '210mm',
  visibility: 'hidden',
});

const PaymentReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [payments, setPayments] = useState<PaymentPlanByPatientReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfExporting, setPdfExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const fetchPatients = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setPatients([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: '1',
        limit: '10',
        search: debouncedSearchQuery,
      });

      const response = await fetch(`/api/patients?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }
      
      const data: PatientResponse = await response.json();
      setPatients(data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPatients([]);
    } finally {
      setSearchLoading(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const fetchPayments = async (patientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports/PaymentsByPatient/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        const processedPayments = data.map((payment: PaymentPlanByPatientReport) => ({
          ...payment,
          montotal: Number(payment.montotal) || 0,
          total_pagado: Number(payment.total_pagado) || 0,
          total_pendiente: Number(payment.total_pendiente) || 0,
          cuotas_incompletas: Number(payment.cuotas_incompletas) || 0,
          porcentaje_pago: Number(payment.porcentaje_pago) || 0,
        }));
        setPayments(processedPayments);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al obtener los pagos');
        setPayments([]);
      }
    } catch (error) {
      setError('Error de conexión al obtener los pagos');
      setPayments([]);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.nombres} ${patient.apellidos} ${patient.idpaciente}`);
    setPatients([]);
    fetchPayments(patient.idpaciente);
  };

  const handlePrint = () => {
    window.print();
  };

  // funcioncita para exportar a PDF
  const handleExportPDF = async () => {
    if (!selectedPatient || payments.length === 0) {
      return;
    }

    setPdfExporting(true);
    try {
      const fileName = `Reporte_Pagos_${selectedPatient.nombres}_${selectedPatient.apellidos}_${selectedPatient.idpaciente}`;
      await exportToPDF('pdf-report-content', fileName);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    } finally {
      setPdfExporting(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedPatient(null);
    setPatients([]);
    setPayments([]);
    setError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  const getPaymentStatus = (payment: PaymentPlanByPatientReport) => {
    const montotal = Number(payment.montotal);
    const totalPagado = Number(payment.total_pagado);
    
    if (totalPagado >= montotal) {
      return {
        label: 'Completado',
        color: 'success' as const,
        severity: 'success' as const
      };
    } else if (totalPagado > 0) {
      return {
        label: 'En Progreso',
        color: 'primary' as const,
        severity: 'info' as const
      };
    } else {
      return {
        label: 'Pendiente',
        color: 'default' as const,
        severity: 'warning' as const
      };
    }
  };

  const getCuotasIncompletasStatus = (cuotasIncompletas: number) => {
    if (cuotasIncompletas > 0) {
      return {
        color: 'warning' as const,
        severity: 'warning' as const
      };
    }
    return {
      color: 'success' as const,
      severity: 'success' as const
    };
  };

  const totals = payments.reduce(
    (acc, payment) => ({
      montotal: acc.montotal + Number(payment.montotal || 0),
      total_pagado: acc.total_pagado + Number(payment.total_pagado || 0),
      total_pendiente: acc.total_pendiente + Number(payment.total_pendiente || 0),
    }),
    { montotal: 0, total_pagado: 0, total_pendiente: 0 }
  );

  const porcentajeGeneral = totals.montotal > 0 ? (totals.total_pagado / totals.montotal) * 100 : 0;

  return (
    <PrintableContainer>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                Reporte de Pagos por Paciente
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Consulta y gestión de planes de pago
              </Typography>
            </Box>
            <Box className="no-print" display="flex" gap={2}>
              {selectedPatient && payments.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                  >
                    Imprimir
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={handleExportPDF}
                    disabled={pdfExporting}
                    color="error"
                  >
                    {pdfExporting ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Exportando...
                      </>
                    ) : (
                      'Exportar PDF'
                    )}
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Buscador */}
          <Box className="no-print" position="relative">
            <TextField
              fullWidth
              placeholder="Buscar paciente por nombre, apellido o id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchLoading && <CircularProgress size={20} />}
                    {searchQuery && (
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Lista de pacientes encontrados */}
            {patients.length > 0 && (
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: 300,
                  overflow: 'auto',
                  mt: 1,
                }}
              >
                {patients.map((patient) => (
                  <Box
                    key={patient.idpaciente}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {patient.nombres} {patient.apellidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {patient.idpaciente} | Sexo: {patient.sexo} | Teléfono: {patient.telefonopersonal}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </Paper>

        {/* Información del paciente seleccionado */}
        {selectedPatient && (
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                Información del Paciente
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Nombre Completo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPatient.nombres} {selectedPatient.apellidos}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  ID Paciente
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPatient.idpaciente}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Sexo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPatient.sexo === true ? 'Masculino' : 'Femenino'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPatient.telefonopersonal}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Reporte
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date().toLocaleDateString('es-ES')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Resumen de totales */}
        {payments.length > 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <MoneyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="primary">
                        Total General
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(totals.montotal)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AssignmentIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="success.main">
                        Total Pagado
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(totals.total_pagado)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AssignmentIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="error.main">
                        Total Pendiente
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {formatCurrency(totals.total_pendiente)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AssignmentIcon color="info" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="info.main">
                        Progreso General
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {porcentajeGeneral.toFixed(1)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={porcentajeGeneral}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color={porcentajeGeneral === 100 ? 'success' : porcentajeGeneral >= 50 ? 'primary' : 'warning'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Tabla de pagos */}
        {payments.length > 0 && (
          <Paper elevation={2}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom color="primary">
                Detalle de Planes de Pago
              </Typography>
            </Box>
            <Divider />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Plan de Pago</StyledTableCell>
                    <StyledTableCell align="center">Monto Total</StyledTableCell>
                    <StyledTableCell align="center">Pagado</StyledTableCell>
                    <StyledTableCell align="center">Pendiente</StyledTableCell>
                    <StyledTableCell align="center">Cuotas Incompletas</StyledTableCell>
                    <StyledTableCell align="center">Progreso</StyledTableCell>
                    <StyledTableCell align="center">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => {
                    const status = getPaymentStatus(payment);
                    const cuotasStatus = getCuotasIncompletasStatus(payment.cuotas_incompletas);
                    const porcentaje = Number(payment.porcentaje_pago) || 0;
                    
                    return (
                      <StyledTableRow key={payment.idplanpago}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {payment.descripcion || 'Sin descripción'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {payment.idplanpago}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(payment.montotal)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            {formatCurrency(payment.total_pagado)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="error.main" fontWeight="medium">
                            {formatCurrency(payment.total_pendiente)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={payment.cuotas_incompletas}
                            size="small"
                            color={cuotasStatus.color}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ minWidth: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(porcentaje, 100)}
                              sx={{ mb: 1, height: 8, borderRadius: 4 }}
                              color={
                                porcentaje >= 100
                                  ? 'success'
                                  : porcentaje >= 50
                                  ? 'primary'
                                  : 'warning'
                              }
                            />
                            <Typography variant="caption" color="text.secondary">
                              {porcentaje.toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Mensaje cuando no hay datos */}
        {selectedPatient && !loading && payments.length === 0 && !error && (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron planes de pago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Este paciente no tiene planes de pago registrados.
            </Typography>
          </Paper>
        )}

        {/* Pie de página para impresión */}
        <Box
          sx={{
            display: 'none',
            '@media print': {
              display: 'block',
              mt: 4,
              pt: 2,
              borderTop: '1px solid #ddd',
              textAlign: 'center',
            },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Reporte generado el {new Date().toLocaleString('es-ES')}
          </Typography>
        </Box>
      </Box>

      {/* Componente del PDF que se va a exportar */}
      {selectedPatient && typeof selectedPatient.idpaciente === 'number' && payments.length > 0 && (
        <HiddenPDFContainer>
          <PaymentReportsPDF
            patient={{ ...selectedPatient, idpaciente: selectedPatient.idpaciente as number }}
            payments={payments}
            totals={totals}
            porcentajeGeneral={porcentajeGeneral}
          />
        </HiddenPDFContainer>
      )}
    </PrintableContainer>
  );
};

export default PaymentReportsPage;