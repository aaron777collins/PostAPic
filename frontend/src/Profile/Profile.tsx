import { Button, Grid, Pagination } from "@mui/material";
import { UserType } from "../Types/UserType";
import "./Profile.css";

import * as React from "react";
import Posts from "../Posts/Posts";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";
import { IPostProps } from "../Post/Post";
import API from "../API";
import { useParams } from "react-router-dom";
import MoodIcon from "@mui/icons-material/Mood";

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

  const [canFollow, setCanFollow] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState(false);

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
    if (userinfo.id === "" || userinfo.id === props.user.id) {
      setCanFollow(false);
    } else {
      setCanFollow(true);
    }
  }, [userinfo.id, props.user.id]);


  React.useEffect(() => {
    if (props.user.id === "" || userinfo.id === "" || props.user.id === userinfo.id) {
      return;
    }

    // check if the user is already following the searched user
    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToCheck", userinfo.id);

    props.setLoading(true);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/isFollowingUser.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Checking if the user is following the other user failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("fill in")) {
            setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            props.setLoading(false);
            return;
          } else {
            setSnackbarErrorMessage(
              "Checking if the user is following the other user failed. Please try again later."
            );
          }
          setCanFollow(false);
          setSnackbarErrorOpen(true);
        } else {
          // success
          setIsFollowing(JSON.parse(data).isFollowing === true);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        setCanFollow(false);
        console.error("Getting users failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

  }, [props.user.id, userinfo.id]);


  function followUser() {
    if (props.user.id === userinfo.id) {
      setSnackbarErrorMessage("You can't follow yourself.");
      setSnackbarErrorOpen(true);
      return;
    }
    if (props.user.id === "") {
      setSnackbarErrorMessage(
        "You need to be logged in to follow a user. Redirecting to login page in 3 seconds.."
      );
      setSnackbarErrorOpen(true);
      setTimeout(() => {
        window.location.href = props.urlExtension + "/login";
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToFollow", userinfo.id);
    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/followUser.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Following users failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("fill in")) {
            setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            setSnackbarErrorMessage(
              "You need to be logged in to follow a user. Redirecting to login page in 3 seconds.."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else if (data.includes("already")) {
            setSnackbarErrorMessage("You are already following this user.");
          } else {
            setSnackbarErrorMessage(
              "Following the user failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // show success message
          setSnackbarSuccessMessage(
            "You are now following " + userinfo.id + "."
          );
          setSnackbarSuccessOpen(true);
          setIsFollowing(true);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        setIsFollowing(false);
        console.error("Getting users failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );
  }

  function unfollowUser() {
    if (props.user.id === userinfo.id) {
      setSnackbarErrorMessage(
        "You can't unfollow yourself. You never followed yourself in the first place."
      );
      setSnackbarErrorOpen(true);
      return;
    }
    if (props.user.id === "") {
      setSnackbarErrorMessage(
        "You need to be logged in to unfollow a user. Redirecting to login page in 3 seconds.."
      );
      setSnackbarErrorOpen(true);
      setTimeout(() => {
        window.location.href = props.urlExtension + "/login";
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToUnfollow", userinfo.id);
    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/unfollowUser.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Unfollowing users failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("fill in")) {
            setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            setSnackbarErrorMessage(
              "You need to be logged in to unfollow a user. Redirecting to login page in 3 seconds.."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else if (data.includes("already")) {
            setSnackbarErrorMessage("You are already unfollowing this user.");
          } else {
            setSnackbarErrorMessage(
              "Unfollowing the user failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // show success message
          setSnackbarSuccessMessage("You are now unfollowing " + userinfo.id);
          setSnackbarSuccessOpen(true);
          setIsFollowing(false);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        setIsFollowing(true);
        console.error("Getting users failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );
  }

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
        <div className="follow-button">
          {canFollow ? (
            isFollowing ? (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className="follow-unfollow-button"
                sx={{ ml: 1 }}
                onClick={() => unfollowUser}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="follow-unfollow-button"
                sx={{ ml: 1 }}
                onClick={() => followUser}
              >
                Follow
              </Button>
            )
          ) : (
            <>
              This is your account &nbsp;
              <MoodIcon sx={{ display: "inline-flex", mr: 1, verticalAlign: "bottom"}} />
            </>
          )}
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
