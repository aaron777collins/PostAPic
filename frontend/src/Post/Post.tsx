// Post.tsx
import * as React from 'react';
import './Post.css'

export interface IPostProps {
  title: string;
  author: string;
  description: string;
  base64Image: string;
}

export default function Post(props: IPostProps) {
  const { title, author, description, base64Image } = props;

  return (
    <div className="post-container">
      <div className="post-top">
        <div className="post-image">
          <img src={base64Image} alt={title} />
        </div>
        <div className="post-content">
          <h2 className="post-title">{title}</h2>
          <p className="post-author">{author}</p>
          <p className="post-description">{description}</p>
        </div>
      </div>
      <div className="post-bottom">
        <h3 className="comments-header">Comments</h3>
        {/* Add comment section here */}
      </div>
    </div>
  );
}
