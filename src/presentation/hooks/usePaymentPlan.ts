import React, { useState } from 'react';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface PaymentPlansState {
  paymentPlans: PaymentPlan[];
  open: boolean;
  newPaymentPlan: PaymentPlan;
  payments: Payment[];
  cuotas: number
  showDisabled: boolean;
  isLoading: boolean;
  isEditingPayment: number;
  paymentsLoading: boolean
  selectedPaymentPlan: PaymentPlan | null;
  snackbar: SnackbarMessage | null;

  page: number | 0;
  rowsPerPage: number | 0;
  total: number | 0;
  
  setPaymentPlans: React.Dispatch<React.SetStateAction<PaymentPlan[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPaymentPlan: React.Dispatch<React.SetStateAction<PaymentPlan>>;
  setCuotas: React.Dispatch<React.SetStateAction<number | 0>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[] | []>>;
  setPaymentsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingPayment: React.Dispatch<React.SetStateAction<number>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPaymentPlan: React.Dispatch<React.SetStateAction<PaymentPlan | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  setPage: React.Dispatch<React.SetStateAction<number | 0>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number | 10>>;
  setTotal: React.Dispatch<React.SetStateAction<number | 0>>;
  
  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function usePaymentPlans(): PaymentPlansState {
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [open, setOpen] = useState(false);
  const [newPaymentPlan, setNewPaymentPlan] = useState<PaymentPlan>({
    idplanpago: 0,
    fechacreacion: new Date(),
    fechalimite: new Date(),
    montotal: 0,
    descripcion: '',
    estado: '',
    idconsulta: 0,
    pagos: [],
  });
  const [cuotas, setCuotas] = useState(0);
  const [isEditingPayment, setIsEditingPayment] = useState(10000);
  const [showDisabled, setShowDisabled] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const resetForm = () => {``
    setNewPaymentPlan({
      idplanpago: 0,
      fechacreacion: new Date(),
      fechalimite: new Date(),
      montotal: 0,
      descripcion: '',
      estado: 'pendiente',
      idconsulta: 0,
      pagos: [],
    });
    setSelectedPaymentPlan (null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    paymentPlans,
    open,
    newPaymentPlan,
    showDisabled,
    isLoading,
    selectedPaymentPlan,
    cuotas,
    snackbar,
    paymentsLoading,
    payments,
    isEditingPayment,

    page,
    rowsPerPage,
    total,
    
    setPaymentPlans,
    setPaymentsLoading,
    setOpen,
    setNewPaymentPlan,
    setCuotas,
    setShowDisabled,
    setIsLoading,
    setSelectedPaymentPlan,
    setSnackbar,
    setPayments,
    setIsEditingPayment,

    setPage,
    setRowsPerPage,
    setTotal,
    
    resetForm,
    showMessage
  };
}