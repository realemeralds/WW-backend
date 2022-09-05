import "https://deno.land/std@0.152.0/dotenv/load.ts";
import { Application, Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { typeDefs } from "./Schema/TypeDefs.js";
import { resolvers } from "./Schema/Resolvers.js";

const app = new Application();

app.use(oakCors());

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: typeDefs,
  resolvers: resolvers,
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log(
  `Server start at http://localhost:${Deno.env.get("PORT") || 5000}/graphql`
);
app.listen({ port: 5001 });
