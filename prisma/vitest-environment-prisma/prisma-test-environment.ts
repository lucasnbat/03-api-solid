/* eslint-disable prettier/prettier */
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

//postgresql://docker:docker@localhost:5432/apisolid?schema=public

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  // substitui o atributo schema com nossa var schema do banco de testes
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment><unknown>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // gera novo schema
    const schema = randomUUID()

    // cria nova url de BD & novo BD
    const databaseURL = generateDatabaseURL(schema)

    // sobrescreve o BD operante para o novo BD de testes
    process.env.DATABASE_URL = databaseURL

    // executa comando de terminal para abrir pasta migrations e executar
    // o deploy diferente do dev não vai verfiicacr alterações, só executa migrations
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        )
        await prisma.$disconnect()

        console.log('Apagou!!')
      },
    }
  },
}
