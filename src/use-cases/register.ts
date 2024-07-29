import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

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
        throw new Error('E-mail already exists')
    }

    await prisma.user.create({
        data: {
            name,
            email,
            passord_hash,
        },
    });
}
