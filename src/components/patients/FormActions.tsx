import React from 'react';
import {
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { SaveOutlined, CancelOutlined } from '@mui/icons-material';

interface FormActionsProps {
    onClose: () => void;
    loading: boolean;
    isEditMode: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
    onClose,
    loading,
    isEditMode
}) => {
    return (
        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={loading}
            startIcon={<CancelOutlined />}
        >
            Cancelar
        </Button>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
        >
            {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
        </Box>
    );
};

export default FormActions;