import React, { useState } from 'react';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import { AlertColor } from '@mui/material';
import { Patient } from '@/domain/entities/Patient';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface PaymentPlansState {
  paymentPlans: PaymentPlan[];
  open: boolean;
  newPaymentPlan: PaymentPlan;
  payments: Payment[];
  cuotas: string
  showDisabled: boolean;
  isLoading: boolean;
  isEditingPayment: number;
  paymentsLoading: boolean
  selectedPaymentPlan: PaymentPlan | null;
  snackbar: SnackbarMessage | null;

  //filtros
  filterStatus: string;
  filterStartDate: string;
  filterEndDate: string;

  page: number | 0;
  rowsPerPage: number | 0;
  total: number | 0;

  //PACIENTES
  searchQuery: string | '';
  debouncedSearchQuery: string | '';
  patients: Patient[] | [];
  selectedPatient: number | null;
  loading: boolean | false;
  searchLoading: boolean | false;
  error: string | null;
  shouldSearch: boolean;
  
  setPaymentPlans: React.Dispatch<React.SetStateAction<PaymentPlan[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPaymentPlan: React.Dispatch<React.SetStateAction<PaymentPlan>>;
  setCuotas: React.Dispatch<React.SetStateAction<string | ''>>;
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

  //Filtros
  setFilterStatus: React.Dispatch<React.SetStateAction<string | ''>>;
  setFilterStartDate: React.Dispatch<React.SetStateAction<string | ''>>;
  setFilterEndDate: React.Dispatch<React.SetStateAction<string | ''>>;

  //PACIENTES
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<number | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShouldSearch: React.Dispatch<React.SetStateAction<boolean>>;

  
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
    idpaciente: null,
    pagos: [],
    paciente: '',
  });
  const [cuotas, setCuotas] = useState('');
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

  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  //PACIENTES

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldSearch, setShouldSearch] = useState(true);

  const resetForm = () => {``
    setNewPaymentPlan({
      idplanpago: 0,
      fechacreacion: new Date(),
      fechalimite: new Date(),
      montotal: 0,
      descripcion: '',
      estado: 'pendiente',
      idconsulta: 0,
      idpaciente: null,
      pagos: [],
      paciente: '',
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

    //filtros
    filterStatus, 
    setFilterStatus,
    filterStartDate, 
    setFilterStartDate,
    filterEndDate, 
    setFilterEndDate,

    setPage,
    setRowsPerPage,
    setTotal,


    //PACIENTES
    searchQuery,
    debouncedSearchQuery,
    patients,
    selectedPatient,
    loading,
    searchLoading,
    error,
    setSearchQuery,
    setDebouncedSearchQuery,
    setPatients,
    setSelectedPatient,
    setLoading,
    setSearchLoading,
    setError,
    shouldSearch,
    setShouldSearch,
    
    resetForm,
    showMessage
  };
}