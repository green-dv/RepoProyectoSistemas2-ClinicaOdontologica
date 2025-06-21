import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface PaymentPlanByPatientReport {
  idplanpago: number;
  descripcion: string;
  montotal: number;
  total_pagado: number;
  total_pendiente: number;
  cuotas_incompletas: number;
  porcentaje_pago: number;
}

interface Patient {
  idpaciente: number;
  nombres: string;
  apellidos: string;
  sexo: boolean;
  telefonopersonal: string;
}

interface PaymentReportsPDFProps {
  patient: Patient;
  payments: PaymentPlanByPatientReport[];
  totals: {
    montotal: number;
    total_pagado: number;
    total_pendiente: number;
  };
  porcentajeGeneral: number;
}

const PDFContainer = styled(Box)({
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#000',
  backgroundColor: '#fff',
});

const PDFTableCell = styled(TableCell)({
  padding: '8px 6px',
  fontSize: '11px',
  border: '1px solid #ddd',
  '&.header': {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const PDFTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const SummaryBox = styled(Box)({
  border: '1px solid #ddd',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  backgroundColor: '#f8f9fa',
});

export const PaymentReportsPDF: React.FC<PaymentReportsPDFProps> = ({
  patient,
  payments,
  totals,
  porcentajeGeneral,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  const getPaymentStatusText = (payment: PaymentPlanByPatientReport) => {
    const montotal = Number(payment.montotal);
    const totalPagado = Number(payment.total_pagado);
    
    if (totalPagado >= montotal) {
      return 'Completado';
    } else if (totalPagado > 0) {
      return 'En Progreso';
    } else {
      return 'Pendiente';
    }
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentDateTime = new Date().toLocaleString('es-ES');

  return (
    <PDFContainer id="pdf-report-content">
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '18px', fontWeight: 'bold' }}>
          REPORTE DE PAGOS POR PACIENTE
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: '12px', color: '#666' }}>
          Fecha de generación: {currentDate}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Información del Paciente */}
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', mb: 2, color: '#333' }}>
          INFORMACIÓN DEL PACIENTE
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box mb={1}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666' }}>
                Nombre Completo:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {patient.nombres} {patient.apellidos}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666' }}>
                ID Paciente:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {patient.idpaciente}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box mb={1}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666' }}>
                Sexo:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {patient.sexo === true ? 'Masculino' : 'Femenino'}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666' }}>
                Teléfono:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {patient.telefonopersonal}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Resumen Financiero */}
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', mb: 2, color: '#333' }}>
          RESUMEN FINANCIERO
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <SummaryBox>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666', mb: 1 }}>
                Total General
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#1976d2' }}>
                {formatCurrency(totals.montotal)}
              </Typography>
            </SummaryBox>
          </Grid>
          <Grid item xs={3}>
            <SummaryBox>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666', mb: 1 }}>
                Total Pagado
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#2e7d32' }}>
                {formatCurrency(totals.total_pagado)}
              </Typography>
            </SummaryBox>
          </Grid>
          <Grid item xs={3}>
            <SummaryBox>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666', mb: 1 }}>
                Total Pendiente
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
                {formatCurrency(totals.total_pendiente)}
              </Typography>
            </SummaryBox>
          </Grid>
          <Grid item xs={3}>
            <SummaryBox>
              <Typography variant="body2" sx={{ fontSize: '10px', color: '#666', mb: 1 }}>
                Progreso General
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#ed6c02' }}>
                {porcentajeGeneral.toFixed(1)}%
              </Typography>
            </SummaryBox>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Detalle de Planes de Pago */}
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', mb: 2, color: '#333' }}>
          DETALLE DE PLANES DE PAGO
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650, border: '1px solid #ddd' }}>
            <TableHead>
              <TableRow>
                <PDFTableCell className="header">ID</PDFTableCell>
                <PDFTableCell className="header">Descripción del Plan</PDFTableCell>
                <PDFTableCell className="header">Monto Total</PDFTableCell>
                <PDFTableCell className="header">Total Pagado</PDFTableCell>
                <PDFTableCell className="header">Total Pendiente</PDFTableCell>
                <PDFTableCell className="header">Cuotas Incompletas</PDFTableCell>
                <PDFTableCell className="header">Progreso (%)</PDFTableCell>
                <PDFTableCell className="header">Estado</PDFTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => {
                const porcentaje = Number(payment.porcentaje_pago) || 0;
                const status = getPaymentStatusText(payment);
                
                return (
                  <PDFTableRow key={payment.idplanpago}>
                    <PDFTableCell sx={{ textAlign: 'center', fontSize: '10px' }}>
                      {payment.idplanpago}
                    </PDFTableCell>
                    <PDFTableCell sx={{ fontSize: '10px', maxWidth: '150px' }}>
                      {payment.descripcion || 'Sin descripción'}
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'right', fontSize: '10px', fontWeight: 'bold' }}>
                      {formatCurrency(payment.montotal)}
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'right', fontSize: '10px', color: '#2e7d32', fontWeight: 'bold' }}>
                      {formatCurrency(payment.total_pagado)}
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'right', fontSize: '10px', color: '#d32f2f', fontWeight: 'bold' }}>
                      {formatCurrency(payment.total_pendiente)}
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'center', fontSize: '10px' }}>
                      {payment.cuotas_incompletas}
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                      {porcentaje.toFixed(1)}%
                    </PDFTableCell>
                    <PDFTableCell sx={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                      {status}
                    </PDFTableCell>
                  </PDFTableRow>
                );
              })}
              {/* Fila de totales */}
              <PDFTableRow>
                <PDFTableCell 
                  colSpan={2} 
                  sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd', fontSize: '11px', textAlign: 'center' }}
                >
                  TOTALES
                </PDFTableCell>
                <PDFTableCell 
                  sx={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#e3f2fd', fontSize: '11px' }}
                >
                  {formatCurrency(totals.montotal)}
                </PDFTableCell>
                <PDFTableCell 
                  sx={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#e8f5e8', fontSize: '11px', color: '#2e7d32' }}
                >
                  {formatCurrency(totals.total_pagado)}
                </PDFTableCell>
                <PDFTableCell 
                  sx={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#ffebee', fontSize: '11px', color: '#d32f2f' }}
                >
                  {formatCurrency(totals.total_pendiente)}
                </PDFTableCell>
                <PDFTableCell 
                  colSpan={2}
                  sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fff3e0', fontSize: '11px' }}
                >
                  Progreso General: {porcentajeGeneral.toFixed(1)}%
                </PDFTableCell>
                <PDFTableCell sx={{ backgroundColor: '#f5f5f5' }}></PDFTableCell>
              </PDFTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Notas adicionales
      {payments.length > 0 && (
        <Box mt={3} p={2} sx={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}>
          <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold', mb: 1 }}>
            NOTAS:
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', mb: 1 }}>
            • Los montos están expresados en Bolivianos (BOB)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', mb: 1 }}>
            • El progreso se calcula como: (Total Pagado / Monto Total) × 100
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', mb: 1 }}>
            • Estados: Completado (100% pagado), En Progreso (parcialmente pagado), Pendiente (sin pagos)
          </Typography>
        </Box>
      )} */}

      {/* Footer */}
      <Box mt={4} pt={2} sx={{ borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: '10px', color: '#666' }}>
          Reporte generado automáticamente el {currentDateTime}
        </Typography>
      </Box>
    </PDFContainer>
  );
};