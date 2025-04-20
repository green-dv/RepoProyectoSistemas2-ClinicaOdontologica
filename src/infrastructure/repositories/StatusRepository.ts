import { Status } from '@/domain/entities/Status';
import { IStatusRepository } from '@/domain/repositories/StatusRepository';

export class StatusRepository implements IStatusRepository{
  async fetchAll(): Promise<Status[]> {
      const endpoint = '/api/status/';

      const res = await fetch(endpoint);

      if(!res.ok) throw new Error('Error al cargar los estados de citas');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
  }
  async getById(id: number): Promise<Status> {
    const endpoint = `/api/status/${id}`;

    const res = await fetch(endpoint);

    if(!res.ok) throw new Error('Error al cargar los estados de citas');

    return await res.json();
  }
}
export const statusRepository = new StatusRepository();