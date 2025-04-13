import { Habit, HabitDTO } from "@/domain/entities/Habits";
import { habitRepository } from "@/infrastructure/repositories/HabitRepository";

export const fetchHabits = async (query: string, showDisabled: boolean): Promise<Habit[]> => {
  return await habitRepository.fetchAll(query, showDisabled);
};

export const createHabit = async (habit: HabitDTO): Promise<Habit> => {
  const trimmedHabit = {
    habito: habit.habito
  };

  if (!trimmedHabit.habito) {
    throw new Error('La descripción es obligatoria');
  }

  return await habitRepository.create(trimmedHabit);
};

export const updateHabit = async (id: number, habit: HabitDTO): Promise<Habit> => {
  const trimmedHabit = {
    habito: habit.habito
  };

  if (!trimmedHabit.habito) {
    throw new Error('La descripción es obligatoria');
  }

  return await habitRepository.update(id, trimmedHabit);
};

export const deleteHabit = async (id: number): Promise<void> => {
  await habitRepository.delete(id);
};

export const restoreHabit = async (id: number): Promise<void> => {
  await habitRepository.restore(id);
};

export const deleteHabitPermanently = async (id: number): Promise<void> => {
  await habitRepository.deletePermanently(id);
};