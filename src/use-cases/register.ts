import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

/**
 * Sobre Dependency Inversion (s.o.l.i.D)
 * Antes, esse caso de uso depende do prisma para acessar o banco;
 * Aplicando: ao invés do caso de uso instanciar as dependencias do Prisma,
 * ele vai receber AS DEPENDENCIAS PRISMA como PARÂMETRO
 */

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  /* você poderia deixar que nem o código abaixo se quiser.
   * Fiz na versão resumida que dá na mesma.

   * private usersRepository: any

   * constructor(usersRepository: any) {
   *   this.usersRepository = usersRepository
   * }
   */

  /* Isso é tipo o service */
  async execute({ name, email, password }: RegisterUseCaseRequest) {
    /*
     * O round é o número que vai dentro do hash()
     * Basicamente é quantidade de vezes que a senha
     * vai ser "re-hashada" para criar o hash do hash,
     * e o hash do hash do hash...
     */
    const passord_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      passord_hash,
    })

    /*
     * Como estava antes
     * const prismaUserRepository = new PrismaUsersRepository()

     * prismaUserRepository.create({
     *   name,
     *   email,
     *   passord_hash,
     * })
     */
  }
}
