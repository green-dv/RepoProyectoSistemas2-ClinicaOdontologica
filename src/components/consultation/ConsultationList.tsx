import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Box,
    Pagination,
    IconButton,
    Stack,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Chip,
    CardActions,
    Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useConsultationData } from '@/presentation/handlers/useConsultationHandlers';
import { Consultation } from '@/domain/entities/Consultations';
import { UpdateConsultationDTO } from '@/domain/dto/consultation';
import { ConsultationEditDialog } from './ConsultationEdit';
import { ConsultationDetailDialog } from './ConsultationDetail';

export const ConsultationCardList: React.FC = () => {
    const {
        consultations,
        loading,
        totalConsultations,
        fetchConsultations,
        error,
        handleDeletePermanently,
        updateConsultation,
        actionLoading,
    } = useConsultationData();

    const [page, setPage] = useState(0);
    const rowsPerPage = 6;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);

    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedDetailConsultationId, setSelectedDetailConsultationId] = useState<number | null>(null);

    useEffect(() => {
        fetchConsultations({
            page,
            rowsPerPage,
            searchQuery: '',
            showDisabled: false,
        });
    }, [page, fetchConsultations]);

    const handleChangePage = (_: unknown, value: number) => {
        setPage(value - 1);
    };

    const handleView = (id: number) => {
        setSelectedDetailConsultationId(id);
        setDetailDialogOpen(true);
    };

    const closeDetailDialog = () => {
        setDetailDialogOpen(false);
        setSelectedDetailConsultationId(null);
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId !== null) {
            const success = await handleDeletePermanently({ idconsulta: selectedId } as Consultation);
            if (success) {
                fetchConsultations({
                    page,
                    rowsPerPage,
                    searchQuery: '',
                    showDisabled: false,
                });
            }
        }
        setDialogOpen(false);
        setSelectedId(null);
    };

    const handleCancelDelete = () => {
        setDialogOpen(false);
        setSelectedId(null);
    };

    const openEditDialog = (consultationId: number) => {
        setSelectedConsultationId(consultationId);
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedConsultationId(null);
    };

    const handleUpdateSubmit = async (id: number, dto: UpdateConsultationDTO) => {
        const success = await updateConsultation(id, dto);
        if (success) {
            closeEditDialog();
            // Refrescar la lista
            fetchConsultations({
                page,
                rowsPerPage,
                searchQuery: '',
                showDisabled: false,
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={40} />
                    <Typography>Cargando consultas...</Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    Error al cargar las consultas
                </Typography>
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (consultations.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No hay consultas registradas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Las consultas que se registren aparecerán aquí.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {consultations.map((consultation: Consultation) => (
                    <Grid item xs={12} sm={6} md={4} key={consultation.idconsulta}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    boxShadow: 2,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                {/* Header */}
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Typography variant="h6" component="div">
                                        Consulta #{consultation.idconsulta}
                                    </Typography>
                                    <Chip
                                        label={consultation.estadopago ? 'Pagado' : 'Pendiente'}
                                        color={consultation.estadopago ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </Stack>

                                {/* Información principal */}
                                <Stack spacing={1.5}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(consultation.fecha).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AttachMoneyIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>{consultation.presupuesto.toFixed(2)} Bs</strong>
                                        </Typography>
                                    </Stack>

                                    {/* Información del paciente */}
                                    {consultation.idpaciente && (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PersonIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {consultation.idpaciente}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </CardContent>

                            <Divider />

                            <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                                <Tooltip title="Ver detalles">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleView(consultation.idconsulta)}
                                        sx={{ color: 'primary.main' }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar consulta">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => openEditDialog(consultation.idconsulta)}
                                        sx={{ color: 'info.main' }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar consulta">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => confirmDelete(consultation.idconsulta)}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil(totalConsultations / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                />
            </Box>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog 
                open={dialogOpen} 
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        ¿Eliminar consulta?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas eliminar esta consulta? Esta acción eliminará 
                        permanentemente la consulta y todas sus relaciones con tratamientos.
                    </DialogContentText>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="error.dark">
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelDelete} variant="outlined">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                        disabled={actionLoading}
                        startIcon={actionLoading ? <CircularProgress size={16} /> : null}
                    >
                        {actionLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de edición */}
            <ConsultationEditDialog
                open={editDialogOpen}
                onClose={closeEditDialog}
                consultationId={selectedConsultationId}
                onSubmit={handleUpdateSubmit}
                loading={actionLoading}
            />

            {/* Nuevo diálogo de detalles */}
            <ConsultationDetailDialog
                open={detailDialogOpen}
                onClose={closeDetailDialog}
                consultationId={selectedDetailConsultationId}
            />
        </Box>
    );
};