"use client";
import React from 'react';
import { CreateConsultationDialog } from '@/components/consultation/ConsultationCreate';
import { useConsultationList } from '@/presentation/hooks/useConsultation';
import { CreateConsultationDTO } from '@/domain/dto/consultation';
import { Box, Button, Typography } from '@mui/material';
import { ConsultationCardList } from '@/components/consultation/ConsultationList';

export default function ConsultationsPage() {
    // Usar el hook que ya tienes
    const {
        consultations,
        loading,
        error,
        actionLoading,
        openAddDialog,
        handleOpenAddDialog,
        handleCloseAddDialog,
        createConsultation,
        // ... otros valores del hook
    } = useConsultationList();

    // Obtener el userId (esto depende de tu sistema de autenticación)
    const userId = 1; // Reemplaza esto con la lógica real para obtener el userId

    // Función para manejar la creación de consulta
    const handleCreateConsultation = async (data: CreateConsultationDTO) => {
        try {
            const success = await createConsultation(data);
            if (success) {
                // La consulta se creó exitosamente
                // El diálogo se cerrará automáticamente en el componente
                console.log('Consulta creada exitosamente');
            }
        } catch (err) {
            console.error('Error al crear consulta:', err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Consultas
            </Typography>
            
            {/* Botón para abrir el diálogo */}
            <Button 
                variant="contained" 
                onClick={handleOpenAddDialog}
                sx={{ mb: 2 }}
            >
                Nueva Consulta
            </Button>

            
            <ConsultationCardList />

            {/* Diálogo de creación */}
            <CreateConsultationDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onSubmit={handleCreateConsultation} // Esta es la función que faltaba
                loading={actionLoading}
                error={error}
                userId={userId}
            />
        </Box>
    );
}