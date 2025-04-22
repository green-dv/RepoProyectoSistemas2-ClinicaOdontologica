import { User } from "@/domain/entities/user";

export interface IUserRepository {
  changeUserPassword(email: string, password: string): Promise<boolean>;
  sendVerificationCode(email: string, code: number): Promise<boolean>;
}