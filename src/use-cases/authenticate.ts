import { UsersRepository } from "@/repositories/users-repository";

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = void

export class AuthenticateUseCase {
  constructor(
    /* 
     * PrismaUsersRep é o local onde tem todas as funções 
    para lidar com usuários (findByEmail, create...) 
     * O UsersRepository é o tipo que tipa o PrismaUsersRepository 
     */
    private usersRepository: UsersRepository
  ) { }

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)
    
  }
}