import { Box } from '@mui/material';
import { TabPanelProps } from './PatientViewTypes';

/**
 * Componente TabPanel para mostrar el contenido de cada pestañita
 */
export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`antecedent-tabpanel-${index}`}
        aria-labelledby={`antecedent-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            {children}
            </Box>
        )}
        </div>
    );
};