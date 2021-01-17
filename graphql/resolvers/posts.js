const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found.");
        }
      } catch (err) {
        throw new Error("myError:", err);
      }
    },
  },

  Mutation: {
    async createPost(parent, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") throw new Error("Post body cannot be empty");

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },

    async deletePost(parent, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError(`Action not allowed`);
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async createComment(parent, { postId, body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: { body: "comment cannot be empty" },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        await post.save();

        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    async deleteComment(parent, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },

    async likePost(parent, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //post is unliked, like it
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
