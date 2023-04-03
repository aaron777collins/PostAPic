import * as React from 'react';
import './Comment.css'

export interface ICommentProps {
    id: number,
    userid: number,
    postid: number,
    author: string,
    comment: string,
    date: string,
    apiURL: string,
    urlExtension: string,
}

function getDate(date: string) {
    const dateObj = new Date(date);

    return (
        <div className="comment-date">
            {dateObj.toLocaleDateString('en-CA', { timeZone: 'America/Toronto'}) + " " + dateObj.toLocaleTimeString('en-CA', { timeZone: 'America/Toronto'})}
        </div>
    );
}

export default function Comment (props: ICommentProps) {
  return (
    <div className="comment-container">
        <span className='comment-author'>{props.author + ": "}</span><span className='comment-description'>{props.comment}</span>
        {getDate(props.date)}
    </div>
  );
}
