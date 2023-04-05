import * as React from "react";
import "./Comment.css";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserType } from "../Types/UserType";
import API from "../API";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

export interface ICommentProps {
  id: number;
  userid: number;
  postid: number;
  author: string;
  comment: string;
  date: string;
  apiURL: string;
  urlExtension: string;
  user: UserType;
  setLoading: (loading: boolean) => void;
  setSnackbarErrorOpen: (open: boolean) => void;
  setSnackbarErrorMessage: (message: string) => void;
  setSnackbarSuccessOpen: (open: boolean) => void;
  setSnackbarSuccessMessage: (message: string) => void;
  deleteComment: (commentID: number) => void;
}

function getDate(date: string) {
  const dateObj = new Date(date);

  return (
    <div className="comment-date">
      {dateObj.toLocaleDateString("en-CA", { timeZone: "America/Toronto" }) +
        " " +
        dateObj.toLocaleTimeString("en-CA", { timeZone: "America/Toronto" })}
    </div>
  );
}

export default function Comment(props: ICommentProps) {
  function deleteComment() {
    const formData = new FormData();
    formData.append("commentid", props.id.toString());
    formData.append("userid", props.user.id.toString());
    formData.append("token", props.user.token);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/deleteComment.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response
        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Comment deletion failed");
          console.error(data);
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Comment deletion: Please fill in all the fields."
            );
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "Comment deletion: Please log in to delete a comment (Redirecting to login page in 3 seconds..)."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else {
            props.setSnackbarErrorMessage(
              "Comment deletion. Please try again later."
            );
          }
          props.setSnackbarErrorOpen(true);
        } else {
          //   logic to delete comment locally

          console.log(data);
          props.deleteComment(props.id);

          props.setSnackbarSuccessMessage("Comment deleted successfully.");
          props.setSnackbarSuccessOpen(true);
        }
        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        if (data) {
          // show error message
          console.error("Comment deletion failed");
          console.error(data);
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Comment deletion: Please fill in all the fields."
            );
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "Comment deletion: Please log in to delete a comment (Redirecting to login page in 3 seconds..)."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else {
            props.setSnackbarErrorMessage(
              "Comment deletion. Please try again later."
            );
          }
          props.setSnackbarErrorOpen(true);
        } else {
          // show error message
          console.error("Comment deletion failed");
          console.error(data);
          props.setSnackbarErrorMessage(
            "Comment deletion. Please try again later."
          );
          props.setSnackbarErrorOpen(true);
        }
        props.setLoading(false);
      }
    );
  }

  const [deletable, setDeletable] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.user.id !== "") {
      // user is logged in
      // check if user is the author of the comment
      if (
        props.user.id === props.userid.toString() ||
        props.user.username === "admin"
      ) {
        setDeletable(true);
      }
    }
  }, [props.user.id, props.userid]);

  return (
    <div className="comment-container">
      <div className="comment-header">
        {deletable && (
          <IconButton
            className="delete-button"
            aria-label="delete"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        )}
      </div>
      <span className="comment-author">{props.author + ": "}</span>
      <span className="comment-description">{props.comment}</span>
      {getDate(props.date)}
      <ConfirmationDialog
        title="Delete Comment"
        confirmationDialog="Are you sure you want to delete this comment?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        onConfirm={deleteComment}
      />
    </div>
  );
}
