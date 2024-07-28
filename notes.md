# App

GymPass style app.

## RFs (Requisitos funcionais)

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter número de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível usuário obter seu histórico de check-ins;
- [ ] Deve ser possível usuário buscar academias próximas;
- [ ] Deve ser possível usuário buscar academias pelo nome;
- [ ] Deve ser possível usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [ ] Deve ser possível cadastrar uma academia.

## RNs (Regras de negócio)

- [ ] Usuário não deve poder se cadastrar com e-mail duplicado;
- [ ] Usuário não deve poder fazer 2 check-ins no mesmo dia;
- [ ] Usuário não deve poder fazer check-ins se não estiver perto (100m) da academia;
- [ ] Check-in só deve poder ser validado até 20 minutos após criado;
- [ ] Check-in só deve poder ser validado por administradores;
- [ ] Academia só deve poder ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [ ] Senha do usuário deve estar criptografada;
- [ ] Os dados da aplicação devem estar persistidos em um banco PostgreSQL;
- [ ] Todas listas de dados devem estar paginadas com 20 items por página; 
- [ ] O usuário deve ser identificado por um JWT (Json Web Token);
  
# Construção 

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

- 