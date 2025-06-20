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
import PaymentsPlanForm from './PaymentsPlanForm';

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
  shouldSearch,

  searchLoading,
  searchQuery,
  patients,
  handleClearSearch,
  handlePatientSelect,
  setSearchQuery,
  setShouldSearch,
}: Readonly<PaymentPlanDialogProps>) {


  return (
    <>
    
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{isEditing ? 'Editar Plan de Pagos' : 'Añadir Plan de Pagos'}</DialogTitle>
      <DialogContent>
        <PaymentsPlanForm
          cuotas={cuotas}
          paymentPlan={paymentPlan}
          payments={payments}
          status={status}
          handleChange={handleChange}
          isEditing={isEditing}
          paymentIndex={paymentIndex ?? 0}
          handleEditPayment={handleEditPayment}
          isEditingPayment={isEditingPayment}
          setIsEditingPayment={setIsEditingPayment}
          handleEditPaymentInput={handleEditPaymentInput}
          selectedPayment={selectedPayment}
          selectedIndex={selectedIndex}
          handleStatusChange={handleStatusChange}
          handleCloseComprobanteDialog={handleCloseComprobanteDialog}
          handleOpenComprobanteDialog={handleOpenComprobanteDialog}
          handleUploadComprobante={handleUploadComprobante}
          setPayments={setPayments}
          searchLoading={searchLoading}
          searchQuery={searchQuery}
          patients={patients}
          handleClearSearch={handleClearSearch}
          handlePatientSelect={handlePatientSelect}
          setSearchQuery={setSearchQuery}
          setShouldSearch={setShouldSearch}
          shouldSearch={shouldSearch}
        />
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
