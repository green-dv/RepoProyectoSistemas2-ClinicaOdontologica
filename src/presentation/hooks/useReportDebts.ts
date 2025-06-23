import { useState, useEffect, useCallback, useRef } from 'react';
import { debtsByPatient } from '@/domain/entities/reports/debtsByPatient';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

export const useDebtReports = () => {
    const [debts, setDebts] = useState<debtsByPatient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const [patientsCache, setPatientsCache] = useState<Map<number, Patient>>(new Map());
    
    const fetchDebtReportRef = useRef<(patientId: number | null) => Promise<void>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        
        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    const fetchPatientById = useCallback(async (patientId: number): Promise<Patient | null> => {
        try {
            const response = await fetch(`/api/patients/${patientId}`);
            if (!response.ok) {
                console.warn(`No se pudo obtener el paciente con ID ${patientId}`);
                return null;
            }
            
            const patient: Patient = await response.json();
            
            setPatientsCache(prev => {
                const newCache = new Map(prev);
                newCache.set(patientId, patient);
                return newCache;
            });
            
            return patient;
        } catch (err) {
            console.error(`Error al obtener paciente ${patientId}:`, err);
            return null;
        }
    }, []);

    const fetchPatientsByIds = useCallback(async (patientIds: number[]): Promise<Patient[]> => {
        const uniqueIds = [...new Set(patientIds)];
        
        setPatientsCache(currentCache => {
            const uncachedIds = uniqueIds.filter(id => !currentCache.has(id));
            
            if (uncachedIds.length === 0) {
                // Todos están en cache, devolver inmediatamente
                Promise.resolve(uniqueIds.map(id => currentCache.get(id)).filter(Boolean) as Patient[]);
                return currentCache;
            }

            // Procesar IDs no cacheados
            (async () => {
                try {
                    const idsParam = uncachedIds.join(',');
                    const response = await fetch(`/api/patients/batch?ids=${idsParam}`);
                    
                    if (response.ok) {
                        const fetchedPatients: Patient[] = await response.json();
                        
                        setPatientsCache(prevCache => {
                            const newCache = new Map(prevCache);
                            fetchedPatients.forEach(patient => {
                                if (patient.idpaciente) {
                                    newCache.set(patient.idpaciente, patient);
                                }
                            });
                            return newCache;
                        });
                    } else {
                        // Fallback: obtener uno por uno
                        const patientPromises = uncachedIds.map(id => fetchPatientById(id));
                        await Promise.all(patientPromises);
                    }
                } catch (err) {
                    console.error('Error al obtener pacientes por lote:', err);
                    // Fallback: obtener uno por uno
                    const patientPromises = uncachedIds.map(id => fetchPatientById(id));
                    await Promise.all(patientPromises);
                }
            })();

            return currentCache;
        });

        // Retornar una promesa que se resuelve cuando el cache se actualiza
        return new Promise((resolve) => {
            const checkCache = () => {
                setPatientsCache(currentCache => {
                    const result = uniqueIds.map(id => currentCache.get(id)).filter(Boolean) as Patient[];
                    if (result.length === uniqueIds.length || result.length > 0) {
                        resolve(result);
                    } else {
                        // Reintentar después de un breve delay
                        setTimeout(checkCache, 100);
                    }
                    return currentCache;
                });
            };
            checkCache();
        });
    }, [fetchPatientById]);

    // Función principal para obtener el reporte de deudas
    const fetchDebtReport = useCallback(async (patientId: number | null = null) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (patientId !== null) {
                queryParams.append('idpaciente', patientId.toString());
            }

            const response = await fetch(`/api/reports/debtsByPatient?${queryParams}`);
            
            if (!response.ok) {
                throw new Error('Error al cargar el reporte de deudas');
            }
            
            const rawData: debtsByPatient[] = await response.json();
            
            // Si no hay datos, establecer array vacío y salir
            if (!rawData || rawData.length === 0) {
                setDebts([]);
                return;
            }
            
            const patientIds = [...new Set(rawData.map(debt => debt.idpaciente))];
            
            // Obtener datos de pacientes
            const patientsData = await fetchPatientsByIds(patientIds);
            
            const patientsMap = new Map<number, Patient>();
            patientsData.forEach(patient => {
                if (patient.idpaciente) {
                    patientsMap.set(patient.idpaciente, patient);
                }
            });
            
            // Enriquecer datos con información de pacientes
            const enrichedData: debtsByPatient[] = rawData.map(debt => {
                const patient = patientsMap.get(debt.idpaciente);
                return {
                    ...debt,
                    nombres: patient?.nombres || debt.nombres || 'N/A',
                    apellidos: patient?.apellidos || debt.apellidos || 'N/A'
                };
            });
            
            // Importar dinámicamente el handler y procesar datos
            const { DebtReportsHandlers } = await import('../handlers/useDebtsReportHandler');
            const groupedData = DebtReportsHandlers.groupDebtsByPatient(enrichedData);
            
            setDebts(groupedData);
        } catch (err) {
            console.error('Error fetching debt report:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setDebts([]);
        } finally {
            setLoading(false);
        }
    }, [fetchPatientsByIds]);

    // Asignar la función al ref para evitar dependencias circulares
    useEffect(() => {
        fetchDebtReportRef.current = fetchDebtReport;
    }, [fetchDebtReport]);

    // Función para buscar pacientes (sin dependencias problemáticas)
    const fetchPatients = useCallback(async () => {
        if (!debouncedSearchQuery.trim()) {
            setPatients([]);
            return;
        }

        try {
            setSearchLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: '1',
                limit: '10',
                search: debouncedSearchQuery,
            });

            const response = await fetch(`/api/patients?${queryParams}`);
            
            if (!response.ok) {
                throw new Error('Error al cargar los pacientes');
            }
            
            const data: PatientResponse = await response.json();
            setPatients(data.data);

            // Agregar al cache
            setPatientsCache(prev => {
                const newCache = new Map(prev);
                data.data.forEach(patient => {
                    if (patient.idpaciente) {
                        newCache.set(patient.idpaciente, patient);
                    }
                });
                return newCache;
            });

        } catch (err) {
            console.error('Error fetching patients:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setPatients([]);
        } finally {
            setSearchLoading(false);
        }
    }, [debouncedSearchQuery]);

    // Effect para buscar pacientes cuando cambia la query
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    // Función para limpiar búsqueda de pacientes
    const clearPatientSearch = useCallback(() => {
        setSearchQuery('');
        setPatients([]);
        setSelectedPatient(null);
    }, []);

    // Función wrapper para fetchDebtReport que usa el ref
    const fetchDebtReportWrapper = useCallback((patientId: number | null) => {
        if (fetchDebtReportRef.current) {
            return fetchDebtReportRef.current(patientId);
        }
        return Promise.resolve();
    }, []);

    return {
        debts,
        loading,
        error,
        searchQuery,
        patients,
        searchLoading,
        selectedPatient,
        setSearchQuery,
        setSelectedPatient,
        fetchDebtReport: fetchDebtReportWrapper,
        clearPatientSearch,
        clearPatientsCache: () => setPatientsCache(new Map()),
    };
};