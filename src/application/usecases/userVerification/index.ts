
import { User } from '@/domain/entities/user';
import { userRepository } from '@/infrastructure/repositories/userRepository';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.findUserByEmail(email);
};

export const changeUserPassword = async (email: string, password: string): Promise<boolean> => {
  return await userRepository.changeUserPassword(email, password);
};

export const sendVerificationCode = async (email: string, code: number): Promise<boolean> => {
  return await userRepository.sendVerificationCode(email, code);
}