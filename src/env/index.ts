import 'dotenv/config'
import { z } from 'zod'

/*
 * coerce = converte para o tipo que existe logo apos ele
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

/* console.log no erro e formata ele */
if (_env.success === false) {
  console.log('Invalid environment variables', _env.error.format())

  /* Deixa de executar tudo que vem depois, derruba a app */
  throw Error('Invalid enviroment variables')
}

/*
 * Se deu certo, guarda os dados do process.env que foram para
 * _env e manda para env e exporta ela
 */
export const env = _env.data
