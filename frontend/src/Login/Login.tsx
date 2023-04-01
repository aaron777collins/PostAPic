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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";
import { useState } from "react";

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
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  type loginSubmitForm = {
    username: string;
    password: string;
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (formData: loginSubmitForm) => {
    const username = formData["username"];
    const password = formData["password"];

    if (!username || !password) {
      console.error("Username or password is empty");
      return;
    }

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
        if (!data || data.includes("<br />") || data.includes("error")) {
          // show error message
          console.error("Login failed");
          console.error(data);
          props.setLoading(false);
          if (data.includes("incorrect")) {
            setSnackbarErrorMessage("Login failed: Incorrect username or password");
            setSnackbarErrorOpen(true);
            return;
          } else {
            setSnackbarErrorMessage(
              "Login failed. Please try again later."
            );
          }
          setSnackbarErrorOpen(true);
        } else {
          // login successful
          // set user info in local storage
          const jsonData = JSON.parse(data);
          // console.log(jsonData);
          // 30 minutes to milliseconds
          const tokenExpiration = Date.now() + 30 * 60 * 1000;
          const remappeddata = {
            id: jsonData.id,
            firstName: jsonData.firstName,
            lastName: jsonData.lastName,
            email: jsonData.email,
            username: jsonData.username,
            token: jsonData.token,
            tokenExpiration: tokenExpiration
          } as UserType;
          console.log("Set to:");
          console.log(remappeddata);
          localStorage.setItem("userinfo", JSON.stringify(remappeddata));
          props.setUser(remappeddata);

          setSnackbarSuccessMessage(
            "Logged in successfully. Redirecting to the home page in 3 seconds.."
          );
          setSnackbarSuccessOpen(true);

          setTimeout(() => {
            // redirect to home page
            document.location.href = props.urlExtension + "/home";
          }, 3000);
        }

        props.setLoading(false);
      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Login failed");
        console.error(data);
        props.setLoading(false);
        setSnackbarErrorMessage(
          "Login failed. Please try again later."
        );
        setSnackbarErrorOpen(true);
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
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Username"
            type="username"
            id="username"
            variant="outlined"
            fullWidth
            required
            {...register("username")}
          />
          {errors.username?.message && (
            <div className="invalid-feedback">{errors.username?.message}</div>
          )}
          <TextField
            label="Password"
            type="password"
            id="password"
            variant="outlined"
            required
            fullWidth
            {...register("password")}
          />
          <ButtonStyled type="submit" variant="contained" color="primary">
            Login
          </ButtonStyled>
          <ButtonStyled
            type="reset"
            variant="contained"
            color="secondary"
            onClick={() => reset()}
          >
            Reset
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
        <SuccessAndFailureSnackbar
          snackbarSuccessOpen={snackbarSuccessOpen}
          handleSnackbarSuccessClose={handleSnackbarSuccessClose}
          snackbarSuccessMessage={snackbarSuccessMessage}
          snackbarErrorOpen={snackbarErrorOpen}
          handleSnackbarErrorClose={handleSnackbarErrorClose}
          snackbarErrorMessage={snackbarErrorMessage}
        />
      </PaperStyled>
    </ContainerStyled>
  );
}
