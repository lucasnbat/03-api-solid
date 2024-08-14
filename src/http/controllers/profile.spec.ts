/* eslint-disable prettier/prettier */
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready() //evento emitido para aguradar app inicializar
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123'
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123123'
      })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com'
      })
    )
  })

})
