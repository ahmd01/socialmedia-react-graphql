import React from "react";
import { Form, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../utils/hooks";
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from "../utils/graphql";

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    onError(err) {
      console.log("PostForm err", err);
    },
    variables: values,
  });

  function createPostCallback() {
    createPost();
    values.body = "";
  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create Post</h2>
      <Form.Field>
        <Form.Input
          placeholder="what's in you're mind?"
          name="body"
          onChange={onChange}
          value={values.body}
        />
        <Button type="submit" color="teal">
          Post
        </Button>
      </Form.Field>
    </Form>
  );
}
