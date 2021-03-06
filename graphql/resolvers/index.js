const postsResolvers = require("./posts");
const userResolvers = require("./user");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
