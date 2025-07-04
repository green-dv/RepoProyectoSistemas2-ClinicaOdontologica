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

import { Check, 
  Edit,
  UploadFile, 
  Receipt, 
  Search as SearchIcon,
  Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import ComprobanteDialog from '../comprobante/comprobanteDialog';
import { Patient } from '@/domain/entities/Patient';

interface PaymentPlanDialogProps {
  cuotas :number;
  paymentPlan: PaymentPlan;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  payments: Payment[];
  status: string;
  handleEditPayment: (index: number, changes: Partial<Payment>) => void;
  isEditingPayment: number;
  selectedPayment: Payment|null;
  selectedIndex: number;
  paymentIndex: number;

  montotalConsultation: number | null;

  patients: Patient[];
  searchQuery: string | '';
  searchLoading: boolean | false;
  handleClearSearch: () => void;
  handlePatientSelect: (patient: Patient) => void;
  shouldSearch: boolean;

  fechaConsulta: Date | null;

  setIsEditingPayment: (v_editingPayment: number) => void;
  handleEditPaymentInput: (index: number, monto: number)=>void;
  handleStatusChange: (event: { target: { value: string } })=>void;
  handleOpenComprobanteDialog: (payment: Payment, index: number)=>void;
  handleUploadComprobante: (idpago: number, enlaceComprobante: string | null)=>void;
  handleCloseComprobanteDialog: ()=>void;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setShouldSearch: React.Dispatch<React.SetStateAction<boolean>>;

  fechaCreacionError: boolean;
  fechaLimiteError: boolean;
  montoError: boolean;
  descripcionError: boolean;
  pacienteError: boolean;
  cuotasError: boolean;

  isConsultation: boolean;

  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function PaymentsPlanDialog({
  cuotas,
  paymentPlan,
  handleChange,
  isEditing,
  payments,
  selectedPayment,
  selectedIndex,
  status,
  paymentIndex,
  handleEditPayment,
  handleEditPaymentInput,
  isEditingPayment,
  setIsEditingPayment,
  handleStatusChange,
  handleOpenComprobanteDialog,
  handleUploadComprobante,
  handleCloseComprobanteDialog,
  setPayments,
  montotalConsultation,

  searchLoading,
  searchQuery,
  patients,
  handleClearSearch,
  handlePatientSelect,
  setSearchQuery,
  setShouldSearch,

  fechaCreacionError,
  fechaLimiteError,
  montoError,
  descripcionError,
  pacienteError,
  cuotasError,

  fechaConsulta,

  isConsultation,
}: Readonly<PaymentPlanDialogProps>) {


  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      {/* FORMULARIO */}
      <Box flex={1}>
        {!isConsultation && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              name="fechacreacion"
              label="Fecha Creación"
              value={fechaConsulta ?? (paymentPlan.fechacreacion ? new Date(paymentPlan.fechacreacion) : null)}
              onChange={(newValue) =>
                handleChange({
                  target: { name: 'fechacreacion', value: newValue?.toISOString() ?? '' }
                }as any)
              }
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  id:fechaCreacionError ? 'outlined-error-helper-text' : 'fechaCreacion',
                  error:fechaCreacionError,
                  fullWidth: true,
                  margin: 'dense',
                  required: true,
                  InputLabelProps: { shrink: true },
                } as TextFieldProps
              }}
            />
          </LocalizationProvider>
        )}
        

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
                id:fechaLimiteError ? 'outlined-error-helper-text' : 'fechaLimite',
                error:fechaLimiteError,
                fullWidth: true,
                margin: 'dense',
                required: true,
                InputLabelProps: { shrink: true },
              } as TextFieldProps
            }}
          />
        </LocalizationProvider>
        { !isConsultation && (
          <TextField
            label="Monto Total"
            id={montoError ? 'outlined-error-helper-text' : 'monto'}
            error={montoError}
            name="montotal"
            inputMode="numeric"
            type="text"
            fullWidth
            margin="dense"
            value={montotalConsultation ?? paymentPlan.montotal}
            onChange={handleChange}
          />
        )}
        

        <TextField
          id={descripcionError ? 'outlined-error-helper-text' : 'descripcion'}
          error={descripcionError}
          label="Descripción"
          name="descripcion"
          type="text"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={paymentPlan.descripcion}
        />
        {!isConsultation && (
          <Box className="no-print" position="relative">
            <TextField
              id={pacienteError ? 'outlined-error-helper-text' : 'paciente'}
              error={pacienteError}
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
        )}
        

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
          id={cuotasError ? 'outlined-error-helper-text' : 'cuotas'}
          error={cuotasError}
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
  );
}
