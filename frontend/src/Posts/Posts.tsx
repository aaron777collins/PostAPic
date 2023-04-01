import * as React from "react";
import Post, { IPostProps } from "../Post/Post";
import { Box, Grid } from "@mui/material";

export interface IPostsProps {
  posts: IPostProps[];
}

export default function Posts(props: IPostsProps) {
  if (props.posts.length === 0) {
    return <h1>No posts found</h1>;
  } else {
    return (
      <div>
        {props.posts.map((post, index) => (
          <Grid item xs={12} key={index} sx={{ margin: "0 auto" }}>
            <Post {...post} />
            <Box mt={2} />
          </Grid>
        ))}
      </div>
    );
  }
}
