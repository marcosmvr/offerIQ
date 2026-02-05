import { Role, User } from '@prisma/client'

export interface CreateUserPersistenceData {
  email: string
  name: string
  passwordHash: string
  role: Role
}
export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  emailExists(email: string): Promise<boolean>
  create(data: CreateUserPersistenceData): Promise<User>
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY')
