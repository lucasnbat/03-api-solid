import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcryptjs';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    /* O round é o número que vai dentro do hash()
     * Basicamente é quantidade de vezes que a senha
     * vai ser "re-hashada" para criar o hash do hash,
     * e o hash do hash do hash...
     */
    const passord_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (userWithSameEmail) {
        return reply.status(409).send();
    }

    await prisma.user.create({
        data: {
            name,
            email,
            passord_hash,
        },
    });

    return reply.status(201).send();
}
