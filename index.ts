require("dotenv").config();
import { typeDefs } from "./Schema/TypeDefs";
import { resolvers } from "./Schema/Resolvers";

const { ApolloServer } = require("apollo-server-express");

const express = require("express");
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

async function main() {
  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 5000 }, () => {
    console.log(`server running on port ${process.env.PORT || 5000}`);
  });
}

main();
