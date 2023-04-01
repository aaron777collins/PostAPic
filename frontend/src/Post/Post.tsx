// Post.tsx
import * as React from 'react';
import './Post.css'

export interface IPostProps {
  id: string;
  title: string;
  author: string;
  description: string;
  base64Image: string;
  imagetype: string;
  post_date: string;
  url: string;
}

export default function Post(props: IPostProps) {

  return (
    <div className="post-container">
      <div className="post-top">
        <div className="post-image">
          {/* base64 image */}
          <img src={"data:" + props.imagetype + ";base64," + props.base64Image} alt={props.title}/>
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
      </div>
    </div>
  );
}
