/* eslint-disable prettier/prettier */
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { title } from 'process'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready() //evento emitido para aguradar app inicializar
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'Test',
        phone: '66998897766',
        latitude: -12.4518704,
        longitude: -55.8152667,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS Gym',
        description: 'Test',
        phone: '66998897766',
        latitude: -12.5566976,
        longitude: -55.7187072,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -12.5566976,
        longitude: -55.7187072,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TS Gym'
      })
    ])
  })
})
