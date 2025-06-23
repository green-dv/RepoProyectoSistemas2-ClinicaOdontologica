'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import useConsultationPaymentPlanHandlers from '@/presentation/handlers/useConsultationPaymentPlanHandler';

interface ReadonlyPaymentsPlanDialogProps {
  idConsulta: number;
}

export default function ReadonlyPaymentsPlanDialog({ idConsulta }: ReadonlyPaymentsPlanDialogProps) {
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const { handleFetchByConsultationId } = useConsultationPaymentPlanHandlers();

  useEffect(() => {
    const fetchPaymentPlan = async () => {
      try {
        const plan = await handleFetchByConsultationId(idConsulta);
        setPaymentPlan(plan);
        console.log(plan);
      } catch (error) {
        console.error('Error al obtener el plan de pagos:', error);
      }
    };

    fetchPaymentPlan();
  }, [idConsulta]);

  if (!paymentPlan) {
    return (
      <Box p={2}>
        <Typography variant="body1" color="text.secondary">
          No hay ningún plan de pagos asociado con esta consulta.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      {/* DETALLES DEL PLAN */}
      <Box flex={1}>
        <Typography variant="h6">Detalles del Plan de Pago</Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Fecha Creación:</strong>{' '}
          {paymentPlan.fechacreacion ? new Date(paymentPlan.fechacreacion).toLocaleDateString() : 'No definida'}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Fecha Límite:</strong>{' '}
          {paymentPlan.fechalimite ? new Date(paymentPlan.fechalimite).toLocaleDateString() : 'No definida'}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Monto Total:</strong> {paymentPlan.montotal ?? 0} Bs.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Descripción:</strong> {paymentPlan.descripcion || 'No especificada'}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Estado:</strong> {paymentPlan.estado || 'No definido'}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Paciente:</strong> {paymentPlan.paciente || 'No asignado'}
        </Typography>
      </Box>

      {/* TABLA DE PAGOS */}
      <Box flex={1}>
        <Typography variant="h6" gutterBottom>
          Pagos Generados
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Monto Esperado</TableCell>
                <TableCell>Monto Pagado</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentPlan.pagos && paymentPlan.pagos.length > 0 ? (
                paymentPlan.pagos.map((pago, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {pago.fechapago ? new Date(pago.fechapago).toLocaleDateString() : ' - '}
                    </TableCell>
                    <TableCell>{pago.montoesperado} Bs.</TableCell>
                    <TableCell>{pago.montopagado ?? 0} Bs.</TableCell>
                    <TableCell>{pago.estado}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay pagos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
