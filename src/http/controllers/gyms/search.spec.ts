/* eslint-disable prettier/prettier */
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { title } from 'process'

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready() //evento emitido para aguradar app inicializar
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Test',
        phone: '66998897766',
        latitude: -12.5566976,
        longitude: -55.7187072,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Test',
        phone: '66998897766',
        latitude: -12.5566976,
        longitude: -55.7187072,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      })
    ])
  })
})
