const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB_URL } = require("./config");
const typeDefs = require("./graphql/typeDefs");
// for each query, mutation, subscribtion, there's a coresponding resolver that returns the logic
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URL, connectionParams);
mongoose.connection.once("open", () => {
  console.log("connected to DB");
  server.listen({ port: 5000 }).then((res) => {
    console.log(`Server running at ${res.url}`);
  });
});
