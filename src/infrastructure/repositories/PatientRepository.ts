import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { PatientsResponse } from '@/application/dtos/PatientResponse';

class PatientRepository {
    static async fetchAll(
        query: string = '', 
        showDisabled: boolean = false,
        page: number = 1,
        limit: number = 10
        ): Promise<PatientsResponse> {
        try {
            const endpoint = showDisabled 
                ? `api/patients/disable?q=${query}&page=${page}&limit=${limit}` 
                : `api/patients?q=${query}&page=${page}&limit=${limit}`;
                
            const response = await fetch(endpoint);
                
            if (!response.ok) {
                throw new Error('Error al obtener los pacientes');
            }
                
            const data = await response.json();
            return {
                data: data.data || [],
                pagination: data.pagination || { 
                page: 1, 
                limit, 
                totalItems: 0, 
                totalPages: 0 
                }
            }; 
        } catch (error) {
            console.error('Error en PatientRepository.fetchAll:', error);
            throw error;
        }
    }
    static async getById(id: number): Promise<Patient> {
        const response = await fetch(`api/patients/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener el paciente');
        }
        
        const data = await response.json();
        return data;
    }
    
    static async create(patient: PatientDTO): Promise<Patient> {
        try {
            const preparedPatient = {
                ...patient,
                sexo: patient.sexo !== undefined ? patient.sexo : true,
                telefonodomicilio: patient.telefonodomicilio || null,
                lugarnacimiento: patient.lugarnacimiento || null,
                aseguradora: patient.aseguradora || null
            };
        
            console.log('Enviando datos al servidor (create):', JSON.stringify(preparedPatient, null, 2));
        
            const response = await fetch(`api/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedPatient),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error de creación:', errorData);
                throw new Error(errorData.message || 'Error al crear paciente');
            }
        
            const data = await response.json();
            return data.patient || data;
        } catch (error) {
            console.error('Error en PatientRepository.create:', error);
            throw error;
        }
    }

    static async update(id: number, patient: PatientDTO): Promise<Patient> {
        try {
            const preparedPatient = {
                ...patient,
                sexo: patient.sexo !== undefined ? patient.sexo : true,
                telefonodomicilio: patient.telefonodomicilio || null,
                lugarnacimiento: patient.lugarnacimiento || null,
                aseguradora: patient.aseguradora || null
            };
        
            console.log('Enviando datos al servidor (update):', JSON.stringify(preparedPatient, null, 2));
        
            const response = await fetch(`api/patients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedPatient),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    throw new Error(`Error de validación: ${errorData.errors.join(', ')}`);
                }
                
                throw new Error(errorData.message || 'Error al actualizar paciente');
            }
        
            const data = await response.json();
            return data.patient || data;
        } catch (error) {
            console.error('Error en PatientRepository.update:', error);
            throw error;
        }
    }

    static async delete(id: number): Promise<void> {
        const response = await fetch(`api/patients/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar paciente');
        }
    }

    static async restore(id: number): Promise<void> {
        const response = await fetch(`api/patients/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'restore' }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al restaurar paciente');
        }
    }

    static async deletePermanently(id: number): Promise<void> {
        const response = await fetch(`api/patients/${id}?type=physical`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar permanentemente el paciente');
        }
    }
}

export const patientRepository = PatientRepository;