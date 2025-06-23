import { useState, useEffect, useCallback } from 'react';
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        
        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    const fetchPatientById = useCallback(async (patientId: number): Promise<Patient | null> => {
        // Verificar si ya está en cache
        if (patientsCache.has(patientId)) {
            return patientsCache.get(patientId) || null;
        }

        try {
            const response = await fetch(`/api/patients/${patientId}`);
            if (!response.ok) {
                console.warn(`No se pudo obtener el paciente con ID ${patientId}`);
                return null;
            }
            
            const patient: Patient = await response.json();
            
            // Agregar al cache
            setPatientsCache(prev => new Map(prev).set(patientId, patient));
            
            return patient;
        } catch (err) {
            console.error(`Error al obtener paciente ${patientId}:`, err);
            return null;
        }
    }, [patientsCache]);

    const fetchPatientsByIds = useCallback(async (patientIds: number[]): Promise<Patient[]> => {
        const uniqueIds = [...new Set(patientIds)];
        const uncachedIds = uniqueIds.filter(id => !patientsCache.has(id));
        
        if (uncachedIds.length === 0){
            return uniqueIds.map(id => patientsCache.get(id)).filter(Boolean) as Patient[];
        }

        try {
            const idsParam = uncachedIds.join(',');
            const response = await fetch(`/api/patients/batch?ids=${idsParam}`);
            
            if (response.ok) {
                const fetchedPatients: Patient[] = await response.json();
                
                const newCache = new Map(patientsCache);
                fetchedPatients.forEach(patient => {
                    if (patient.idpaciente) {
                        newCache.set(patient.idpaciente, patient);
                    }
                });
                setPatientsCache(newCache);
                
                return uniqueIds.map(id => newCache.get(id)).filter(Boolean) as Patient[];
            } else {
                const patientPromises = uncachedIds.map(id => fetchPatientById(id));
                const fetchedPatients = await Promise.all(patientPromises);
                
                return uniqueIds.map(id => 
                    patientsCache.get(id) || fetchedPatients.find(p => p?.idpaciente === id)
                ).filter(Boolean) as Patient[];
            }
        } catch (err) {
            console.error('Error al obtener pacientes por lote:', err);
            
            const patientPromises = uncachedIds.map(id => fetchPatientById(id));
            const fetchedPatients = await Promise.all(patientPromises);
            
            return uniqueIds.map(id => 
                patientsCache.get(id) || fetchedPatients.find(p => p?.idpaciente === id)
            ).filter(Boolean) as Patient[];
        }
    }, [patientsCache, fetchPatientById]);

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
            const newCache = new Map(patientsCache);
            data.data.forEach(patient => {
                if (patient.idpaciente) {
                    newCache.set(patient.idpaciente, patient);
                }
            });
            setPatientsCache(newCache);

        } catch (err) {
            console.error('Error fetching patients:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setPatients([]);
        } finally {
            setSearchLoading(false);
        }
    }, [debouncedSearchQuery, patientsCache]);

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
            
            const patientIds = [...new Set(rawData.map(debt => debt.idpaciente))];
            
            const patientsData = await fetchPatientsByIds(patientIds);
            
            const patientsMap = new Map<number, Patient>();
            patientsData.forEach(patient => {
                if (patient.idpaciente) {
                    patientsMap.set(patient.idpaciente, patient);
                }
            });
            
            const enrichedData: debtsByPatient[] = rawData.map(debt => {
                const patient = patientsMap.get(debt.idpaciente);
                return {
                    ...debt,
                    nombres: patient?.nombres || debt.nombres || 'N/A',
                    apellidos: patient?.apellidos || debt.apellidos || 'N/A'
                };
            });
            
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

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const clearPatientSearch = useCallback(() => {
        setSearchQuery('');
        setPatients([]);
        setSelectedPatient(null);
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
        fetchDebtReport,
        clearPatientSearch,
        clearPatientsCache: () => setPatientsCache(new Map()),
    };
};