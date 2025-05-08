import { useState, useEffect } from 'react';
import { Patient } from '@/domain/entities/Patient';

export function usePatients(search: string, page: number = 1, limit: number = 10) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchPatients = async () => {
      try {
        const res = await fetch(`/api/patients?page=${page}&limit=${limit}`);
        const data = await res.json();
        console.log('data from API', data);

        const filtered = data.data.filter((p: Patient) =>
          `${p.nombres} ${p.apellidos}`.toLowerCase().includes(search.toLowerCase())
        );
        
        
        setPatients(filtered);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [search, page, limit]);

  return { patients, loading };
}
