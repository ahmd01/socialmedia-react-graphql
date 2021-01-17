import React, {useContext} from "react";
import {  useQuery } from "@apollo/client";

import {AuthContext} from '../context/auth'
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from '../components/PostForm';
import {FETCH_POSTS_QUERY} from '../utils/graphql';


function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const context = useContext(AuthContext);


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
        {context.user&& (
          <Grid.Column>
            <PostForm  />
          </Grid.Column>
        )}
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
