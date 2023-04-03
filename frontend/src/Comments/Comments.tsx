import * as React from "react";
import { ICommentProps } from "../Comment/Comment";
import Comment from "../Comment/Comment";

export interface ICommentsProps {
  postID: string;
  comments: ICommentProps[];
  apiURL: string;
  urlExtension: string;
}

export default function Comments(props: ICommentsProps) {

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
          />
        </div>
      ))}
    </>
  );
}
