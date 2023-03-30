import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "./Login.css";
import { styled } from "@mui/system";
import API from "../API";
import { UserType } from "../Types/UserType";

const ContainerStyled = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: "4em",
}));

const FormStyled = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1em",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  backgroundColor: "#25283D",
  color: "white",
  alignSelf: "flex-start",
}));

export interface ILoginProps {
  setLoading: (loading: boolean) => void;
  apiURL: string;
  urlExtension: string;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export default function Login(props: ILoginProps) {
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    props.setLoading(true);

    // sending post with username and password properties
    await API.POST(
      {
        username: username,
        password: password,
      },
      props.apiURL + "/login.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if ((!data || data.includes("<br />")) ) {
            // show error message
            console.error("Login failed");
            console.error(data);
        } else {

            // login successful
            // set user info in session storage
            const jsonData = JSON.parse(data);
            // console.log(jsonData);
            const remappeddata = {
              id: jsonData.id,
              firstName: jsonData.firstName,
              lastName: jsonData.lastName,
              email: jsonData.email,
              username: jsonData.username,
              token: jsonData.token,
          } as UserType
          // console.log(remappeddata)
            sessionStorage.setItem("userinfo", JSON.stringify(remappeddata));
            props.setUser(remappeddata);

            // redirect to home page
            document.location.href = props.urlExtension + "/home";

        }

        props.setLoading(false);

      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Login failed");
        console.error(data);
        props.setLoading(false);
      }
    );

  };
  return (
    <ContainerStyled maxWidth="xs">
      <PaperStyled elevation={3}>
        <Typography variant="h4" align="center" sx={{ paddingBottom: "10px" }}>
          Login
        </Typography>
        <FormStyled
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleLogin}
        >
          <TextField
            label="Username"
            type="username"
            id="username"
            name="username"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            id="password"
            name="password"
            variant="outlined"
            fullWidth
          />
          <ButtonStyled type="submit" variant="contained" color="primary">
            Login
          </ButtonStyled>

          {/* Link to register page */}
          <Typography>
            Don't have an account?{" "}
            <Link href={props.urlExtension + "/register"} underline="hover">
              Register
            </Link>
          </Typography>

          {/* Link to search page */}
          <Typography>
            Continue as guest?{" "}
            <Link href={props.urlExtension + "/home"} underline="hover">
              Home
            </Link>
          </Typography>
        </FormStyled>
      </PaperStyled>
    </ContainerStyled>
  );
}
