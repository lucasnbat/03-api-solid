/* eslint-disable prettier/prettier */
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { title } from 'process'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready() //evento emitido para aguradar app inicializar
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
          title: 'JS Gym',
          description: 'Test',
          phone: '66998897766',
          latitude: -12.5566976,
          longitude: -55.7187072,
        })

      expect(response.statusCode).toEqual(201)
  })
})
