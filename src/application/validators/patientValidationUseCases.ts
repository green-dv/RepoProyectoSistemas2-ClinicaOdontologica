// @/application/usecases/validation/PatientValidationUseCase.ts
import { Patient } from '@/domain/entities/Patient';
import { PatientValidator, PatientValidationResult } from '@/domain/validation/PatientValidator';

export interface PatientValidationUseCase {
    validateForCreation(patient: Omit<Patient, 'idpaciente'>): Promise<PatientValidationResult>;
    validateForUpdate(patient: Patient): Promise<PatientValidationResult>;
    validateField(fieldName: keyof Patient, value: unknown): Promise<string | null>;
    validateDuplicate(
        patient: Partial<Patient>, 
        existingPatients: Patient[], 
        excludeId?: number
    ): Promise<string | null>;
}

export class PatientValidationUseCaseImpl implements PatientValidationUseCase {
  
    /**
     * Valida un paciente para creación
     */
    async validateForCreation(patient: Omit<Patient, 'idpaciente'>): Promise<PatientValidationResult> {
        try {
        // Validaciones básicas de dominio
        const basicValidation = PatientValidator.validateForCreation(patient);
        
        if (!basicValidation.isValid) {
            return basicValidation;
        }

        // Validaciones de negocio adicionales
        const businessValidation = await this.performBusinessValidations(patient);
        
        if (!businessValidation.isValid) {
            return {
            isValid: false,
            errors: {
                ...basicValidation.errors,
                ...businessValidation.errors
            }
            };
        }

        return {
            isValid: true,
            errors: {} as Record<keyof Patient, string>
        };
        
        } catch (error) {
        console.error('Error en validación de creación:', error);
        return {
            isValid: false,
            errors: { nombres: 'Error interno de validación' } as Record<keyof Patient, string>
        };
        }
    }

    /**
     * Valida un paciente para actualización
     */
    async validateForUpdate(patient: Patient): Promise<PatientValidationResult> {
        try {
        // Validaciones básicas de dominio
        const basicValidation = PatientValidator.validateForUpdate(patient);
        
        if (!basicValidation.isValid) {
            return basicValidation;
        }

        // Validaciones de negocio adicionales
        const businessValidation = await this.performBusinessValidations(patient, patient.idpaciente);
        
        if (!businessValidation.isValid) {
            return {
            isValid: false,
            errors: {
                ...basicValidation.errors,
                ...businessValidation.errors
            }
            };
        }

        return {
            isValid: true,
            errors: {} as Record<keyof Patient, string>
        };
        
        } catch (error) {
        console.error('Error en validación de actualización:', error);
        return {
            isValid: false,
            errors: { nombres: 'Error interno de validación' } as Record<keyof Patient, string>
        };
        }
    }

    /**
     * Valida un campo específico
     */
    async validateField(fieldName: keyof Patient, value: unknown): Promise<string | null> {
        try {
        return PatientValidator.validateField(fieldName, value);
        } catch (error) {
        console.error(`Error validando campo ${fieldName}:`, error);
        return 'Error de validación';
        }
    }

    /**
     * Valida duplicados
     */
    async validateDuplicate(
        patient: Partial<Patient>, 
        existingPatients: Patient[], 
        excludeId?: number
    ): Promise<string | null> {
        try {
        return PatientValidator.validateDuplicate(patient, existingPatients, excludeId);
        } catch (error) {
        console.error('Error validando duplicados:', error);
        return 'Error al validar duplicados';
        }
    }

    /**
     * Validaciones de negocio específicas
     */
    private async performBusinessValidations(
        patient: Partial<Patient>, 
        excludeId?: number
    ): Promise<PatientValidationResult> {
        const errors: Record<string, string> = {};

        if (patient.fechanacimiento) {
        const birthDate = new Date(patient.fechanacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        let actualAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            actualAge = age - 1;
        }

        if (actualAge < 0) {
            errors.fechanacimiento = 'La fecha de nacimiento no puede ser futura';
        }
        }

        if (patient.estadocivil === 'Viudo/a' && patient.fechanacimiento) {
        const birthDate = new Date(patient.fechanacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 15) {
            errors.estadocivil = 'Estado civil inconsistente con la edad';
        }
        }
        if (patient.telefonopersonal && patient.telefonodomicilio) {
        if (patient.telefonopersonal.trim() === patient.telefonodomicilio.trim()) {
            errors.telefonodomicilio = 'Los teléfonos personal y domicilio no pueden ser iguales';
        }
        }


        return {
        isValid: Object.keys(errors).length === 0,
        errors: errors as Record<keyof Patient, string>
        };
    }
}

export const createPatientValidationUseCase = (): PatientValidationUseCase => {
    return new PatientValidationUseCaseImpl();
};