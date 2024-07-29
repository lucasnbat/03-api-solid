import fastify from "fastify";
import { appRoutes } from "./http/routes";

export const app = fastify();

/*
 * esse register abaixo não é a função register, é o
 * termo 'register' usado pelo fastify para registar plugins
 * sim, o routes.ts com appRouter também é plugin do fastify)
 */
app.register(appRoutes);
