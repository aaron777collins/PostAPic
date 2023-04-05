// Home.tsx
import "./Home.css";
import * as React from "react";
import { Grid, Box, Pagination } from "@mui/material";
import Post, { IPostProps } from "../Post/Post";
import API from "../API";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";
import Posts from "../Posts/Posts";
import { UserType } from "../Types/UserType";

interface IHomeProps {
  setLoading: (loading: boolean) => void;
  urlExtension: string;
  apiURL: string;
  user: UserType;
}

export default function Home(props: IHomeProps) {
  const [page, setPage] = React.useState(1);
  const [numPosts, setNumPosts] = React.useState(1);
  const [posts, setPosts] = React.useState<IPostProps[]>([]);
  const postsPerPage = 5;

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    React.useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState("");

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  React.useEffect(() => {
    props.setLoading(true);

    API.POST(
      {},
      props.apiURL + "/getNumPosts.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting number of posts failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("No posts found")) {
            setNumPosts(0);
            setSnackbarErrorMessage("No posts found");
          } else {
            setSnackbarErrorMessage(
              "Getting the number of posts failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // login successful
          const jsonData = JSON.parse(data);
          // console.log(jsonData);
          const remappeddata = {
            numPosts: jsonData.numPosts,
          } as { numPosts: number };

          setNumPosts(remappeddata.numPosts);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Getting num posts failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the number of posts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, []);

  React.useEffect(() => {
    props.setLoading(true);

    API.POST(
      {
        page: page,
        postsPerPage: postsPerPage,
      },
      props.apiURL + "/getAllPosts.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting the posts failed");
          console.error(data);
          props.setLoading(false);

          if (data.includes("No posts found")) {
            setSnackbarErrorMessage("No posts found");
          } else {
            setSnackbarErrorMessage(
              "Getting the posts failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          const jsonData = JSON.parse(data);
          // console.log(jsonData);
          console.log(jsonData);
          const remappeddata = jsonData["results"].map((post: any) => {
            return {
              postid: post.id,
              title: post.title,
              author: post.author,
              description: post.description,
              base64Image: post.image,
              imagetype: post.imagetype,
              post_date: post.post_date,
              url: props.apiURL + "/getImage.php?post_id=" + post.id,
            } as IPostProps;
          });

          setPosts(remappeddata);


          setSnackbarSuccessMessage("Posts retrieved successfully");
          setSnackbarSuccessOpen(true);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Getting posts failed.");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the posts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, [page]);

  const deletePost = (postid: string) => {
    // remove from posts
    setPosts(posts.filter((post) => post.postid !== postid));
  }

  return (
    <div>
      <div className="main-content">
        <h1 className="h1-header">Home</h1>
        <Grid
          alignItems="center"
          justifyContent="center"
          justifySelf="center"
          rowSpacing={1}
          className="grid-container"
        >
        <Posts posts={posts}
              apiURL={props.apiURL}
              urlExtension={props.urlExtension}
              setLoading={props.setLoading}
              user={props.user}
              setSnackbarSuccessOpen={setSnackbarSuccessOpen}
              setSnackbarSuccessMessage={setSnackbarSuccessMessage}
              setSnackbarErrorOpen={setSnackbarErrorOpen}
              setSnackbarErrorMessage={setSnackbarErrorMessage}
              deletePost={deletePost}
              />
        </Grid>
        <div className="rightFloat">
          <Pagination
            count={Math.ceil(numPosts / postsPerPage)}
            onChange={(e, page) => setPage(page)}
          />
        </div>
      </div>
      <SuccessAndFailureSnackbar
          snackbarSuccessOpen={snackbarSuccessOpen}
          handleSnackbarSuccessClose={handleSnackbarSuccessClose}
          snackbarSuccessMessage={snackbarSuccessMessage}
          snackbarErrorOpen={snackbarErrorOpen}
          handleSnackbarErrorClose={handleSnackbarErrorClose}
          snackbarErrorMessage={snackbarErrorMessage}
        />
    </div>
  );
}
