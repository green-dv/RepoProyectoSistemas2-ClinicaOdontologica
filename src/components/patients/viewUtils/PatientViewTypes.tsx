import { ReactNode } from 'react';
import { Patient } from '@/domain/entities/Patient';

/*
    **** Aqui estan las interfaces y tipos utilizados 
    en el componente PatientViewDialog.***
*/

export interface PatientViewDialogProps {
    open: boolean;
    onClose: () => void;
    patient: Patient | null;
    onEdit: () => void;
    onAddAntecedent?: () => void;
}

export interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}