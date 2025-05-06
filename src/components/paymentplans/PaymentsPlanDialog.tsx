'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextFieldProps,
  Select,
  MenuItem,
} from '@mui/material';
import { Check, Edit,UploadFile, Receipt } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import ComprobanteDialog from '../comprobante/comprobanteDialog';

interface PaymentPlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cuotas :number;
  paymentPlan: PaymentPlan;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  payments: Payment[];
  handleEditPayment: (index: number, changes: Partial<Payment>) => void;
  isEditingPayment: number;
  setIsEditingPayment: (v_editingPayment: number) => void;
  handleEditPaymentInput: (index: number, monto: number)=>void;
}

export default function PaymentsPlanDialog({
  open,
  onClose,
  onSubmit,
  cuotas,
  paymentPlan,
  handleChange,
  isEditing,
  payments,
  handleEditPayment,
  handleEditPaymentInput,
  isEditingPayment,
  setIsEditingPayment

}: PaymentPlanDialogProps) {
  const [status, setStatus] = React.useState(paymentPlan.estado ?? 'pendiente');
  const [comprobanteDialogOpen, setComprobanteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  
  const handleStatusChange = (event: { target: { value: string } }) => {
    setStatus(event.target.value);
  };
  
  const handleOpenComprobanteDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setComprobanteDialogOpen(true);
  };
  

  const handleUploadComprobante = async (idpago: number, enlaceComprobante: string | null) => {
    try {
      const paymentIndex = payments.findIndex(p => p.idpago === idpago);
      if (paymentIndex === -1) return;
      
      const updatedPayments = [...payments];
      updatedPayments[paymentIndex] = {
        ...updatedPayments[paymentIndex],
        enlacecomprobante: enlaceComprobante,
        estado: enlaceComprobante ? 'completado' : 'pendiente'
      };
      
      handleEditPayment(paymentIndex, { 
        enlacecomprobante: enlaceComprobante,
        estado: enlaceComprobante ? 'completado' : 'pendiente'
      });

      setComprobanteDialogOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error al actualizar comprobante:', error);
    }
  };

  const handleCloseComprobanteDialog = () => {
    setComprobanteDialogOpen(false);
    setSelectedPayment(null);
  };

  return (
    <>
    
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{isEditing ? 'Editar Plan de Pagos' : 'Añadir Plan de Pagos'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          {/* FORMULARIO */}
          <Box flex={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name="fechacreacion"
                label="Fecha Creación"
                value={paymentPlan.fechacreacion ? new Date(paymentPlan.fechacreacion) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: 'fechacreacion', value: newValue?.toISOString() || '' }
                  }as any)
                }
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    required: true,
                    InputLabelProps: { shrink: true },
                  } as TextFieldProps
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name="fechalimite"
                label="Fecha Límite"
                value={paymentPlan.fechalimite ? new Date(paymentPlan.fechalimite) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: 'fechalimite', value: newValue?.toISOString() || '' }
                  } as any)
                }
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    required: true,
                    InputLabelProps: { shrink: true },
                  } as TextFieldProps
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Monto Total"
              name="montotal"
              inputMode="numeric"
              type="text"
              fullWidth
              margin="dense"
              value={paymentPlan.montotal}
              onChange={handleChange}
            />

            <TextField
              label="Descripción"
              name="descripcion"
              type="text"
              fullWidth
              margin="dense"
              onChange={handleChange}
              value={paymentPlan.descripcion}
            />

            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel htmlFor="native-select-estado">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="estado"
                value={status != '' ? status : paymentPlan.estado}
                label="Estado"
                onChange={handleStatusChange}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="completo">Completo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Número de Cuotas"
              name="cuotas"
              type="text"
              inputMode="numeric"
              fullWidth
              margin="dense"
              value={cuotas}
              onChange={handleChange}
            />
          </Box>

          {/* TABLA DE PAGOS */}
          <Box flex={1}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto Esperado</TableCell>
                    <TableCell>Monto Pagado</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((pago, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {pago.fechapago ? new Date(pago.fechapago).toLocaleDateString() : ' - '}
                      </TableCell>

                      <TableCell>
                        {isEditingPayment === index ? (
                          <TextField
                            type="number"
                            size="small"
                            name="montoesperado"
                            value={pago.montoesperado}
                            onChange={(e) =>
                              handleEditPaymentInput(index, parseFloat(e.target.value) || 0)
                            }
                            InputProps={{
                              endAdornment: <span>bs.</span>,
                            }}
                          />
                        ) : (
                          `${pago.montoesperado} bs.`
                        )}
                      </TableCell>

                      <TableCell>{pago.montopagado} bs.</TableCell>
                      <TableCell>{pago.estado}</TableCell>

                      {/* dialog paraa el comprobante */}
                      <TableCell>
                          <Tooltip title={pago.enlacecomprobante ? "Ver comprobante" : "Subir comprobante"}>
                            <IconButton 
                              size="small"
                              onClick={() => handleOpenComprobanteDialog(pago)}
                              color={pago.enlacecomprobante ? "primary" : "default"}
                            >
                              {pago.enlacecomprobante ? <Receipt /> : <UploadFile />}
                            </IconButton>
                          </Tooltip>
                      </TableCell>

                      <TableCell>
                        {pago.estado !== 'completado' && (
                          <IconButton
                            onClick={() => {
                              if (isEditingPayment === index) {
                                // Confirmar la edición
                                handleEditPayment(index, { montoesperado: pago.montoesperado }); // tu función para actualizar el estado
                                setIsEditingPayment(1000);
                              } else {
                                setIsEditingPayment(index);
                              }
                            }}
                          >
                            {isEditingPayment === index ? (
                              <Check fontSize="small" />
                            ) : (
                              <Edit fontSize="small" />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
      {/* Dialog para subir o visualizar el comprobante se alejan cositas*/}
      {selectedPayment && (
        <ComprobanteDialog
          open={comprobanteDialogOpen}
          onClose={handleCloseComprobanteDialog}
          onUpload={handleUploadComprobante}
          enlaceComprobante={selectedPayment?.enlacecomprobante || null}  
          idpago={selectedPayment?.idpago || 0}
        />
      )}
    </>
  );
}
