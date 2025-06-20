import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";
import { OdontogramDescriptionDTO } from "@/domain/entities/OdontogramDescription";
import { CreateOdontogram, Odontogram } from "@/domain/entities/Odontogram";
export class CreateOdontogramUseCase {
    constructor(private odontogramRepository: OdontogramaRepository) {}

    async execute(odontogram: Odontogram): Promise<CreateOdontogram | null> {
      const createOdontogram: CreateOdontogram = {
        idpaciente: odontogram.idpaciente,
        idconsulta: odontogram.idconsulta,
        fechacreacion: new Date(),
        observaciones: odontogram.observaciones
      } 

      console.log('Imprimiendo odontograma desde los use cases');
      console.log(createOdontogram);
      const newOdontogram = await this.odontogramRepository.createOdontogram(createOdontogram);

      odontogram.descripciones.forEach(descripcion => {
        const description: OdontogramDescriptionDTO = {
          idodontograma: odontogram.idodontograma,
          idpieza: descripcion.idpieza,
          iddiagnostico: descripcion.iddiagnostico,
          idcara: descripcion.idcara
        };
        console.log('Imprimiendo descripciones desde los use cases');
        console.log(descripcion);
        this.odontogramRepository.addDescription(description);
      });
      
      return newOdontogram;
    }
}
