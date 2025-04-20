export interface Habit{
  idhabito: number;
  habito: string;
  habilitado: boolean;
}

export type HabitDTO = Omit<Habit, 'idhabito' | 'habilitado'>;