import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Divider,
    IconButton,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
} from '@mui/material';
import {
    Close as CloseIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    MedicalServices as MedicalIcon,
    Assignment as AssignmentIcon,
    AccountCircle as UserIcon,
    Biotech  as TeethIcon,
} from '@mui/icons-material';

import { useConsultationRelationsHandlers } from '@/presentation/handlers/useConsultationRelationsHandlers';
import { useRouter } from 'next/navigation';

interface ConsultationDetailDialogProps {
    open: boolean;
    onClose: () => void;
    consultationId: number | null;
}

export const ConsultationDetailDialog: React.FC<ConsultationDetailDialogProps> = ({
    open,
    onClose,
    consultationId,
}) => {
    const router = useRouter();
    const {
        consultationDetail,
        loading,
        error,
        fetchConsultationDetail,
        setConsultationDetail,
        setError,
    } = useConsultationRelationsHandlers();

    useEffect(() => {
        if (open && consultationId) {
            fetchConsultationDetail(consultationId);
        }
        
        if (!open) {
            setConsultationDetail(null);
            setError(null);
        }
    }, [open, consultationId, fetchConsultationDetail, setConsultationDetail, setError]);

    const handleClose = () => {
        setConsultationDetail(null);
        setError(null);
        onClose();
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} Bs`;
    };
    //++++++++++++++++++++++++++++++++++++++
    //Para el odontograma
    //================================
    const handleNavigateToOdontogram = () => {
        if (consultationDetail) {
            router.push(`/odontograma/${consultationDetail.idconsulta}`);
            handleClose(); 
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { minHeight: '80vh' }
            }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <MedicalIcon color="primary" />
                        <Typography variant="h5" component="div">
                            {consultationDetail ? `Consulta #${consultationDetail.idconsulta}` : 'Detalles de Consulta'}
                        </Typography>
                    </Stack>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <Stack alignItems="center" spacing={2}>
                            <CircularProgress size={40} />
                            <Typography>Cargando detalles de la consulta...</Typography>
                        </Stack>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {consultationDetail && !loading && (
                    <Grid container spacing={3}>
                        {/* Información General */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentIcon color="primary" />
                                        Información General
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Fecha de la consulta:
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatDate(consultationDetail.fecha)}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <MoneyIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Presupuesto:
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatCurrency(consultationDetail.presupuesto)}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Estado de pago:
                                            </Typography>
                                            <Chip
                                                label={consultationDetail.estadopago ? 'Pagado' : 'Pendiente'}
                                                color={consultationDetail.estadopago ? 'success' : 'warning'}
                                                variant="filled"
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Estado:
                                            </Typography>
                                            <Chip
                                                label={consultationDetail.habilitado ? 'Activo' : 'Inactivo'}
                                                color={consultationDetail.habilitado ? 'success' : 'default'}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Información del Paciente */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="primary" />
                                        Información del Paciente
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {consultationDetail.paciente.nombres} {consultationDetail.paciente.apellidos}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ID: {consultationDetail.paciente.idpaciente}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {consultationDetail.paciente.telefonopersonal || 'No registrado'}
                                            </Typography>
                                        </Stack>

                              

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                Fecha de nacimiento:
                                            </Typography>
                                            <Typography variant="body2">
                                                {consultationDetail.paciente.fechanacimiento ? 
                                                    new Date(consultationDetail.paciente.fechanacimiento).toLocaleDateString('es-ES') : 
                                                    'No registrada'
                                                }
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Información del Usuario */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <UserIcon color="primary" />
                                        Usuario Asignado
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                <UserIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {consultationDetail.usuario.nombre} {consultationDetail.usuario.apellido}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ID: {consultationDetail.usuario.idusuario}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {consultationDetail.usuario.email && (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {consultationDetail.usuario.email}
                                                </Typography>
                                            </Stack>
                                        )}

                                        
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Tratamientos */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MedicalIcon color="primary" />
                                        Tratamientos Asignados ({consultationDetail.tratamientos.length})
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    {consultationDetail.tratamientos.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No hay tratamientos asignados a esta consulta
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>ID</strong></TableCell>
                                                        <TableCell><strong>Nombre</strong></TableCell>
                                                        <TableCell><strong>Descripción</strong></TableCell>
                                                        <TableCell align="right"><strong>Precio</strong></TableCell>
                                                        <TableCell align="center"><strong>Estado</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {consultationDetail.tratamientos.map((tratamiento) => (
                                                        <TableRow key={tratamiento.idtratamiento} hover>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    #{tratamiento.idtratamiento}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {tratamiento.nombre}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography 
                                                                    variant="body2" 
                                                                    color="text.secondary"
                                                                    sx={{ 
                                                                        maxWidth: 200,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {tratamiento.descripcion || 'Sin descripción'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {formatCurrency(tratamiento.precio)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={tratamiento.habilitado ? 'Activo' : 'Inactivo'}
                                                                    color={tratamiento.habilitado ? 'success' : 'default'}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    {/* Botón para ir al odontograma */}
                    {consultationDetail && (
                        <Button
                            onClick={handleNavigateToOdontogram}
                            variant="outlined"
                            color="primary"
                            startIcon={<TeethIcon />}
                            sx={{ mr: 'auto' }}
                        >
                            Ir a Odontograma
                        </Button>
                    )}
                    
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};