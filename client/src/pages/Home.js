import React from "react";
import { gql, useQuery } from "@apollo/client";

import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  let posts;

  if (loading) {
    return <h1>Loading posts...</h1>;
  }

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {data.getPosts.map((post) => (
          <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
            <PostCard post={post} />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
