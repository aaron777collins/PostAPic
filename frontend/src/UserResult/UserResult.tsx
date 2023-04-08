import { Button, Link, ListItem } from "@mui/material";
import * as React from "react";
import "./UserResult.css";
import API from "../API";
import { UserType } from "../Types/UserType";
import MoodIcon from "@mui/icons-material/Mood";

export interface IUserResultProps {
  searcheduser: {
    userid: string;
    username: string;
  };
  user: UserType;
  urlExtension: string;
  apiURL: string;
  setSnackbarSuccessOpen: (open: boolean) => void;
  setSnackbarSuccessMessage: (message: string) => void;
  setSnackbarErrorOpen: (open: boolean) => void;
  setSnackbarErrorMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

export default function UserResult(props: IUserResultProps) {
  const { searcheduser } = props;
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [canFollow, setCanFollow] = React.useState(false);

  React.useEffect(() => {
    if (props.user.id === "" || props.user.id === props.searcheduser.userid) {
      setCanFollow(false);
    } else {
      setCanFollow(true);
    }
  }, [props.user.id, props.searcheduser.userid]);

  React.useEffect(() => {
    if (props.user.id === "") {
      return;
    }

    // check if the user is already following the searched user
    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToCheck", props.searcheduser.userid);

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
            props.setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            props.setLoading(false);
            return;
          } else {
            props.setSnackbarErrorMessage(
              "Checking if the user is following the other user failed. Please try again later."
            );
          }
          setCanFollow(false);
          props.setSnackbarErrorOpen(true);
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
        props.setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        props.setSnackbarErrorOpen(true);
      }
    );

  }, [props.user.id, props.searcheduser.userid]);



  function followUser() {
    if (props.user.id === props.searcheduser.userid) {
      props.setSnackbarErrorMessage("You can't follow yourself.");
      props.setSnackbarErrorOpen(true);
      return;
    }
    if (props.user.id === "") {
      props.setSnackbarErrorMessage(
        "You need to be logged in to follow a user. Redirecting to login page in 3 seconds.."
      );
      localStorage.removeItem("userinfo");
      props.setSnackbarErrorOpen(true);
      setTimeout(() => {
        window.location.href = props.urlExtension + "/login";
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToFollow", props.searcheduser.userid);
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
            props.setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "You need to be logged in to follow a user. Redirecting to login page in 3 seconds.."
            );
            localStorage.removeItem("userinfo");
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else if (data.includes("already")) {
            props.setSnackbarErrorMessage(
              "You are already following this user."
            );
          } else {
            props.setSnackbarErrorMessage(
              "Following the user failed. Please try again later."
            );
          }
          props.setSnackbarErrorOpen(true);
        } else {
          // show success message
          props.setSnackbarSuccessMessage(
            "You are now following " + props.searcheduser.username
          );
          props.setSnackbarSuccessOpen(true);
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
        props.setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        props.setSnackbarErrorOpen(true);
      }
    );
  }

  function unfollowUser() {
    if (props.user.id === props.searcheduser.userid) {
      props.setSnackbarErrorMessage(
        "You can't unfollow yourself. You never followed yourself in the first place."
      );
      props.setSnackbarErrorOpen(true);
      return;
    }
    if (props.user.id === "") {
      props.setSnackbarErrorMessage(
        "You need to be logged in to unfollow a user. Redirecting to login page in 3 seconds.."
      );
      localStorage.removeItem("userinfo");
      props.setSnackbarErrorOpen(true);
      setTimeout(() => {
        window.location.href = props.urlExtension + "/login";
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("token", props.user.token);
    formData.append("useridToUnfollow", props.searcheduser.userid);
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
            props.setSnackbarErrorMessage("Make sure to fill in all fields.");
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "You need to be logged in to unfollow a user. Redirecting to login page in 3 seconds.."
            );
            localStorage.removeItem("userinfo");
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else if (data.includes("already")) {
            props.setSnackbarErrorMessage(
              "You are already unfollowing this user."
            );
          } else {
            props.setSnackbarErrorMessage(
              "Unfollowing the user failed. Please try again later."
            );
          }
          props.setSnackbarErrorOpen(true);
        } else {
          // show success message
          props.setSnackbarSuccessMessage(
            "You are now unfollowing " + props.searcheduser.username
          );
          props.setSnackbarSuccessOpen(true);
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
        props.setSnackbarErrorMessage(
          "Following the user failed. Please try again later."
        );
        props.setSnackbarErrorOpen(true);
      }
    );
  }

  return (
    <ListItem className="user-result-container">
      <Link
        sx={{ textDecoration: "none", color: "black", cursor: "pointer" }}
        href={props.urlExtension + "/profile/" + searcheduser.username}
      >
        <h2 className="username-header">{searcheduser.username}</h2>
      </Link>
      {/* follow/unfollow button on right side */}
      <div className="button-container">
        {canFollow ? (
          isFollowing ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className="follow-unfollow-button"
              sx={{ ml: 1 }}
              onClick={unfollowUser}
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
              onClick={followUser}
            >
              Follow
            </Button>
          )
        ) : (
          <>
            This is your account &nbsp;
            <MoodIcon sx={{ mr: 1 }} />
          </>
        )}
      </div>
    </ListItem>
  );
}
