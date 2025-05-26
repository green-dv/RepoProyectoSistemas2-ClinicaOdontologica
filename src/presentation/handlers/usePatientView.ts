import { SyntheticEvent } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { AntecedenteCompleto, Antecedent } from '@/domain/entities/Antecedent';
import { UsePatientViewHookResult } from '@/presentation/hooks/usePatientView';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';
import { Illness } from '@/domain/entities/Illnesses';

export interface PatientViewHandlersProps {
    patient: Patient | null;
    hookData: UsePatientViewHookResult;
    onAddAntecedent: () => void;
}

export const usePatientViewHandlers = ({
    patient,
    hookData,
    onAddAntecedent
}: PatientViewHandlersProps) => {
    const {
        setAntecedentes,
        setShowAntecedentes,
        setLoadingAntecedentes,
        setLoadingError,
        setTabValue,
        setCurrentAntecedente,
        setEnfermedades,
        setHabitos,
        setMedicaciones,
        setAtencionesMedicas,
        setLoadingRelatedData,
        setOpenAddAntecedenteDialog,
        setOpenEditAntecedenteDialog,
        setSelectedAntecedente,
        setCurrentPatientId,
        resetPatientViewState
    } = hookData;

    /**
     * Obtiene la lista de antecedentes del paciente
     */
    const fetchAntecedentes = async (): Promise<void> => {
        if (!patient?.idpaciente) {
            console.warn('Intentando cargar antecedentes sin un paciente seleccionado');
            resetPatientViewState();
            return;
        }
    
        setLoadingAntecedentes(true);
        setLoadingError(null);
        
        try {
            const patientId = patient.idpaciente;
            const res = await fetch(`/api/patients/${patient.idpaciente}/antecedent`);
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            if (patient.idpaciente !== patientId) {
                console.warn('El paciente cambió durante la carga de antecedentes');
                return;
            }
            
            if (data && data.data) {
                const antecedentesCompletos: AntecedenteCompleto[] = data.data.map((ant: Antecedent) => ({
                    ...ant,
                    enfermedades: [],
                    habitos: [],
                    medicaciones: [],
                    atencionesMedicas: []
                }));
                
                setAntecedentes(antecedentesCompletos);
                
                if (antecedentesCompletos.length > 0) {
                    const primerAntecedente = antecedentesCompletos[0];
                    
                    // Primero establecemos el antecedente actual
                    setCurrentAntecedente(primerAntecedente);
                    
                    // Luego obtenemos los datos relacionados usando el ID directamente
                    if (primerAntecedente.idantecedente) {
                        await fetchRelatedDataAndUpdateAntecedente(primerAntecedente.idantecedente, primerAntecedente);
                    }
                } else {
                    setCurrentAntecedente(null);
                    setEnfermedades([]);
                    setHabitos([]);
                    setMedicaciones([]);
                    setAtencionesMedicas([]);
                }
            } else {
                setAntecedentes([]);
                setCurrentAntecedente(null);
            }
            
            setShowAntecedentes(true);
        } catch (error) {
            console.error('Error fetching antecedentes:', error);
            setLoadingError(`Error al cargar los antecedentes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            setAntecedentes([]);
            setCurrentAntecedente(null);
        } finally {
            setLoadingAntecedentes(false);
        }
    };

    /**
     * Obtiene los datos relacionados y actualiza el antecedente específico
     */
    const fetchRelatedDataAndUpdateAntecedente = async (
        antecedenteId: number, 
        antecedenteBase: AntecedenteCompleto
    ): Promise<void> => {
        if (!antecedenteId) {
            console.warn('Intentando cargar datos relacionados sin un ID de antecedente');
            return;
        }
        
        setLoadingRelatedData(true);
        
        try {
            // Realizar todas las peticiones en paralelo para mejorar rendimiento
            const [enfermedadesResponse, habitosResponse, medicacionesResponse, atencionesResponse] = await Promise.all([
                fetch(`/api/antecedents/${antecedenteId}/disease`),
                fetch(`/api/antecedents/${antecedenteId}/habits`),
                fetch(`/api/antecedents/${antecedenteId}/medication`),
                fetch(`/api/antecedents/${antecedenteId}/medicattention`)
            ]);

            // Procesar las respuestas
            let enfermedadesData: Illness[] = [];
            let habitosData: Habit[] = [];
            let medicacionesData: Medication[] = [];
            let atencionesData: MedicalAttention[] = [];

            if (enfermedadesResponse.ok) {
                const data = await enfermedadesResponse.json();
                enfermedadesData = data.data || [];
            } else {
                console.error('Error al obtener enfermedades:', enfermedadesResponse.statusText);
            }
            
            if (habitosResponse.ok) {
                const data = await habitosResponse.json();
                habitosData = data.data || [];
            } else {
                console.error('Error al obtener hábitos:', habitosResponse.statusText);
            }
            
            if (medicacionesResponse.ok) {
                const data = await medicacionesResponse.json();
                medicacionesData = data.data || [];
            } else {
                console.error('Error al obtener medicaciones:', medicacionesResponse.statusText);
            }
            
            if (atencionesResponse.ok) {
                const data = await atencionesResponse.json();
                atencionesData = data.data || [];
            } else {
                console.error('Error al obtener atenciones médicas:', atencionesResponse.statusText);
            }

            // Actualizar los estados de los datos relacionados
            setEnfermedades(enfermedadesData);
            setHabitos(habitosData);
            setMedicaciones(medicacionesData);
            setAtencionesMedicas(atencionesData);

            // Crear el antecedente completo con los datos relacionados
            const antecedenteCompleto: AntecedenteCompleto = {
                ...antecedenteBase,
                enfermedades: enfermedadesData.map(e => e.idenfermedad),
                habitos: habitosData.map(h => h.idhabito),
                medicaciones: medicacionesData.map(m => m.idmedicacion),
                atencionesMedicas: atencionesData.map(a => a.idatencionmedica)
            };
            
            // Actualizar el antecedente actual
            setCurrentAntecedente(antecedenteCompleto);
            
            // Actualizar la lista de antecedentes
            setAntecedentes(prev => prev.map(ant => 
                ant.idantecedente === antecedenteId ? antecedenteCompleto : ant
            ));
        
        } catch (error) {
            console.error('Error general al obtener datos relacionados:', error);
            setEnfermedades([]);
            setHabitos([]);
            setMedicaciones([]);
            setAtencionesMedicas([]);
        } finally {
            setLoadingRelatedData(false);
        }
    };

    /**
     * Obtiene los datos relacionados a un antecedente específico (versión legacy para compatibilidad)
     */
    const fetchRelatedData = async (antecedenteId: number): Promise<void> => {
        const currentAntecedente = hookData.currentAntecedente;
        if (!currentAntecedente) {
            console.warn('No hay antecedente actual para cargar datos relacionados');
            return;
        }
        
        await fetchRelatedDataAndUpdateAntecedente(antecedenteId, currentAntecedente);
    };

    /**
     * Maneja el cambio de pestañas
     */
    const handleChangeTab = (_event: SyntheticEvent, newValue: number): void => {
        setTabValue(newValue);
    };

    /**
     * Maneja la selección de un antecedente
     */
    const handleSelectAntecedente = async (antecedente: AntecedenteCompleto): Promise<void> => {
        // Limpiar datos anteriores
        setEnfermedades([]);
        setHabitos([]);
        setMedicaciones([]);
        setAtencionesMedicas([]);
        
        // Establecer el nuevo antecedente
        setCurrentAntecedente(antecedente);
        
        // Cargar los datos relacionados
        if (antecedente.idantecedente) {
            await fetchRelatedDataAndUpdateAntecedente(antecedente.idantecedente, antecedente);
        }
        
        // Resetear a la primera pestaña
        setTabValue(0); 
    };

    const handleOpenAddAntecedenteDialog = (): void => {
        if (patient?.idpaciente) {
            console.log("Abriendo diálogo para agregar antecedente con ID de paciente:", patient.idpaciente);
            setCurrentPatientId(patient.idpaciente);
            setSelectedAntecedente(null); 
            setOpenAddAntecedenteDialog(true);
            onAddAntecedent();
        } else {
            console.error("Error: No se puede abrir el diálogo sin ID de paciente");
        }
    };

    const handleCloseAddAntecedenteDialog = (): void => {
        setOpenAddAntecedenteDialog(false);
        setSelectedAntecedente(null); 
    };

    const handleAntecedenteAdded = (): void => {
        handleCloseAddAntecedenteDialog();
        fetchAntecedentes();
    };

    const handleOpenEditAntecedenteDialog = async (antecedente: AntecedenteCompleto): Promise<void> => {
        console.log("Abriendo diálogo para editar antecedente:", antecedente);
        
        if (antecedente.idantecedente && (!antecedente.enfermedades || antecedente.enfermedades.length === 0)) {
            try {
                const [enfermedadesResponse, habitosResponse, medicacionesResponse, atencionesResponse] = await Promise.all([
                    fetch(`/api/antecedents/${antecedente.idantecedente}/disease`),
                    fetch(`/api/antecedents/${antecedente.idantecedente}/habits`),
                    fetch(`/api/antecedents/${antecedente.idantecedente}/medication`),
                    fetch(`/api/antecedents/${antecedente.idantecedente}/medicattention`)
                ]);

                const enfermedadesData = enfermedadesResponse.ok ? (await enfermedadesResponse.json()).data || [] : [];
                const habitosData = habitosResponse.ok ? (await habitosResponse.json()).data || [] : [];
                const medicacionesData = medicacionesResponse.ok ? (await medicacionesResponse.json()).data || [] : [];
                const atencionesData = atencionesResponse.ok ? (await atencionesResponse.json()).data || [] : [];

                const antecedenteCompleto: AntecedenteCompleto = {
                    ...antecedente,
                    enfermedades: enfermedadesData,
                    habitos: habitosData,
                    medicaciones: medicacionesData,
                    atencionesMedicas: atencionesData
                };

                setSelectedAntecedente(antecedenteCompleto);
            } catch (error) {
                console.error('Error al cargar datos relacionados para edición:', error);
                setSelectedAntecedente(antecedente);
            }
        } else {
            setSelectedAntecedente(antecedente);
        }
        
        setOpenEditAntecedenteDialog(true);
    };

    const handleCloseEditAntecedenteDialog = (): void => {
        setSelectedAntecedente(null);
        setOpenEditAntecedenteDialog(false);
    };

    const handleAntecedenteUpdated = (): void => {
        handleCloseEditAntecedenteDialog();
        fetchAntecedentes();
    };

    return {
        fetchAntecedentes,
        fetchRelatedData,
        handleChangeTab,
        handleSelectAntecedente,
        handleOpenAddAntecedenteDialog,
        handleCloseAddAntecedenteDialog,
        handleAntecedenteAdded,
        handleOpenEditAntecedenteDialog,
        handleCloseEditAntecedenteDialog,
        handleAntecedenteUpdated
    };
};