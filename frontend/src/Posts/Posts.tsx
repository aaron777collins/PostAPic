import * as React from "react";
import Post, { IPostProps } from "../Post/Post";
import { Box, Grid } from "@mui/material";
import { UserType } from "../Types/UserType";

export interface IPostsProps {
  posts: IPostProps[];
  apiURL: string;
  urlExtension: string;
  setLoading: (loading: boolean) => void;
  user: UserType;
  setSnackbarSuccessOpen: (open: boolean) => void;
  setSnackbarSuccessMessage: (message: string) => void;
  setSnackbarErrorOpen: (open: boolean) => void;
  setSnackbarErrorMessage: (message: string) => void;

}

export default function Posts(props: IPostsProps) {
  if (props.posts.length === 0) {
    return <h1>No posts found</h1>;
  } else {
    return (
      <div>
        {props.posts.map((post, index) => (
          <Grid item xs={12} key={index} sx={{ margin: "0 auto" }}>
            <Post
              id={post.id}
              title={post.title}
              author={post.author}
              description={post.description}
              base64Image={post.base64Image}
              imagetype={post.imagetype}
              post_date={post.post_date}
              url={post.url}
              apiURL={props.apiURL}
              urlExtension={props.urlExtension}
              setLoading={props.setLoading}
              user={props.user}
              setSnackbarSuccessOpen={props.setSnackbarSuccessOpen}
              setSnackbarSuccessMessage={props.setSnackbarSuccessMessage}
              setSnackbarErrorOpen={props.setSnackbarErrorOpen}
              setSnackbarErrorMessage={props.setSnackbarErrorMessage}
            />
            <Box mt={2} />
          </Grid>
        ))}
      </div>
    );
  }
}
