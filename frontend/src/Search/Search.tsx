import { Container, Grid, List, Pagination, TextField, styled } from '@mui/material';
import React, { useState, useEffect } from 'react';
import UserResult from '../UserResult/UserResult';
import './Search.css';
import API from '../API';
import SuccessAndFailureSnackbar from '../CustomSnackbar/SuccessAndFailureSnackbar';
import { UserType } from '../Types/UserType';

const SearchContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
}));

const SearchField = styled(TextField)({
  width: '100%',
});

interface IUserResultProps {
  apiURL: string;
  urlExtension: string;
  setLoading: (loading: boolean) => void;
  user: UserType;
}

const Search = (props: IUserResultProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([] as any[]);

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    React.useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);
  const [numUsers, setNumUsers] = React.useState(0);

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  React.useEffect(() => {

    if (searchTerm === "") {
      setNumUsers(0);
      return;
    }

    props.setLoading(true);

    const formData = new FormData();
    formData.append('username', searchTerm);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getNumUsers.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting number of users failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("No users found")) {
            setNumUsers(0);
            setSnackbarErrorMessage("No users found with that username");
          } else {
            setSnackbarErrorMessage(
              "Getting the number of users failed with that search term failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // login successful
          const jsonData = JSON.parse(data);
          // console.log(jsonData);
          const remappeddata = {
            numUsers: jsonData.numUsers,
          } as { numUsers: number };

          setNumUsers(remappeddata.numUsers);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Getting num users failed");
        console.error(data);
        props.setLoading(false);
        setNumUsers(0);
        setSnackbarErrorMessage(
          "Getting the number of users failed with that search term failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

    props.setLoading(false);
  }, [searchTerm]);

  const fetchResults = () => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }
    // Implement your request here to fetch the search results
    // For now, I'll just use a dummy array of users
    // const dummyUsers = [
    //   { username: 'aaron7c', userid: '2' },
    // ];
    // setResults(dummyUsers);

    const formData = new FormData();
    formData.append('username', searchTerm);
    formData.append('page', page.toString());
    formData.append('usersPerPage', usersPerPage.toString());

    props.setLoading(true);

    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getUsersBySearch.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting users failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("No users found")) {
            setResults([]);
            setSnackbarErrorMessage("No users found with that username");
          } else {
            setSnackbarErrorMessage(
              "Getting the users failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // login successful
          const jsonData = JSON.parse(data);
          // array(
        //     "id" => $row["id"],
        //     "username" => $row["username"],
        //     "firstname" => $row["firstname"],
        //     "lastname" => $row["lastname"],
        //     "email" => $row["email"],
        //     "reg_date" => $row["reg_date"]
        // );


          const remappeddata = jsonData["users"].map((user: any) => {
            return {
              userid: user.id,
              username: user.username,
              firstName: user.firstname,
              lastName: user.lastname,
              email: user.email,
              reg_date: user.reg_date,
            }
          });

          setResults(remappeddata);



          // setNumFollowingPosts(remappeddata.numPosts);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        setResults([]);
        console.error("Getting users failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the users with that search term failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );
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
              <UserResult key={userinfo.username} searcheduser={userinfo} urlExtension={props.urlExtension} apiURL={props.apiURL}
              user={props.user}
              setLoading={props.setLoading}
              setSnackbarErrorMessage={setSnackbarErrorMessage}
              setSnackbarErrorOpen={setSnackbarErrorOpen}
              setSnackbarSuccessMessage={setSnackbarSuccessMessage}
              setSnackbarSuccessOpen={setSnackbarSuccessOpen}
              />
            ))}
          </List>
          <Pagination
              className="pagination"
              count={Math.ceil(numUsers / usersPerPage)}
              onChange={(e, page) => setPage(page)}
            />
        </Grid>
      </Grid>
      <SuccessAndFailureSnackbar
        snackbarSuccessOpen={snackbarSuccessOpen}
        handleSnackbarSuccessClose={handleSnackbarSuccessClose}
        snackbarSuccessMessage={snackbarSuccessMessage}
        snackbarErrorOpen={snackbarErrorOpen}
        handleSnackbarErrorClose={handleSnackbarErrorClose}
        snackbarErrorMessage={snackbarErrorMessage}
      />
    </SearchContainer>
  );
};

export default Search;
