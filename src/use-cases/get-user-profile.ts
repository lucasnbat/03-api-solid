import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    /* 
     * PrismaUsersRep é o local onde tem todas as funções 
    para lidar com usuários (findByEmail, create...) 
     * O UsersRepository é o tipo que tipa o PrismaUsersRepository 
     */
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
