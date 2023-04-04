import * as React from "react";
import { ICommentProps } from "../Comment/Comment";
import Comment from "../Comment/Comment";
import { UserType } from "../Types/UserType";

export interface ICommentsProps {
  postID: string;
  comments: ICommentProps[];
  setComments: (comments: ICommentProps[]) => void;
  apiURL: string;
  urlExtension: string;
  user: UserType;
  setLoading: (loading: boolean) => void;
  setSnackbarErrorOpen: (open: boolean) => void;
  setSnackbarErrorMessage: (message: string) => void;
  setSnackbarSuccessOpen: (open: boolean) => void;
  setSnackbarSuccessMessage: (message: string) => void;
}

export default function Comments(props: ICommentsProps) {

  function deleteComment(commentID: number) {
    props.setComments(props.comments.filter((comment) => comment.id !== commentID));
  }

  return (
    <>
      {props.comments.map((comment: ICommentProps) => (
        <div key={comment.id}>
          <Comment
            id={comment.id}
            userid={comment.userid}
            postid={comment.postid}
            author={comment.author}
            comment={comment.comment}
            date={comment.date}
            apiURL={props.apiURL}
            urlExtension={props.urlExtension}
            user={props.user}
            setLoading={props.setLoading}
            setSnackbarErrorOpen={props.setSnackbarErrorOpen}
            setSnackbarErrorMessage={props.setSnackbarErrorMessage}
            setSnackbarSuccessOpen={props.setSnackbarSuccessOpen}
            setSnackbarSuccessMessage={props.setSnackbarSuccessMessage}
            deleteComment={deleteComment}
          />
        </div>
      ))}
    </>
  );
}
