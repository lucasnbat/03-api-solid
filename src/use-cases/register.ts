import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

/* Isso é tipo o service */
export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  /* O round é o número que vai dentro do hash()
   * Basicamente é quantidade de vezes que a senha
   * vai ser "re-hashada" para criar o hash do hash,
   * e o hash do hash do hash...
   */
  const passord_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('E-mail already exists');
  }

  /* Isso... é o service do service kkk */
  const prismaUserRepository = new PrismaUsersRepository();

  prismaUserRepository.create({
    name,
    email,
    passord_hash
  })
}
