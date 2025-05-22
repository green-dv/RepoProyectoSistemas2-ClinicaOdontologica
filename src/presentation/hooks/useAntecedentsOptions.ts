import { useState, useCallback } from 'react';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';

export interface Option {
    id: number;
    label: string;
}

interface UseAntecedenteOptionsReturn {
    // Estados de opciones
    enfermedadesOptions: Option[];
    habitosOptions: Option[];
    medicacionesOptions: Option[];
    atencionesOptions: Option[];
    
    // Estados de loading
    loading: boolean;
    
    // Estados de búsqueda
    enfermedadSearch: string;
    habitoSearch: string;
    medicacionSearch: string;
    atencionSearch: string;
    
    // Setters para búsqueda
    setEnfermedadSearch: React.Dispatch<React.SetStateAction<string>>;
    setHabitoSearch: React.Dispatch<React.SetStateAction<string>>;
    setMedicacionSearch: React.Dispatch<React.SetStateAction<string>>;
    setAtencionSearch: React.Dispatch<React.SetStateAction<string>>;
    
    // Funciones de fetch
    fetchOptions: () => Promise<void>;
    fetchEnfermedades: (query: string) => Promise<void>;
    fetchHabitos: (query: string) => Promise<void>;
    fetchMedicaciones: (query: string) => Promise<void>;
    fetchAtencionesMedicas: (query: string) => Promise<void>;
}

export const useAntecedenteOptions = (): UseAntecedenteOptionsReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    
    // Estados para opciones
    const [enfermedadesOptions, setEnfermedadesOptions] = useState<Option[]>([]);
    const [habitosOptions, setHabitosOptions] = useState<Option[]>([]);
    const [medicacionesOptions, setMedicacionesOptions] = useState<Option[]>([]);
    const [atencionesOptions, setAtencionesOptions] = useState<Option[]>([]);
    
    // Estados para búsqueda
    const [enfermedadSearch, setEnfermedadSearch] = useState<string>('');
    const [habitoSearch, setHabitoSearch] = useState<string>('');
    const [medicacionSearch, setMedicacionSearch] = useState<string>('');
    const [atencionSearch, setAtencionSearch] = useState<string>('');

    const fetchEnfermedades = useCallback(async (query: string): Promise<void> => {
        try {
        const response = await fetch(`/api/illnesses?q=${query}`);
        if (!response.ok) throw new Error('Error al cargar enfermedades');
        const data: Illness[] = await response.json();
        
        const options = data.map((item): Option => ({
            id: item.idenfermedad,
            label: item.enfermedad
        }));
        
        setEnfermedadesOptions(options);
        } catch (error) {
        console.error('Error fetching enfermedades:', error);
        }
    }, []);

    const fetchHabitos = useCallback(async (query: string): Promise<void> => {
        try {
        const response = await fetch(`/api/habits?q=${query}`);
        if (!response.ok) throw new Error('Error al cargar hábitos');
        const data: Habit[] = await response.json();
        
        const options = data.map((item): Option => ({
            id: item.idhabito,
            label: item.habito
        }));
        
        setHabitosOptions(options);
        } catch (error) {
        console.error('Error fetching habitos:', error);
        }
    }, []);

    const fetchMedicaciones = useCallback(async (query: string): Promise<void> => {
        try {
        const response = await fetch(`/api/medications?q=${query}`);
        if (!response.ok) throw new Error('Error al cargar medicaciones');
        const data: Medication[] = await response.json();
        
        const options = data.map((item): Option => ({
            id: item.idmedicacion,
            label: item.medicacion
        }));
        
        setMedicacionesOptions(options);
        } catch (error) {
        console.error('Error fetching medicaciones:', error);
        }
    }, []);

    const fetchAtencionesMedicas = useCallback(async (query: string): Promise<void> => {
        try {
        const response = await fetch(`/api/attentions?q=${query}`);
        if (!response.ok) throw new Error('Error al cargar atenciones médicas');
        const data: MedicalAttention[] = await response.json();
        
        const options = data.map((item): Option => ({
            id: item.idatencionmedica,
            label: item.atencion
        }));
        
        setAtencionesOptions(options);
        } catch (error) {
        console.error('Error fetching atenciones médicas:', error);
        }
    }, []);

    const fetchOptions = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
        await Promise.all([
            fetchEnfermedades(''),
            fetchHabitos(''),
            fetchMedicaciones(''),
            fetchAtencionesMedicas('')
        ]);
        } catch (error) {
        console.error('Error cargando opciones:', error);
        throw error;
        } finally {
        setLoading(false);
        }
    }, [fetchEnfermedades, fetchHabitos, fetchMedicaciones, fetchAtencionesMedicas]);

    return {
        enfermedadesOptions,
        habitosOptions,
        medicacionesOptions,
        atencionesOptions,
        loading,
        enfermedadSearch,
        habitoSearch,
        medicacionSearch,
        atencionSearch,
        setEnfermedadSearch,
        setHabitoSearch,
        setMedicacionSearch,
        setAtencionSearch,
        fetchOptions,
        fetchEnfermedades,
        fetchHabitos,
        fetchMedicaciones,
        fetchAtencionesMedicas
    };
};