// Home.tsx
import './Home.css';
import * as React from 'react';
import { Grid, Box } from '@mui/material';
import Post, { IPostProps } from '../Post/Post';

const fakeData: IPostProps[] = [
  {
    title: 'Post 2',
    author: 'Author 2',
    description: 'This is a description for Post 2',
    base64Image: 'data:image/png;base64,iVBORw0KGg...',
  },
  {
    title: 'Post 2',
    author: 'Author 2',
    description: 'This is a description for Post 2',
    base64Image: 'data:image/png;base64,iVBORw0KGg...',
  },
  {
    title: 'Post 2',
    author: 'Author 2',
    description: 'This is a description for Post 2',
    base64Image: 'data:image/png;base64,iVBORw0KGg...',
  },
  {
    title: 'Post 2',
    author: 'Author 2',
    description: 'This is a description for Post 2',
    base64Image: 'data:image/png;base64,iVBORw0KGg...',
  },
  {
    title: 'Post 2',
    author: 'Author 2',
    description: 'This is a description for Post 2',
    base64Image: 'data:image/png;base64,iVBORw0KGg...',
  },
  // Add more fake data if needed
];

export default function Home() {
  return (
    <div>
      <div className="main-content">
      <h1>Home</h1>
        <Grid container spacing={4} alignItems="center" justifyContent="center" rowSpacing={1}>
          {fakeData.map((post, index) => (
            <Grid item xs={12} key={index} sx={{ margin: '0 auto' }}>
              <Post {...post} />
              <Box mt={2} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
