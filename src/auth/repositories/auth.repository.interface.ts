import { User } from '@prisma/client'
import { CreateUserSchema } from '../schema/create-user.schema'

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  emailExists(email: string): Promise<boolean>
  create(data: CreateUserSchema): Promise<User>
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY')
