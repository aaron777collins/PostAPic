// Post.tsx
import * as React from "react";
import "./Post.css";
import { Button, Pagination, TextField } from "@mui/material";
import { UserType } from "../Types/UserType";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PostType } from "../Types/PostType";
import API from "../API";
import { ICommentProps } from "../Comment/Comment";
import Comment from "../Comment/Comment";
import Comments from "../Comments/Comments";

export interface IPostProps {
  postid: string;
  title: string;
  author: string;
  description: string;
  base64Image: string;
  imagetype: string;
  post_date: string;
  url: string;
  apiURL: string;
  urlExtension: string;
  setLoading: (loading: boolean) => void;
  user: UserType;
  setSnackbarSuccessOpen: (open: boolean) => void;
  setSnackbarSuccessMessage: (message: string) => void;
  setSnackbarErrorOpen: (open: boolean) => void;
  setSnackbarErrorMessage: (message: string) => void;
}

interface IFormInputs {
  comment: string;
}

const validationSchema = yup.object().shape({
  comment: yup.string().required("Please enter a comment").max(500),
});

export default function Post(props: IPostProps) {
  const [comment, setComment] = React.useState<string>("");

  const [comments, setComments] = React.useState<ICommentProps[]>([]);
  const [needsUpdate, setNeedsUpdate] = React.useState<boolean>(false);

  const [commentsHTML, setCommentsHTML] = React.useState<JSX.Element>(<></>);

  const [page, setPage] = React.useState(1);
  const [numComments, setNumComments] = React.useState(1);
  const commentsPerPage = 10;


  React.useEffect(() => {

    const formData = new FormData();
    formData.append("postid", props.postid);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getNumComments.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response
        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Gathering the number of comments failed: Please fill in all the fields."
              );
              props.setSnackbarErrorOpen(true);
              console.error("Gathering the number of comments failed");
              console.error(data);
            } else if (data.includes("log in")) {
              props.setSnackbarErrorMessage(
                "Gathering the number of comments: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
                );
                console.error("Gathering the number of comments failed");
                console.error(data);
                setTimeout(() => {
                  window.location.href = props.urlExtension + "/login";
                }, 3000);
                props.setSnackbarErrorOpen(true);
              } else if (data.includes("No comments")) {
                // not an error
              } else {
            console.error("Gathering the number of comments failed");
            console.error(data);
            props.setSnackbarErrorMessage(
              "Gathering the number of comments. Please try again later."
              );
            props.setSnackbarErrorOpen(true);
          }

        } else {
          // login successful
          // set user info in local storage

          props.setLoading(false);

          // set comments info

          // console.log("Comment gathered successfully");
          // console.log(data);

          const jsonData = JSON.parse(data);
          // console.log(jsonData["comments"]);
          // "id" => $row["id"],
          // "userid" => $row["userid"],
          // "username" => $username,
          // "postid" => $row["postid"],
          // "comment" => $row["comment"],
          // "comment_date" => $row["comment_date"]
          console.log(jsonData["count"]);
          setNumComments(jsonData["count"]);


          // Handle submission logic here (e.g. call API to store data in the database)
          // props.setSnackbarSuccessMessage(
            //   "Comments gathered successfully."
            // );
            // props.setSnackbarSuccessOpen(true);
          }

          props.setLoading(false);
        },
      (data: any, req: XMLHttpRequest) => {
        // error
        // Handle submission logic here (e.g. call API to store data in the database)
        if (data) {
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Gathering the number of comments failed: Please fill in all the fields."
              );
              props.setSnackbarErrorOpen(true);
              console.error("Gathering the number of comments failed");
              console.error(data);
            } else if (data.includes("log in")) {
              props.setSnackbarErrorMessage(
                "Gathering the number of comments: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
                );
                console.error("Gathering the number of comments failed");
                console.error(data);
                setTimeout(() => {
                  window.location.href = props.urlExtension + "/login";
                }, 3000);
                props.setSnackbarErrorOpen(true);
              } else if (data.includes("No comments")) {
                // not an error
              } else {
            console.error("Gathering the number of comments failed");
            console.error(data);
            props.setSnackbarErrorMessage(
              "Gathering the number of comments. Please try again later."
              );
            props.setSnackbarErrorOpen(true);
          }
          }
          props.setLoading(false);
          // console.error(data);
        // props.setSnackbarErrorOpen(true);
      }
    );

  }, [props.postid]);

  React.useEffect(() => {
    setNeedsUpdate(false);


    // make POST_MULTIPART_FORM_DATA call to getComments.php with the postid
    const formData = new FormData();
    formData.append("postid", props.postid);
    formData.append("page", page.toString());
    formData.append("commentsPerPage", commentsPerPage.toString());
    // console.log("Getting comments for post " + formData.get("postid"));

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getComments.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response
        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Comment gathering failed: Please fill in all the fields."
              );
              props.setSnackbarErrorOpen(true);
              console.error("Comment gathering failed");
              console.error(data);
            } else if (data.includes("log in")) {
              props.setSnackbarErrorMessage(
                "Comment gathering failed: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
                );
                console.error("Comment gathering failed");
                console.error(data);
                setTimeout(() => {
                  window.location.href = props.urlExtension + "/login";
                }, 3000);
                props.setSnackbarErrorOpen(true);
              } else if (data.includes("No comments")) {
                // not an error
              } else {
            console.error("Comment gathering failed");
            console.error(data);
            props.setSnackbarErrorMessage(
              "Comment gathering failed. Please try again later."
              );
            props.setSnackbarErrorOpen(true);
          }
          setComments([]);
        } else {
          // login successful
          // set user info in local storage

          props.setLoading(false);

          // set comments info

          // console.log("Comment gathered successfully");
          // console.log(data);

          const jsonData = JSON.parse(data);
          // console.log(jsonData["comments"]);
          // "id" => $row["id"],
          // "userid" => $row["userid"],
          // "username" => $username,
          // "postid" => $row["postid"],
          // "comment" => $row["comment"],
          // "comment_date" => $row["comment_date"]
          setComments(jsonData["comments"].map((comment: any) => ({
            id: comment["id"],
            userid: comment["userid"],
            postid: comment["postid"],
            author: comment["username"],
            comment: comment["comment"],
            date: comment["comment_date"],
          } as ICommentProps)));


          // Handle submission logic here (e.g. call API to store data in the database)
          // props.setSnackbarSuccessMessage(
            //   "Comments gathered successfully."
            // );
            // props.setSnackbarSuccessOpen(true);
          }

          props.setLoading(false);
        },
      (data: any, req: XMLHttpRequest) => {
        // error
        // Handle submission logic here (e.g. call API to store data in the database)
        if (data) {
          if (data.includes("fill in")) {
            console.error("Comment gathering failed");
            console.error(data);
            props.setSnackbarErrorMessage(
              "Comment gathering failed: Please fill in all the fields."
              );
              props.setSnackbarErrorOpen(true);
            } else if (data.includes("log in")) {
              console.error("Comment gathering failed");
              console.error(data);
              props.setSnackbarErrorMessage(
                "Comment gathering failed: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
                );
                console.error("Comment gathering failed");
                console.error(data);
                setTimeout(() => {
                  window.location.href = props.urlExtension + "/login";
                }, 3000);
                props.setSnackbarErrorOpen(true);
              } else if (data.includes("No comments")) {
                // not an error
              } else {
                console.error("Comment gathering failed");
                console.error(data);
                props.setSnackbarErrorMessage(
              "Comment gathering failed. Please try again later."
              );
              props.setSnackbarErrorOpen(true);
            }
          }
          props.setLoading(false);
          console.error(data);
          setComments([]);
        // props.setSnackbarErrorOpen(true);
      }
    );
  }, [needsUpdate, props, page, commentsPerPage]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const properReset = () => {
    reset({
      comment: "",
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Add your logic to handle the comment submission here

    props.setLoading(true);

    const formData = new FormData();
    formData.append("userid", props.user.id);
    formData.append("postid", props.postid);
    formData.append("comment", comment);
    formData.append("token", props.user.token);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/addComment.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response
        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Creation failed");
          console.error(data);
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Comment creation failed: Please fill in all the fields."
            );
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "Comment creation failed: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else {
            props.setSnackbarErrorMessage(
              "Comment creation failed. Please try again later."
            );
          }
          props.setSnackbarErrorOpen(true);
        } else {
          // login successful
          // set user info in local storage

          props.setLoading(false);

          console.log("Comment created successfully");
          console.log(data);

          setNeedsUpdate(true);

          // Handle submission logic here (e.g. call API to store data in the database)
          props.setSnackbarSuccessMessage("Comment created successfully.");
          props.setSnackbarSuccessOpen(true);
          // Reset form
          properReset();
          setComment("");
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Login failed");
        console.error(data);
        // Handle submission logic here (e.g. call API to store data in the database)
        if (data) {
          if (data.includes("fill in")) {
            props.setSnackbarErrorMessage(
              "Comment creation failed: Please fill in all the fields."
            );
          } else if (data.includes("log in")) {
            props.setSnackbarErrorMessage(
              "Comment creation failed: Please log in to create a comment (Redirecting to login page in 3 seconds..)."
            );
            setTimeout(() => {
              window.location.href = props.urlExtension + "/login";
            }, 3000);
          } else {
            props.setSnackbarErrorMessage(
              "Comment creation failed. Please try again later."
            );
          }
        }
        props.setLoading(false);
        console.error(data);
        props.setSnackbarErrorOpen(true);
      }
    );
  };

  React.useEffect(() => {
    if (comments.length === 0) {
      setCommentsHTML(<p className="no-comments">No comments yet.</p>);
    } else {
      setCommentsHTML(<Comments comments={comments} urlExtension={props.urlExtension} apiURL={props.apiURL} postID={props.postid}/>)
    }
  }, [props.postid, comments, props.urlExtension, props.apiURL]);

  return (
    <div className="post-container">
      <div className="post-top">
        <div className="post-image">
          {/* base64 image */}
          <img
            src={"data:" + props.imagetype + ";base64," + props.base64Image}
            alt={props.title}
          />
        </div>
        <div className="post-content">
          <h2 className="post-title">{props.title}</h2>
          <p className="post-author">{props.author}</p>
          <p className="post-description">{props.description}</p>
        </div>
      </div>
      <div className="post-bottom">
        <h3 className="comments-header">Comments</h3>
        {/* Add comment section here */}
        <div className="comments-container">
          {commentsHTML}
        </div>
        <Pagination
            count={Math.ceil(numComments / commentsPerPage)}
            onChange={(e, page) => setPage(page)}
            className="pagination"
          />
        <div className="comment-input">
          <Controller
            name="comment"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Add a comment here.."
                variant="outlined"
                error={!!errors.comment}
                helperText={errors.comment?.message}
                value={comment}
                onChange={handleCommentChange}
                multiline
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            className="comment-button"
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
