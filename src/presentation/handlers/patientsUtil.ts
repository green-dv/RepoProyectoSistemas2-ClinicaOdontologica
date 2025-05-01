// patientUtils.ts
import debounce from 'lodash/debounce';
import { fetchDateFilter } from '@/application/usecases/patients';
import { Patient } from '@/domain/entities/Patient';


export function createPatientFetcher(
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
) {
  return debounce(async (query: string = '') => {
    try {
      const data = await fetchDateFilter(query, false); // showDisabled siempre false
      setPatients(data);
    } catch (error) {
      console.error('Error al cargar los Pacientes', error);
    }
  }, 300);
}
