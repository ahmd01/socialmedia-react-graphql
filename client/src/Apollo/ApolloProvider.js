import React from "react";
import App from "../App";
// import { createHttpLink } from "apollo-link-http";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';


// const httpLink = createHttpLink({
//   uri: "http://localhost:5000",
// });

const client = new ApolloClient({
  uri: "http://localhost:5000",
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
