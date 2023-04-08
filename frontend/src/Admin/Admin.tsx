import API from '../API';
import SuccessAndFailureSnackbar from '../CustomSnackbar/SuccessAndFailureSnackbar';
import { UserType } from '../Types/UserType';
import './Admin.css';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface IAdminProps {
  user: UserType;
  urlExtension: string;
  apiURL: string;
  setLoading: (loading: boolean) => void;
}

const COLORS = ['#0088FE', '#00C49F'];

export default function Admin(props: IAdminProps) {

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    React.useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState("");

  const [donutData, setDonutData] = React.useState([
    { name: 'Posts', value: 0 },
    { name: 'Accounts', value: 0 },
  ]);

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  React.useEffect(() => {
    props.setLoading(true);

    const formData = new FormData();
    API.POST_MULTIPART_FORM_DATA(
      formData,
      props.apiURL + "/getAdminData.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Getting number of posts and accounts failed");
          console.error(data);
          props.setLoading(false);

            setSnackbarErrorMessage(
              "Getting the number of posts and accounts failed. Please try again later."
            );
            setSnackbarErrorOpen(true);

        } else {
          // login successful
          const jsonData = JSON.parse(data);

          console.log(jsonData);

          // console.log(jsonData);
          const remappeddata = {
            numPosts: parseInt(jsonData["numPosts"]),
            numAccounts: parseInt(jsonData["numUsers"]),
          } as { numPosts: number, numAccounts: number };

          setDonutData([
            { name: 'Posts', value: remappeddata.numPosts },
            { name: 'Accounts', value: remappeddata.numAccounts },
          ]);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Getting num posts and accounts failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Getting the number of posts and accounts failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
      }
    );

  }, []);

  // if the user isn't logged in within 250ms, redirect to login page
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (props.user.username === '' || props.user.username !== 'admin') {
        window.location.href = props.urlExtension + '/login';
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [props.user.id, props.user.username]);

  if (props.user.username === '' || props.user.username !== 'admin') {
    return <><h1>Waiting for authorization..</h1></>;
  } else {
    return (
      <div className="admin-dashboard">
        <h1 className="admin-header">Admin</h1>
        <div className="rounded-box">
          <div className="charts-container">
            <div className="chart-item">
              <h2 className='postsvsaccounts'>Number of Posts vs Accounts</h2>
              {donutData[1].value !== 0 ? ( <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>)
              : <h2 className='postsvsaccounts'>No data to display</h2>}
            </div>
          </div>
        </div>
        <SuccessAndFailureSnackbar
        snackbarSuccessOpen={snackbarSuccessOpen}
        handleSnackbarSuccessClose={handleSnackbarSuccessClose}
        snackbarSuccessMessage={snackbarSuccessMessage}
        snackbarErrorOpen={snackbarErrorOpen}
        handleSnackbarErrorClose={handleSnackbarErrorClose}
        snackbarErrorMessage={snackbarErrorMessage}
      />
      </div>
    );
  }
}
