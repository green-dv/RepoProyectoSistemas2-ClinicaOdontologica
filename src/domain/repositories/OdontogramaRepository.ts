import { Odontogram, CreateOdontogram } from "@/domain/entities/Odontogram"
import { OdontogramDescription, OdontogramDescriptionDTO } from "@/domain/entities/OdontogramDescription"

export interface OdontogramaRepository{
  getOdontograms(page: number, limit: number, idpaciente: number, searchQuery?: string): Promise<Odontogram[] | null>;
  getOdontogramByConsultationId(consultationId: number): Promise<Odontogram | null>;
  getDescriptions(idodontograma: number): Promise<OdontogramDescription[]>;
  getLastOdontogramPerPatientId(patientId: number): Promise<Odontogram | null>;
  createOdontogram(odontogram: CreateOdontogram ): Promise<Odontogram | null>;
  //description
  addDescription(descripcion: OdontogramDescriptionDTO): Promise<OdontogramDescriptionDTO | null>;
  removeDescription(idOdontograma: number,idCara: number, idPieza: number,  iddiagnostico: number): Promise<OdontogramDescription | null>;
}