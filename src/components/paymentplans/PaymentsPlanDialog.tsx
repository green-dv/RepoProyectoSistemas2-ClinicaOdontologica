'use client';

import React from 'react';
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
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

import {
  Search as SearchIcon,
  Print as PrintIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { Check, Edit,UploadFile, Receipt } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import ComprobanteDialog from '../comprobante/comprobanteDialog';
import { Patient } from '@/domain/entities/Patient';

interface PaymentPlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cuotas :number;
  paymentPlan: PaymentPlan;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  payments: Payment[];
  status: string;
  handleEditPayment: (index: number, changes: Partial<Payment>) => void;
  isEditingPayment: number;
  selectedPayment: Payment|null;
  comprobanteDialogOpen: boolean;
  selectedIndex: number;
  paymentIndex: number;
  fechaPago: Date;
  montoPago: number;

  patients: Patient[];
  searchQuery: string | '';
  searchLoading: boolean | false;
  handleClearSearch: () => void;
  handlePatientSelect: (patient: Patient) => void;
  shouldSearch: boolean;

  setIsEditingPayment: (v_editingPayment: number) => void;
  setFechaPago: (v_fecha: Date) => void;
  setMontoPago: (v_monto: number) => void;
  handleEditPaymentInput: (index: number, monto: number)=>void;
  handleStatusChange: (event: { target: { value: string } })=>void;
  handleOpenComprobanteDialog: (payment: Payment, index: number)=>void;
  handleUploadComprobante: (idpago: number, enlaceComprobante: string | null)=>void;
  handleCloseComprobanteDialog: ()=>void;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setShouldSearch: React.Dispatch<React.SetStateAction<boolean>>;

  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
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
  selectedPayment,
  comprobanteDialogOpen,
  selectedIndex,
  status,
  fechaPago,
  montoPago,
  paymentIndex,
  handleEditPayment,
  handleEditPaymentInput,
  isEditingPayment,
  setIsEditingPayment,
  handleStatusChange,
  handleOpenComprobanteDialog,
  handleUploadComprobante,
  handleCloseComprobanteDialog,
  setFechaPago,
  setMontoPago,
  setPayments,

  searchLoading,
  searchQuery,
  patients,
  handleClearSearch,
  handlePatientSelect,
  setSearchQuery,
  setShouldSearch,
  shouldSearch
}: Readonly<PaymentPlanDialogProps>) {


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
                    target: { name: 'fechacreacion', value: newValue?.toISOString() ?? '' }
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
                    target: { name: 'fechalimite', value: newValue?.toISOString() ?? '' }
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

            <Box className="no-print" position="relative">
              <TextField
                fullWidth
                placeholder="Buscar paciente por nombre, apellido o id..."
                value={searchQuery}
                onChange={(e) => {
                  setShouldSearch(true);
                  setSearchQuery(e.target.value);
                }}
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
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

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
                              onClick={() => handleOpenComprobanteDialog(pago, index)}
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
          payment={selectedPayment}  
          idpago={selectedIndex}
          montotal={paymentPlan.montotal}
          cuotas={cuotas}
          paymentIndex={paymentIndex ?? 0}
          fechapago={fechaPago}
          payments={payments}
          setPayments={setPayments}
          montopago={montoPago}
          setFechaPago={setFechaPago}
          setMontoPago={setMontoPago}
        />
      )}
    </>
  );
}
