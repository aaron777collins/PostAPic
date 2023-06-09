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
  const [followingPage, setFollowingPage] = React.useState(1);
  const [numFollowingPosts, setNumFollowingPosts] = React.useState(1);
  const [followingPosts, setFollowingPosts] = React.useState<IPostProps[]>([]);
  const postsPerPage = 5;

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    React.useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState("");

  const [refreshPostsNeeded, setRefreshPostsNeeded] = React.useState(false);

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  // following feed

  React.useEffect(() => {
    if (props.user.id === "") {
      return;
    }

    props.setLoading(true);

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getNumPostsUserFollows.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting number of following posts failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("No posts found")) {
            setNumFollowingPosts(0);
            setSnackbarErrorMessage("No following posts found");
          } else if (data.includes("log in")) {
            setSnackbarErrorMessage(
              "You need to log in to see followed posts. Redirecting to login page in 3 seconds.."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else {
            setSnackbarErrorMessage(
              "Getting the number of following posts failed. Please try again later."
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

          setNumFollowingPosts(remappeddata.numPosts);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        setNumFollowingPosts(0);
        console.error("Getting num following posts failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the number of following posts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, [props.user.id, refreshPostsNeeded]);

  React.useEffect(() => {
    if (props.user.id === "") {
      return;
    }

    props.setLoading(true);

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("page", page.toString());
    formData.append("postsPerPage", postsPerPage.toString());

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getAllPostsUserFollows.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting the following posts failed");
          console.error(data);
          props.setLoading(false);

          if (data.includes("No posts found")) {
            setSnackbarSuccessMessage("No following posts. Try following an account!");
            setSnackbarSuccessOpen(true);
          } else {
            setSnackbarErrorMessage(
              "Getting the following posts failed. Please try again later."
            );
            setSnackbarErrorOpen(true);
          }
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

          setFollowingPosts(remappeddata);

          setSnackbarSuccessMessage("Following posts retrieved successfully");
          setSnackbarSuccessOpen(true);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Getting following posts failed.");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the posts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, [page, props.user.id, refreshPostsNeeded]);

  // global
  React.useEffect(() => {
    props.setLoading(true);

    const formData = new FormData();

    API.POST_MULTIPART_FORM_DATA(
      formData,
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
        setNumPosts(0);
        setSnackbarErrorMessage(
          "Getting the number of posts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, [refreshPostsNeeded]);

  React.useEffect(() => {
    props.setLoading(true);

    const formData = new FormData();
    formData.append("page", page.toString());
    formData.append("postsPerPage", postsPerPage.toString());

    API.POST_MULTIPART_FORM_DATA(
      formData,
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
  }, [page, refreshPostsNeeded]);

  const deletePost = (postid: string) => {
    // remove from posts
    setPosts(posts.filter((post) => post.postid !== postid));
    // remove from following posts
    setFollowingPosts(followingPosts.filter((post) => post.postid !== postid));
  };

  return (
    <div>
      <div className="main-content">
        <h1 className="h1-header">Home</h1>
        {props.user.id && (
          <div className="following-feed">
            <h2>Following Feed</h2>
            <Grid
              alignItems="center"
              justifyContent="center"
              justifySelf="center"
              rowSpacing={1}
              className="grid-container"
            >
              <Posts
                posts={followingPosts}
                apiURL={props.apiURL}
                urlExtension={props.urlExtension}
                setLoading={props.setLoading}
                user={props.user}
                setSnackbarSuccessOpen={setSnackbarSuccessOpen}
                setSnackbarSuccessMessage={setSnackbarSuccessMessage}
                setSnackbarErrorOpen={setSnackbarErrorOpen}
                setSnackbarErrorMessage={setSnackbarErrorMessage}
                deletePost={deletePost}
                refreshPostsNeeded={refreshPostsNeeded}
                setRefreshPostsNeeded={setRefreshPostsNeeded}
              />
            </Grid>
            <div className="rightFloat">
              <Pagination
                count={Math.ceil(numPosts / postsPerPage)}
                onChange={(e, page) => setPage(page)}
              />
            </div>
          </div>
        )}
        <div className="global-feed">
          <h2>Global Feed</h2>
          <Grid
            alignItems="center"
            justifyContent="center"
            justifySelf="center"
            rowSpacing={1}
            className="grid-container"
          >
            <Posts
              posts={posts}
              apiURL={props.apiURL}
              urlExtension={props.urlExtension}
              setLoading={props.setLoading}
              user={props.user}
              setSnackbarSuccessOpen={setSnackbarSuccessOpen}
              setSnackbarSuccessMessage={setSnackbarSuccessMessage}
              setSnackbarErrorOpen={setSnackbarErrorOpen}
              setSnackbarErrorMessage={setSnackbarErrorMessage}
              deletePost={deletePost}
              refreshPostsNeeded={refreshPostsNeeded}
              setRefreshPostsNeeded={setRefreshPostsNeeded}
            />
          </Grid>
          <div className="rightFloat">
            <Pagination
              count={Math.ceil(numPosts / postsPerPage)}
              onChange={(e, page) => setPage(page)}
            />
          </div>
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
