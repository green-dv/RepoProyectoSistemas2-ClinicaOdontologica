"use client";
import { useState, useEffect } from "react";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Chip,
    Autocomplete,
    Box,
    Button,
    DialogActions,
    FormControlLabel,
    Switch,
    Typography,
    Alert,
    Paper,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useCreateConsultation } from "@/presentation/hooks/useConsultationDialog";
import { CreateConsultationDTO } from "@/domain/dto/consultation";
import { PersonSearch, MedicalServices, CalendarToday, AttachMoney, Payment } from "@mui/icons-material";
import PaymentsPlanForm from "../paymentplans/PaymentsPlanForm";
import useConsultationPaymentPlanHandlers from "@/presentation/handlers/useConsultationPaymentPlanHandler";
import useConsultationPaymentHandler from "@/presentation/handlers/useConsultationPaymentHandlers";
import ConsultationDialog from "../comprobante/ConsultationDialog";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateConsultationDTO) => void;
    loading: boolean;
    error?: string | null;
    userId: number;
}

export const CreateConsultationDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    loading,
    error,
    userId,
}) => {
    const {
        paymentPlans,
        
        isLoading,
        paymentsLoading,
        page,
        total,
        cuotas,
        rowsPerPage,
        newPaymentPlan,
        snackbar,
        payments,

        handleSubmitPaymentPlan,
        selectedPaymentPlan,
        handleSnackbarClose,
        handleEditPayment,
        handleEditPaymentInput,
        setIsEditingPayment,
        setPayments,
        shouldSearch,
        setShouldSearch,
        handleChange,
        searchLoading,
        handleClearSearch,
        handlePatientSelect,
        isEditingPayment,

        fechaCreacionError,
        fechaLimiteError,
        montoError,
        descripcionError,
        pacienteError,
        cuotasError,
        callRecalculatePayments,
        handleSetNewDate,
        handleChangeMontotal,
    } = useConsultationPaymentPlanHandlers();

    const{
        handleUploadComprobante,
        handleCloseComprobanteDialog,
        handleOpenComprobanteDialog,
        handleStatusChange,
        status,
        fechapago,
        montopago,

        paymentIndex,
        comprobanteDialogOpen,
        selectedPayment,
        selectedIndex,
        setFechaPago,
        setMontoPago,
        
    } = useConsultationPaymentHandler();

    const {
        searchQuery,
        setSearchQuery,
        patients,
        selectedPatient,
        selectPatient,
        clearPatient,
        loadingPatients,
        treatmentQuery,
        handleTreatmentSearch,
        treatments,
        selectedTreatments,
        setSelectedTreatments,
        toggleTreatmentSelection,
        loadingTreatments,
    } = useCreateConsultation();

    const [fecha, setFecha] = useState<Date | null>(new Date());
    const [presupuesto, setPresupuesto] = useState<number>(0);
    const [montotal, setMontotal] = useState<number>(0);
    const [estadopago, setEstadopago] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");

    // Limpiar el formulario cuando se cierre el dialog
    useEffect(() => {
        if (!open) {
            setFecha(new Date());
            setPresupuesto(0);
            setEstadopago(false);
            setFormError("");
            clearPatient();
            setSelectedTreatments([]);
        }
    }, [open, clearPatient, setSelectedTreatments]);
    useEffect(() => {
        if(!fecha) return;
        handleSetNewDate(fecha);
    }, [fecha]);

    useEffect(() => {
        console.log(selectedTreatments)
        const montoAux = Number(presupuesto) + selectedTreatments.reduce(
            (total, item) => total + Number(item.precio), 0
        );
        setMontotal(Number(montoAux));
        handleChangeMontotal(Number(montoAux));
        callRecalculatePayments(Number(montoAux));
    }, [setSelectedTreatments, presupuesto, selectedTreatments])
    useEffect(() => {
        if(!selectedPatient) return;
        handlePatientSelect(selectedPatient);
    }, [selectedPatient])

    // Validar formulario
    const validateForm = (): boolean => {
        if (!selectedPatient) {
            setFormError("Debe seleccionar un paciente");
            return false;
        }
        if (!fecha) {
            setFormError("Debe seleccionar una fecha");
            return false;
        }
        if (presupuesto < 0) {
            setFormError("El presupuesto no puede ser negativo");
            return false;
        }
        if (selectedTreatments.length === 0) {
            setFormError("Debe seleccionar al menos un tratamiento");
            return false;
        }
        
        setFormError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        if (typeof onSubmit !== 'function') {
            console.error('onSubmit is not a function');
            setFormError('Error interno: función onSubmit no válida');
            return;
        }

        try {
            const dto: CreateConsultationDTO = {
                fecha: fecha!,
                presupuesto,
                idpaciente: selectedPatient!.idpaciente!,
                idusuario: userId,
                estadopago,
                tratamientos: selectedTreatments.map(t => t.idtratamiento),
            };

            await onSubmit(dto);
            
            // Si llega aqui exitooo todo funka
            console.log(dto);
            
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            setFormError('Error al crear la consulta');
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullWidth 
            maxWidth="md"
            PaperProps={{
                sx: { minHeight: '600px' }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Crear Nueva Consulta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Complete los datos para crear una nueva consulta
                </Typography>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3 }}>
                {/* Mostrar errores */}
                {(error || formError) && (
                    <Box mb={3}>
                        <Alert severity="error">
                            {error || formError}
                        </Alert>
                    </Box>
                )}

                {/* Selección de Paciente */}
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <PersonSearch sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" component="h3">
                            Seleccionar Paciente
                        </Typography>
                    </Box>
                    
                    <TextField
                        fullWidth
                        label="Buscar paciente por nombre"
                        placeholder="Ingrese el nombre del paciente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={!!selectedPatient || loading}
                        InputProps={{
                            endAdornment: loadingPatients ? <CircularProgress size={20} /> : null,
                        }}
                        sx={{ mb: 2 }}
                    />

                    {patients.length > 0 && !selectedPatient && (
                        <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                            <List dense>
                                {patients.map((patient) => (
                                    <ListItem 
                                        key={patient.idpaciente} 
                                        onClick={() => selectPatient(patient)}
                                        sx={{ 
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <ListItemText 
                                            primary={`${patient.nombres} ${patient.apellidos}`}
                                            secondary={patient.telefonopersonal}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {selectedPatient && (
                        <Chip
                            label={`${selectedPatient.nombres} ${selectedPatient.apellidos}`}
                            onDelete={clearPatient}
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    )}
                </Paper>

                {/* Selección de Tratamientos */}
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" component="h3">
                            Tratamientos
                        </Typography>
                    </Box>
                    
                    <Autocomplete
                        multiple
                        options={treatments}
                        getOptionLabel={(option) => option.nombre}
                        filterSelectedOptions
                        onInputChange={(e, value) => handleTreatmentSearch(value)}
                        value={selectedTreatments}
                        onChange={(event, value) => setSelectedTreatments(value)}
                        disabled={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar tratamientos"
                                placeholder="Buscar tratamiento..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingTreatments ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                    key={option.idtratamiento}
                                />
                            ))
                        }
                    />
                </Paper>

                {/* Fecha de Consulta */}
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" component="h3">
                            Fecha de Consulta
                        </Typography>
                    </Box>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Seleccionar fecha"
                            value={fecha}
                            onChange={(newValue) => setFecha(newValue)}
                            disabled={loading}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !fecha && formError.includes("fecha"),
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Paper>

                {/* Presupuesto y Estado de Pago */}
                <Paper elevation={1} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" component="h3">
                            Información Financiera
                        </Typography>
                    </Box>
                    
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            type="number"
                            label="Presupuesto"
                            value={presupuesto}
                            onChange={(e) => setPresupuesto(Number(e.target.value))}
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={loading}
                            sx={{ flex: 1 }}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                            }}
                        />
                        
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={estadopago}
                                    onChange={(e) => setEstadopago(e.target.checked)}
                                    color="primary"
                                    disabled={loading}
                                />
                            }
                            label={
                                <Box display="flex" alignItems="center">
                                    <Payment sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography>
                                        {estadopago ? "Pagado" : "Pendiente"}
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>
                    <PaymentsPlanForm
                        cuotas={Number(cuotas)}
                        paymentPlan={newPaymentPlan}
                        payments={payments}
                        status={status}
                        handleChange={handleChange}
                        isEditing={!!selectedPaymentPlan}
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
                        fechaCreacionError={fechaCreacionError}
                        fechaLimiteError={fechaLimiteError}
                        montoError={montoError}
                        descripcionError={descripcionError}
                        pacienteError={pacienteError}
                        cuotasError={cuotasError}
                        isConsultation={false}
                        montotalConsultation={montotal}
                        fechaConsulta={fecha}
                    />
                </Paper>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={() => {
                        handleSubmit();
                        handleSubmitPaymentPlan();
                    }}
                    disabled={loading || !selectedPatient || !fecha}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? "Creando..." : "Crear Consulta"}
                </Button>
            </DialogActions>
            {selectedPayment && (
                <ConsultationDialog
                    open={comprobanteDialogOpen}
                    onClose={handleCloseComprobanteDialog}
                    onUpload={handleUploadComprobante}
                    payment={selectedPayment}  
                    idpago={selectedIndex}
                    montotal={montotal}
                    cuotas={Number(cuotas)}
                    paymentIndex={paymentIndex ?? 0}
                    fechapago={fechapago}
                    payments={payments}
                    setPayments={setPayments}
                    montopago={montopago}
                    setFechaPago={setFechaPago}
                    setMontoPago={setMontoPago}
                />
            )}
        </Dialog>
        
    );
};