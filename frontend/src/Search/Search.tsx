import { Container, Grid, List, TextField, styled } from '@mui/material';
import React, { useState, useEffect } from 'react';
import UserResult from '../UserResult/UserResult';
import './Search.css';

const SearchContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
}));

const SearchField = styled(TextField)({
  width: '100%',
});

interface IUserResultProps {
  urlExtension: string;
}

const Search = (props: IUserResultProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([] as any[]);
  const [timeoutId, setTimeoutId] = useState(setTimeout(() => {}, 0));

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);

    if (timeoutId) clearTimeout(timeoutId);

    const timeoutID = setTimeout(() => {
      fetchResults();
      console.log("finished typing: " + e.target.value);
    }, 500);
    setTimeoutId(timeoutID);
  };

  const fetchResults = () => {
    // Implement your request here to fetch the search results
    // For now, I'll just use a dummy array of users
    const dummyUsers = [
      { username: 'aaron7c', userid: '2' },
    ];
    setResults(dummyUsers);
  };

  return (
    <SearchContainer maxWidth="md" className='searchContainer'>
      <h1>Search</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <SearchField
            label="Search Users"
            variant="outlined"
            value={searchTerm}
            onChange={handleChange}
            className="searchbar"
          />
        </Grid>
        <Grid item xs={12}>
          <List>
            {results.map((userinfo) => (
              <UserResult key={userinfo.username} user={userinfo} urlExtension={props.urlExtension} />
            ))}
          </List>
        </Grid>
      </Grid>
    </SearchContainer>
  );
};

export default Search;
