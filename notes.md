# App

GymPass style app.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível usuário obter seu histórico de check-ins;
- [x] Deve ser possível usuário buscar academias próximas;
- [x] Deve ser possível usuário buscar academias pelo nome;
- [x] Deve ser possível usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia.

## RNs (Regras de negócio)

- [x] Usuário não deve poder se cadastrar com e-mail duplicado;
- [x] Usuário não deve poder fazer 2 check-ins no mesmo dia;
- [x] Usuário não deve poder fazer check-ins se não estiver perto (100m) da academia;
- [x] Check-in só deve poder ser validado até 20 minutos após criado;
- [ ] Check-in só deve poder ser validado por administradores;
- [ ] Academia só deve poder ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] Senha do usuário deve estar criptografada;
- [x] Os dados da aplicação devem estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados devem estar paginadas com 20 items por página; 
- [ ] O usuário deve ser identificado por um JWT (Json Web Token);
  
# Configuração 

## Instalações iniciais

- `npm i typescript @types/node tsx tsup -D` = instala TS, tipagem do node, utilitário de execução de arquivos ts e o tsup para geração de builds em JS a partir do TS;
- `npx tsc --init` = gera tsconfig.json => depois muda para es2020 no arquivo;
- `npm i fastify`
- criação de app.ts e server.ts
- .npmrc (save-exact=true) -> config para versão de dependencia instaladas fique fixa no package.json
  - Isso deixa as depedencias fixas no package.json
  - Usando isso podemos usar bots de github como renovate que é um bot para tentar atualizar algumas dependecias especificas, ele atualiza, roda os testes automaticamente, e caso os testes passem, ele cria uma pull request para nós atualizarmos;
- `npm i dotenv`
- `npm i zod`
- `npm i eslint @rocketseat/eslint-config -D` = config. eslint da rocket

### Configuração de scripts importantes

- `"start:dev": "tsx watch src/server.ts"` = script para compilar o codigo js para ts em produção e ficar vigiando mudanças; (DEV)
- `"build": "tsup src --out-dir build"` = script para gerar build do codigo ts para js numa pasta "build" (PRODUÇÃO)
- `"start": "node build/server.js"` = script para iniciar o código diretamente com node na pasta build (PRODUÇÃO)

### Config prettier/eslint

- `npm install --save-dev eslint prettier eslint-plugin-prettier eslint-config-prettier` 
- Crie o .eslintrc.json colocando o eslint-config desejado em extends;
- No .prettierrc você coloca as config desejadas. Para es2020 é   "trailingComma": "all"
- Adicione um script para formatar lá no package.json: `"format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}'"`

### Configuração de alias de importação

- No seu tsconfig.json...

  > "baseUrl": "./", /* Specify the base directory to resolve non-relative module names. */
  >    "paths": {
  >      "@/*": [
  >        "./src/*"
  >      ]
  >    }, /* Specify a set of entries that re-map imports to >additional lookup locations. */

- Setup completo.

# Construção do App

## Prisma

- `npx prisma init`  = cria o prisma/schema.prisma
- Um @ configura um campo, dois @ são configs de tabelas;
- Existe além do uuid() com cuid() (um uuid mais curto)
- uuid() = mais segurança para gerar rotas impossível de conseguir acessar outro recurso mudando o id na url
- `npx prisma generate`: gera os tipos para o TS entender que existe as tabelas do prisma. Ele gera um tipo "User" referente à sua tabela User; além disso, gera os metodos findUnique, etc;
- `npm i @prisma/client`: dependeica de produção, usada para ACESSAR o banco (prismaClient)

## Docker

- Criar um ambiente com dados de forma que, se não precisar mais dele, você simplesmente mata esse ambiente;
  - Ele não precisa criar os SO
  - Ele funciona em qualquer SO
  - Não compromete sua máquina
  - Simplesmente tem o contexto com as ferramentas que funciona
- E pronto, você não tem seu computador pessoal contaminado com dependencias de banco, ferramentas, etc;
- `docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5432:5432 bitnami/postgresql`
  - 5432:5432 -> quando porta 5432 do postgres (esquerda) ser ligada na porta 5432 da minha maquina (direita)
  - parâmetros -e são para passar as variaveis ambiente para criar user, password e database
  - `docker ps` = mostra todos containers ativos
  - `docker ps -a` = mostra todos os containers, mesmo inativos 
  - `docker rm <nome-do-container>` = deleta 
- `docker compose up -d` para criar os containers a partir de um docker-compose da aplicação
- `docker compose down` delete TODOS CONTAINERS E SEUS DADOS
- `docker compose stop` só para os containers

## Prosseguindo

- `npx prisma migrate deploy`: só aplica direto as migrations existentes

## Relacionamentos

- 1 - 1 = um dado se relaciona apeans com um unico dado de outra, isso poderia estar na mesma tabela mas pode ser separado;
- 1 - N = um dado pode relacionar com varios de outra tabela (1 usuário - Vários checkins)
- N - N = uma dado pode ter associação a varios dados de outra tabela e essa tabela pode ter dado com vários dados da inicial associados;

## Hash de senhas e validações

- npm i bcryptjs
- npm i bcryptjs -D @types/bcryptjs

## Vantagens do Repository Pattern

- Isso isola os códigos de prisma para os repositórios.
- Se você quiser mudar futuramente,de ORM, você só vai precisar
  mexer nos repositórios;

## Testes

- `npm i vitest -D`
- `npm i vitest-tsconfig-paths -D` => plugin para vitest entender nossos rootPaths do tsconfig
- Adicione esses dois scripts ao package.json: `"test": "vitest run", "test:watch": "vitest",`
  - O vitest run apenas executa os testes e para. O vitest sem run fica observando mudanças e dispara os testes a cada nova mudança

## Cobertura de testes

- Insira esse script no package.json:`"test:coverage": "vitest run --coverage",`
- Ao rodar vai criar uma pasta /coverage/ que vai ter um index.html
  - Ao abrir esse index.html, você vai ver um gráfico de quanto % os arquivos foram cobertos. Foque nos que você está testando;
- UI do Vitest: npm i -D @vitest/ui

## Esclarecendo interação UsersRep x PrismaUsersRep x Register

- register.ts (RegisterUseCase) é o arquivo que contém as regras de negócio do que fazer com o banco; ele recebe uma instância de PrismaUsersRep para usar as ferramentas do prisma para realizar as op. da regra de negócio;
- PrismaUsersRep é um repositório que contém a regra da regra de negócio. Ele faz as op. que o register.ts diz usando a sintaxe e ferramentas do Prisma. O motivo dele existir é para concentrar as lógicas de Prisma em apenas um arquivo facilmente substituível por outro caso necessário; poderia ser SequelizeUsersRep, etc;
- UsersRep é apenas o arquivo que tipa o PrismaUsersRep ou qualquer outro arquivo que concentra regras para falar com uma certa ferramenta como knex.js, TypeORM, Sequelize, etc;
- Conceitos usados até o momento: Inversão de Dependência (SOLID); Factorys (Creation Design Pattern) 

## TDD -> Test Driven Development

- Se você desenvolve o teste de uma regra de negócio, antes de implementar o teste ajuda a validar se a implementação funciona ou não;
- Etapas:
  - Red State: erro not teste, vemos que o app não funciona já como esperado; faça testes unitários específicos;
  - Green State: faço funcionar com o mínimo de código;
  - Refactoring: reescrever da forma correta;
- Mocking de datas: datas fictícias para testes
  - Vitest utiliza vi.useFakeTimers()
- `npm i dayjs`: biblioteca usada na validação de checkin no mesmo dia;

## Formas de autenticação

- **Basic Auth**: envia credenciais do usuário em cada cabeçalho de cada requisição;
  - Usa base64 para cifrar e decifrar dados;
  - Cabeçalho que leva isso é o Authorization;
  - Não usado porque:
    - Não é muito seguro transitar credenciais em cada requisição;
    - Fazer interceptação na requisição pode possibilitar roubar as credenciais;
- **JWT**: envia credenciais apenas no /login, backend valida se credenciais são válidas e, se
   sim, backend gera um token único e imutável (stateless token)
  - stateless = não armazenado em nenhuma estrutura de persistência de dados (banco de dados)
  - usa palavra chave ao gerar token
    - quando vai dificil melhor, é uma string (tipo 'ahdsfjkafjk');
  - podemos usar essa chave para decifrar o token e extrair as informações originais;
  - como apenas o backend tem a chave, só ele pode criar tokens válidos;
  - composição:
    - header/cabeçalho: qual algoritmo foi usado para criar o token (hs56, rs256, rsa256, que podem inclusive usar até duas chaves);
    - payload: qualquer informação desejada pelo usuário. Ex: sub(id), name, email...;
    - sign/assinatura: o que o backend gera de único. Pode até haver mudanças no paysload (de id de usuário por ex), mas o backend vai validar se o sign foi ele que gerou inicialmente e vai barrar;
- Você não coloca caso de uso de autenticação; 
  - Os casos de uso são as formas mais puras da aplicação, lógicas independentes;
- Tem módulo de JWT para fastify
  - `npm i @fastify/jwt`

## Testes E2E

- Precisam bater no BD para que nós possamos simular bem as ações do usuário;
- Um teste não pode interferir no outro (fazer fatias isoladas para testes, switch de testes, algo assim)
- Ambientes de testes são possíveis para criar variaveis .env especificos (de banco, até migrations, etc)
- ir na pasta prisma, criar uma pasta de enviromnet e criar com `npm init -y`
- Depois, basta configurar a função Environment no prisma-test-environment;
- Depois, no vite.config.ts, você configura quais arquivos vão usar o referido ambiente de edesenvolvimento (no caso, o nome dele é prisma)
- vá na pasta vitest-environment-prisma e dê um `npm link` para cirar um rep local;
- Depois volta na pasta geral do projeto e da um `npm link vitest-environment-prisma` para você conseguir rodar a configuração de ambientes que você fez rodar globalmente;