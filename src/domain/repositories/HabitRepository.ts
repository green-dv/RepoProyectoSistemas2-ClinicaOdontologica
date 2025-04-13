import { Habit } from "@/domain/entities/Habits";
export interface IHabitRepository {
    fetchAll(query: string, showDisabled: boolean): Promise<Habit[]>;
    getById(id: number): Promise<Habit>;
    create(habit: Habit): Promise<Habit>;
    update(id: number, habit: Habit): Promise<Habit>;
    delete(id: number): Promise<void>;
    restore(id: number): Promise<void>;
    deletePermanently(id: number): Promise<void>;
}
