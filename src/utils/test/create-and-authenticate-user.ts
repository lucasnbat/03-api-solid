import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'


export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false) {
  await prisma.user.create({
    data: {
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      passord_hash: await hash('123123', 6), // escrevi errado no schema.prisma
      role: isAdmin ? 'ADMIN' : 'MEMBER'
    }
  })
  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'johndoe@example.com',
      password: '123123'
    })

  const { token } = authResponse.body

  return {
    token
  }
}