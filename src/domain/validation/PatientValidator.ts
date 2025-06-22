import { Patient } from '@/domain/entities/Patient';
import { PatientValidationRules, ValidationResult} from './PatientValidationRules';
import {PatientFieldKey} from '@/domain/validation/PatientValidationRules'
export interface PatientValidationError {
  field: keyof Patient;
  message: string;
}

export interface PatientValidationResult extends ValidationResult {
  errors: Record<keyof Patient, string>;
}

export class PatientValidator {
    /**
     * Valida un campo específico del paciente
     */
    static validateField(fieldName: keyof Patient, value: unknown): string | null {
        const stringValue = String(value || '');
        
        switch (fieldName) {
        case 'nombres':
            return PatientValidationRules.validateField('nombres', stringValue);
        case 'apellidos':
            return PatientValidationRules.validateField('apellidos', stringValue);
        case 'telefonopersonal':
            return PatientValidationRules.validateField('telefonopersonal', stringValue);
        case 'telefonodomicilio':
            return PatientValidationRules.validateField('telefonodomicilio', stringValue);
        case 'direccion':
            return PatientValidationRules.validateField('direccion', stringValue);
        case 'lugarnacimiento':
            return PatientValidationRules.validateField('lugarnacimiento', stringValue);
        case 'fechanacimiento':
            return PatientValidationRules.validateField('fechanacimiento', stringValue);
        case 'estadocivil':
            return PatientValidationRules.validateField('estadocivil', stringValue);
        case 'ocupacion':
            return PatientValidationRules.validateField('ocupacion', stringValue);
        case 'aseguradora':
            return PatientValidationRules.validateField('aseguradora', stringValue);
        case 'sexo':
            return this.validateSexo(value as boolean);
        case 'habilitado':
            return this.validateHabilitado(value as boolean);
        default:
            return null;
        }
    }

    /**
     * Valida el campo sexo (boolean)
     */
    private static validateSexo(value: boolean): string | null {
        if (typeof value !== 'boolean') {
        return 'El sexo debe ser un valor válido';
        }
        return null;
    }

    /**
     * Valida el campo habilitado (boolean)
     */
    private static validateHabilitado(value: boolean): string | null {
        if (typeof value !== 'boolean') {
        return 'El estado habilitado debe ser un valor válido';
        }
        return null;
    }

    /**
     * Valida todos los campos del paciente
     */
    static validatePatient(patient: Partial<Patient>): PatientValidationResult {
        const errors: Record<string, string> = {};
        
        // Campos requeridos que siempre deben validarse
        const requiredFields: (keyof Patient)[] = [
        'nombres',
        'apellidos',
        'telefonopersonal',
        'direccion',
        'fechanacimiento',
        'estadocivil'
        ];

        // Validar campos requeridos
        for (const field of requiredFields) {
        const error = this.validateField(field, patient[field]);
        if (error) {
            errors[field] = error;
        }
        }

        // Validar campos opcionales solo si tienen valor
        const optionalFields: (keyof Patient)[] = [
        'telefonodomicilio',
        'lugarnacimiento',
        'ocupacion',
        'aseguradora'
        ];

        for (const field of optionalFields) {
        const value = patient[field];
        if (value !== undefined && value !== null && value !== '') {
            const error = this.validateField(field, value);
            if (error) {
            errors[field] = error;
            }
        }
        }

        // Validar campos boolean
        if (patient.sexo !== undefined) {
        const error = this.validateField('sexo', patient.sexo);
        if (error) {
            errors.sexo = error;
        }
        }

        if (patient.habilitado !== undefined) {
        const error = this.validateField('habilitado', patient.habilitado);
        if (error) {
            errors.habilitado = error;
        }
        }

        return {
        isValid: Object.keys(errors).length === 0,
        errors: errors as Record<keyof Patient, string>
        };
    }

    /**
     * Valida si el paciente puede ser creado (validación para creación)
     */
    static validateForCreation(patient: Omit<Patient, 'idpaciente'>): PatientValidationResult {
        // Para creación, no debe tener ID
        const patientData = { ...patient };
        delete (patientData as Partial<Patient>).idpaciente;
        
        return this.validatePatient(patientData);
    }

    /**
     * Valida si el paciente puede ser actualizado (validación para edición)
     */
    static validateForUpdate(patient: Patient): PatientValidationResult {
        // Para actualización, debe tener ID válido
        if (!patient.idpaciente || patient.idpaciente <= 0) {
        return {
            isValid: false,
            errors: { idpaciente: 'ID de paciente inválido para actualización' } as Record<keyof Patient, string>
        };
        }

        return this.validatePatient(patient);
    }

    /**
     * Valida duplicados por nombre completo
     */
    static validateDuplicate(
        patient: Partial<Patient>, 
        existingPatients: Patient[], 
        excludeId?: number
    ): string | null {
        if (!patient.nombres || !patient.apellidos) {
        return null; // Si no hay nombres, la validación básica se encargará
        }

        const fullName = `${patient.nombres.trim().toLowerCase()} ${patient.apellidos.trim().toLowerCase()}`;
        
        const duplicate = existingPatients.find(existing => {
        if (excludeId && existing.idpaciente === excludeId) {
            return false; // Excluir el paciente actual en caso de edición
        }
        
        const existingFullName = `${existing.nombres.trim().toLowerCase()} ${existing.apellidos.trim().toLowerCase()}`;
        return existingFullName === fullName;
        });

        return duplicate ? 'Ya existe un paciente con este nombre y apellido' : null;
    }

    /**
     * Obtiene todas las reglas de validación para un campo específico
     */
    static getFieldRules(fieldName: keyof Patient): string[] {
    const rules = PatientValidationRules.getAllFieldRules();

        if (!this.isValidFieldKey(fieldName)) {
            return [];
        }

        return rules[fieldName].map(rule => rule.message);
    }

    private static isValidFieldKey(field: keyof Patient): field is PatientFieldKey {
    const validKeys: PatientFieldKey[] = [
        'nombres',
        'apellidos',
        'telefonopersonal',
        'telefonodomicilio',
        'direccion',
        'lugarnacimiento',
        'fechanacimiento',
        'estadocivil',
        'ocupacion',
        'aseguradora'
    ];

    return validKeys.includes(field as PatientFieldKey);
    }

    /**
     * Verifica si un campo es requerido
     */
    static isFieldRequired(fieldName: keyof Patient): boolean {
        const requiredFields: (keyof Patient)[] = [
        'nombres',
        'apellidos',
        'telefonopersonal',
        'direccion',
        'fechanacimiento',
        'estadocivil',
        'sexo',
        'habilitado'
        ];
        
        return requiredFields.includes(fieldName);
    }
}