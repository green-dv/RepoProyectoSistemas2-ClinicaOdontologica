// @/hooks/useOdontogramData.ts
/*import { useState } from 'react';
import { Odontogram } from '@/domain/entities/Odontogram';
import { OdontogramDescription } from '@/domain/entities/OdontogramDescription';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import { Diente, CaraDiagnostico ,DentalState, EstadoCara} from '@/presentation/config/odontogrmaConfig';

export interface OdontogramDataState {
  currentOdontogram: Odontogram | null;
  descriptions: OdontogramDescription[];
  diagnosis: Diagnosis[];
  dentalStates: DentalState;
  selectedTooth: Diente | null;
  
  // Setters
  setCurrentOdontogram: React.Dispatch<React.SetStateAction<Odontogram | null>>;
  setDescriptions: React.Dispatch<React.SetStateAction<OdontogramDescription[]>>;
  setDiagnosis: React.Dispatch<React.SetStateAction<Diagnosis[]>>;
  setDentalStates: React.Dispatch<React.SetStateAction<DentalState>>;
  setSelectedTooth: React.Dispatch<React.SetStateAction<Diente | null>>;
  
  // Helpers
  buildDentalStatesFromDescriptions: (descriptions: OdontogramDescription[]) => DentalState;
  buildToothFromDescriptions: (codigofdi: number, descriptions: OdontogramDescription[]) => Diente;
  getEstadoFromDiagnosis: (iddiagnostico: number, diagnosis: Diagnosis[]) => string;
}

export default function useOdontogramData(): OdontogramDataState {
  const [currentOdontogram, setCurrentOdontogram] = useState<Odontogram | null>(null);
  const [descriptions, setDescriptions] = useState<OdontogramDescription[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [dentalStates, setDentalStates] = useState<DentalState>({});
  const [selectedTooth, setSelectedTooth] = useState<Diente | null>(null);

  const getEstadoFromDiagnosis = (iddiagnostico: number, diagnosis: Diagnosis[]): string => {
    const diagnostic = diagnosis.find(d => d.iddiagnostico === iddiagnostico);
    if (!diagnostic) return 'sano';
    
    // Mapear según la descripción del diagnóstico
    const descripcion = diagnostic.descripcion.toLowerCase();
    if (descripcion.includes('caries')) return 'caries';
    if (descripcion.includes('obturado') || descripcion.includes('amalgama')) return 'obturado';
    if (descripcion.includes('corona')) return 'corona';
    if (descripcion.includes('extraccion')) return 'extraccion';
    if (descripcion.includes('ausente')) return 'ausente';
    
    return 'sano';
  };

  const buildDentalStatesFromDescriptions = (descriptions: OdontogramDescription[]): DentalState => {
    const states: DentalState = {};
    
    descriptions.forEach(desc => {
      if (!states[desc.codigofdi]) {
        states[desc.codigofdi] = {
          vestibular: 'sano',
          mesial: 'sano',
          lingual: 'sano',
          distal: 'sano',
          oclusal: 'sano'
        };
      }
      
      const caraNombre = desc.cara.toLowerCase();
      const estado = getEstadoFromDiagnosis(desc.iddiagnostico, diagnosis);
      
      // Mapear nombres de caras
      if (caraNombre === 'vestibular') {
        states[desc.codigofdi].vestibular = estado as EstadoCara;
      } else if (caraNombre === 'mesial') {
        states[desc.codigofdi].mesial = estado as EstadoCara;
      } else if (caraNombre === 'lingual' || caraNombre === 'palatino') {
        states[desc.codigofdi].lingual = estado as EstadoCara;
      } else if (caraNombre === 'distal') {
        states[desc.codigofdi].distal = estado as EstadoCara;
      } else if (caraNombre === 'oclusal' || caraNombre === 'incisal') {
        states[desc.codigofdi].oclusal = estado as EstadoCara;
      }
    });
    
    return states;
  };

  const buildToothFromDescriptions = (codigofdi: number, descriptions: OdontogramDescription[]): Diente => {
    const toothDescriptions = descriptions.filter(desc => desc.codigofdi === codigofdi);
    const toothName = toothDescriptions.length > 0 ? toothDescriptions[0].nombrepieza : `Pieza ${codigofdi}`;
    
    const caras: CaraDiagnostico[] = toothDescriptions.map(desc => ({
      id: desc.idcara,
      nombre: desc.cara,
      diagnostico: diagnosis.find(d => d.iddiagnostico === desc.iddiagnostico) || {
        iddiagnostico: desc.iddiagnostico,
        descripcion: 'Diagnóstico desconocido',
        enlaceicono: ''
      }
    }));

    return {
      id: codigofdi, 
      codigofdi,
      nombre: toothName,
      caras
    };
  };

  return {
    currentOdontogram,
    descriptions,
    diagnosis,
    dentalStates,
    selectedTooth,
    
    setCurrentOdontogram,
    setDescriptions,
    setDiagnosis,
    setDentalStates,
    setSelectedTooth,
    
    buildDentalStatesFromDescriptions,
    buildToothFromDescriptions,
    getEstadoFromDiagnosis
  };
}*/