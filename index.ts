const { ApolloServer } = require("apollo-server-express");

const express = require("express");
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port: 5000 }, () => {
  console.log("server running on port 5000");
});
