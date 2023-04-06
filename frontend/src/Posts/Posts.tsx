import * as React from "react";
import Post, { IPostProps } from "../Post/Post";
import { Box, Container, Grid } from "@mui/material";
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
  deletePost: (postID: string) => void;
  refreshPostsNeeded: boolean;
  setRefreshPostsNeeded: (refreshPostsNeeded: boolean) => void;
}



export default function Posts(props: IPostsProps) {
  if (props.posts.length === 0) {
    return <h2>No posts found</h2>;
  } else {
    return (
      <div>
        {props.posts.map((post, index) => (
          <Grid item xs={12} key={index} sx={{ margin: "0 auto" }}>
            <Post
              postid={post.postid}
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
              deletePost={props.deletePost}
              refreshPostsNeeded={props.refreshPostsNeeded}
              setRefreshPostsNeeded={props.setRefreshPostsNeeded}
            />
            <Box mt={2} />
          </Grid>
        ))}
      </div>
    );
  }
}
