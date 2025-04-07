import {Status} from "@/domain/entities/Status";
import {statusRepository} from "@/infrastructure/repositories/StatusRepository";

export const fetchStatus = async (): Promise<Status[]> => {
    try {
        const statuses = await statusRepository.fetchAll();
        return statuses;
    } catch (error) {
        console.error('Error in fetchStatus:', error); // Captura cualquier error
        throw error; // Lanza el error para que el componente lo maneje
    }
};

export const getById = async (id: number): Promise<Status> => {
  return await statusRepository.getById(id);
}