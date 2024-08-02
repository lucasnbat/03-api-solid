import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

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

    if(!user) {
      throw new InvalidCredentialsError();
    }
    
    const doesPassordMatches = await compare(password, user.passord_hash)

    if (!doesPassordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    }

  }
}