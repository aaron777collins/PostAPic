import { Grid, Pagination } from "@mui/material";
import { UserType } from "../Types/UserType";
import "./Profile.css";

import * as React from "react";
import Posts from "../Posts/Posts";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";
import { IPostProps } from "../Post/Post";
import API from "../API";
import { useParams } from "react-router-dom";

export interface IProfileProps {
  setLoading: (loading: boolean) => void;
  apiURL: string;
  urlExtension: string;
  user: UserType;
}

export default function Profile(props: IProfileProps) {
  const [page, setPage] = React.useState(1);
  const [numPosts, setNumPosts] = React.useState(1);
  const [posts, setPosts] = React.useState<IPostProps[]>([]);
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
  const { username } = useParams();

  const [userinfo, setUserinfo] = React.useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    token: "",
    tokenExpiration: 0,
  } as UserType);

  React.useEffect(() => {

    props.setLoading(true);

    if (username === undefined || username === "") {
      // we will use the user's info itself

      setUserinfo(props.user);
      props.setLoading(false);
    } else {
      const formData = new FormData();
      formData.append("username", username);

      API.POST_MULTIPART_FORM_DATA(
        formData,
        props.apiURL + "/getUserInfo.php",
        (data: any, req: XMLHttpRequest) => {
          // successful response
          if (!data || data.includes("<br />") || data.includes("error")) {
            // show error message
            console.error("Getting user info failed");
            console.error(data);
            props.setLoading(false);
            setSnackbarErrorMessage(
              "User info not found. Redirecting to home in 3 seconds.."
            );
            setSnackbarErrorOpen(true);
            setTimeout(() => {
              console.log("redirecting to home");
              window.location.href = props.urlExtension + "/home";
            }, 3000);
            return (
              <h1>User info not found. Redirecting to home in 3 seconds..</h1>
            );
          } else {
            // login successful
            const jsonData = JSON.parse(data);
            // console.log(jsonData);

            const tempuserid = jsonData.id;
            const tempfirstName = jsonData.firstname;
            const templastName = jsonData.lastname;

            setUserinfo({
              id: tempuserid,
              username: username,
              firstName: tempfirstName,
              lastName: templastName,
              token: "",
              tokenExpiration: 0,
            });

            props.setLoading(false);
          }
        },
        (data: any, req: XMLHttpRequest) => {
          // error response
          console.error("Getting user info failed");
          console.error(data);
          props.setLoading(false);
          setSnackbarErrorMessage(
            "User info not found. Redirecting to home in 3 seconds.."
          );
          setSnackbarErrorOpen(true);
          setTimeout(() => {
            window.location.href = props.urlExtension + "/home";
          }, 3000);
          return (
            <h1>User info not found. Redirecting to home in 3 seconds..</h1>
          );
        }
      );
    }
  }, [username, props.user, props.urlExtension]);

  React.useEffect(() => {
    if (userinfo.id === "") {
      return;
    }

    console.log("getting num posts for user: " + userinfo.id);

    props.setLoading(true);

    const formData = new FormData();
    formData.append("userid", userinfo.id);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getNumPostsForUser.php",
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
  }, [userinfo.id]);

  React.useEffect(() => {
    if (userinfo.id === "") {
      return;
    }

    props.setLoading(true);

    const formData = new FormData();
    formData.append("userid", userinfo.id);
    formData.append("page", page.toString());
    formData.append("postsPerPage", postsPerPage.toString());

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getUserPosts.php",
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
  }, [page, userinfo.id]);

  const deletePost = (postid: string) => {
    // remove from posts
    setPosts(posts.filter((post) => post.postid !== postid));
  };

  return (
    <div className="content-container">
      <h1 className="profile-header">Profile</h1>
      <div className="profile-container">
        <div className="username">{userinfo.username}</div>
        <div className="name">
          {userinfo.firstName} {userinfo.lastName}
        </div>
      </div>
      <div className="post-list-container">
        <h1>Your Posts</h1>
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
            refreshPostsNeeded={refreshPostsNeeded} // this isn't used since we aren't coordinating 2 feeds
            setRefreshPostsNeeded={setRefreshPostsNeeded} // same here
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
