import { Treatment } from "@/domain/entities/Treatments";
import { Patient } from "@/domain/entities/Patient";

export const fetchTreatments = async (query: string, showDisabled: boolean): Promise<Treatment[]> => {
    const endpoint = showDisabled 
        ? `/api/treatments/disable?q=${query}` 
        : `/api/treatments?q=${query}`;

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Error al cargar tratamientos");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

export const fetchPatients = async (query: string): Promise<Patient[]> => {
    if (!query.trim()) return [];

    const queryParams = new URLSearchParams({
        page: "1",
        limit: "10",
        search: query,
    });

    const response = await fetch(`/api/patients?${queryParams}`);

    if (!response.ok) throw new Error("Error al cargar pacientes");

    const data = await response.json();
    return data?.data || [];
};
