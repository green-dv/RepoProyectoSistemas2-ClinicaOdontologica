import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Stack,
    FormGroup,
    CircularProgress,
    Typography,
    Box,
    Divider,
    Alert,
    Chip
} from '@mui/material';
import { Treatment } from '@/domain/entities/Treatments';
import { useConsultationRelationsHandlers } from '@/presentation/handlers/useConsultationRelationsHandlers';
import { UpdateConsultationDTO } from '@/domain/dto/consultation';
import ReadonlyPaymentsPlanDialog from '../paymentplans/ViewPaymentPlan';

interface Props {
    open: boolean;
    onClose: () => void;
    consultationId: number | null;
    onSubmit: (id: number, dto: UpdateConsultationDTO) => Promise<void>;
    loading: boolean;
}

export const ConsultationEditDialog: React.FC<Props> = ({
    open,
    onClose,
    consultationId,
    onSubmit,
    loading
}) => {
    const {
        fetchConsultationDetail,
        addTreatmentsToConsultation,
        removeTreatmentFromConsultation,
        consultationDetail,
        loading: relationLoading,
        error: relationError,
        actionLoading
    } = useConsultationRelationsHandlers();

    // Estados del formulario
    const [fecha, setFecha] = useState('');
    const [presupuesto, setPresupuesto] = useState(0);
    const [estadopago, setEstadopago] = useState(false);
    
    // Estados para tratamientos
    const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<number[]>([]);
    const [tratamientosOriginales, setTratamientosOriginales] = useState<number[]>([]);
    const [todosTratamientos, setTodosTratamientos] = useState<Treatment[]>([]);
    
    // Estado para controlar la carga inicial
    const [dataLoaded, setDataLoaded] = useState(false);
    const [treatmentsLoaded, setTreatmentsLoaded] = useState(false);

    const fetchAllTreatments = async () => {
        try {
            const response = await fetch('/api/treatments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const treatments: Treatment[] = await response.json();
                setTodosTratamientos(treatments);
                setTreatmentsLoaded(true);
            } else {
                console.error('Error al obtener tratamientos:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar tratamientos:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (consultationId && open) {
                setDataLoaded(false);
                setTreatmentsLoaded(false);
                
                try {
                    const [detalle] = await Promise.all([
                        fetchConsultationDetail(consultationId),
                        fetchAllTreatments()
                    ]);

                    if (detalle) {
                        const consultationDate = new Date(detalle.fecha);
                        const formattedDate = consultationDate.toISOString().split('T')[0];
                        setFecha(formattedDate);
                        setPresupuesto(detalle.presupuesto);
                        setEstadopago(detalle.estadopago);

                        const tratamientosActuales = detalle.tratamientos.map(t => t.idtratamiento);
                        setTratamientosSeleccionados([...tratamientosActuales]);
                        setTratamientosOriginales([...tratamientosActuales]);
                    }
                    
                    setDataLoaded(true);
                } catch (error) {
                    console.error('Error cargando datos:', error);
                    setDataLoaded(true);
                }
            }
        };

        if (open && consultationId) {
            loadData();
        }
    }, [consultationId, open, fetchConsultationDetail]);

    useEffect(() => {
        if (!open) {
            setFecha('');
            setPresupuesto(0);
            setEstadopago(false);
            setTratamientosSeleccionados([]);
            setTratamientosOriginales([]);
            setTodosTratamientos([]);
            setDataLoaded(false);
            setTreatmentsLoaded(false);
        }
    }, [open]);

    const handleChangeTratamiento = (id: number, checked: boolean) => {
        setTratamientosSeleccionados(prev =>
            checked ? [...prev, id] : prev.filter(tid => tid !== id)
        );
    };

    const handleSubmit = async () => {
        if (!consultationId) return;

        try {
            const fechaDate = new Date(fecha);
            // Asegurar que la fecha sea válida ya que esta enviando integer
            if (isNaN(fechaDate.getTime())) {
                throw new Error('Fecha inválida');
            }
            
            const dto: UpdateConsultationDTO = {
                fecha: fechaDate.toISOString(),
                presupuesto,
                estadopago
            };

            await onSubmit(consultationId, dto);

            const agregados = tratamientosSeleccionados.filter(t => !tratamientosOriginales.includes(t));
            const eliminados = tratamientosOriginales.filter(t => !tratamientosSeleccionados.includes(t));

            if (eliminados.length > 0) {
                console.log('Eliminando tratamientos:', eliminados);
                const removeSuccess = await removeTreatmentFromConsultation(consultationId, eliminados);
                if (!removeSuccess) {
                    throw new Error('Error al eliminar tratamientos');
                }
            }

            if (agregados.length > 0) {
                console.log('Agregando tratamientos:', agregados);
                const addSuccess = await addTreatmentsToConsultation(consultationId, agregados);
                if (!addSuccess) {
                    throw new Error('Error al agregar tratamientos');
                }
            }

            onClose();
        } catch (error) {
            console.error('Error al actualizar consulta:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const isLoading = relationLoading || !dataLoaded || !treatmentsLoaded;
    const isSubmitDisabled = loading || actionLoading || isLoading;

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
                <Typography variant="h5" component="div">
                    Editar Consulta
                </Typography>
                {consultationDetail && (
                    <Typography variant="body2" color="text.secondary">
                        Consulta #{consultationDetail.idconsulta} - {consultationDetail.paciente.nombres} {consultationDetail.paciente.apellidos}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent>
                {relationError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {relationError}
                    </Alert>
                )}

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                        <Stack alignItems="center" spacing={2}>
                            <CircularProgress />
                            <Typography>Cargando datos de la consulta...</Typography>
                        </Stack>
                    </Box>
                ) : (
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Información de la consulta */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Información General
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    label="Fecha"
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Presupuesto (Bs)"
                                    type="number"
                                    value={presupuesto}
                                    onChange={(e) => setPresupuesto(parseFloat(e.target.value) || 0)}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={estadopago}
                                            onChange={(e) => setEstadopago(e.target.checked)}
                                        />
                                    }
                                    label="Consulta pagada"
                                />
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Tratamientos */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Tratamientos
                                </Typography>
                                <Chip 
                                    label={`${tratamientosSeleccionados.length} seleccionado(s)`}
                                    color="primary"
                                    size="small"
                                />
                            </Stack>

                            {!treatmentsLoaded ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Cargando tratamientos...
                                    </Typography>
                                </Box>
                            ) : (
                                <FormGroup sx={{ maxHeight: 300, overflowY: 'auto', px: 1 }}>
                                    {todosTratamientos.map((tratamiento) => (
                                        <FormControlLabel
                                            key={tratamiento.idtratamiento}
                                            control={
                                                <Checkbox
                                                    checked={tratamientosSeleccionados.includes(tratamiento.idtratamiento)}
                                                    onChange={(e) =>
                                                        handleChangeTratamiento(tratamiento.idtratamiento, e.target.checked)
                                                    }
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {tratamiento.nombre}
                                                    </Typography>
                                                    {tratamiento.descripcion && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {tratamiento.descripcion}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                            sx={{ py: 0.5 }}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                        </Box>
                    </Stack>
                )}
                <ReadonlyPaymentsPlanDialog
                    idConsulta={consultationId ?? 0}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={isSubmitDisabled}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={isSubmitDisabled}
                    sx={{ minWidth: 120 }}
                >
                    {(loading || actionLoading) ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Guardando...
                        </>
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};