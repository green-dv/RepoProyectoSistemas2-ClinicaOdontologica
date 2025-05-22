import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PregnantWoman as PregnantIcon, ChildCare as ChildCareIcon } from '@mui/icons-material';

/**
 * Formatea una fecha al formato día mes año en español GOOOD
 */
export const formatDate = (date: Date | string): string => {
    if (!date) return 'No registrada';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
};

/**
 * Aqui se calcula la edad a partir de la fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
};

/**
 * Iconos y el label para el estado de embarazo
 * @param embarazo - Estado de embarazo
 * @return - Icono correspondiente
 */
export const getEmbarazoLabel = (embarazo: boolean): string => {
    return embarazo ? 'Sí' : 'No';
};

export const getEmbarazoIcon = (embarazo: boolean) => {
    return embarazo ? <PregnantIcon color="primary" /> : <ChildCareIcon color="secondary" />;
};