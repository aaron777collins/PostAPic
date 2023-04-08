import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "./Register.css";
import { styled } from "@mui/system";
import API from "../API";
import { UserType } from "../Types/UserType";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";



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

export interface IRegisterProps {
  setLoading: (loading: boolean) => void;
  apiURL: string;
  urlExtension: string;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export default function Register(props: IRegisterProps) {

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


  type RegisterSubmitForm = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
    lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
    email: yup.string().required("Email is required").email("Email must be a valid email address"),
    username: yup.string().required("Username is required").min(2, "Username must be at least 2 characters").max(50, "Username must be less than 50 characters"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(50, "Password must be less than 50 characters"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (formData: RegisterSubmitForm) => {

    const firstName = formData["firstName"]
    const lastName = formData["lastName"]
    const email = formData["email"]
    const username = formData["username"]
    const password = formData["password"]

    if (!firstName || !lastName || !email || !username || !password) {
      console.error("Missing required fields");
      setSnackbarErrorMessage(
        "Registration failed: Missing required fields."
      );
      setSnackbarErrorOpen(true);
      return;
    }

    props.setLoading(true);

    // sending post with username and password properties
    await API.POST(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
      },
      props.apiURL + "/register.php",
      (data: any, req: XMLHttpRequest) => {
        // successful response

        // checking if the response has "error" property
        if ((!data || data.includes("<br />")) ) {
            // show error message
            console.error("Register failed");
            console.error(data);
            setSnackbarErrorMessage(
              "Registration failed: Please try again later."
            );
            setSnackbarErrorOpen(true);
            props.setLoading(false);
        } else {

            if (data.includes("already exists")) {
              console.error("Register failed");
              console.error(data);
              setSnackbarErrorMessage(
                "Registration failed: Username or email already exists."
              );
              setSnackbarErrorOpen(true);
              props.setLoading(false);
              return;
            }

            if (data.includes("fill in")) {
              console.error("Register failed");
              console.error(data);
              setSnackbarErrorMessage(
                "Registration failed: Please fill in all fields."
              );
              setSnackbarErrorOpen(true);
              props.setLoading(false);
              return;
            }

            if (data.includes("error")) {
              console.error("Register failed");
              console.error(data);
              setSnackbarErrorMessage(
                "Registration failed: Please try again later."
              );
              setSnackbarErrorOpen(true);
              props.setLoading(false);
              return;
            }

            setSnackbarSuccessMessage(
              "Registered successfully. Redirecting to the login page in 3 seconds.."
            );
            setSnackbarSuccessOpen(true);

            setTimeout(() => {
              // redirect to login page
              document.location.href = props.urlExtension + "/login";
            }, 3000);
            props.setLoading(false);

        }

        props.setLoading(false);

      },
      (data: any, req: XMLHttpRequest) => {
        // error
        console.error("Register failed");
        console.error(data);
        props.setLoading(false);
      }
    );

  };
  return (
    <ContainerStyled maxWidth="xs">
      <PaperStyled elevation={3}>
        <Typography variant="h4" align="center" sx={{ paddingBottom: "10px" }}>
          Register
        </Typography>
        <FormStyled
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* firstName, lastName, email, username, password */}
          <TextField
            label="First Name"
            type="firstName"
            id="firstName"
            variant="outlined"
            fullWidth
            required
            {...register("firstName")}
          />
          {errors.firstName?.message && (
            <div className="invalid-feedback">{errors.firstName?.message}</div>
          )}
          <TextField
            label="Last Name"
            type="lastName"
            id="lastName"
            variant="outlined"
            fullWidth
            required
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <div className="invalid-feedback">{errors.lastName?.message}</div>
          )}
          <TextField
            label="Email"
            type="email"
            id="email"
            variant="outlined"
            fullWidth
            required
            {...register("email")}
          />
          {errors.email?.message && (
            <div className="invalid-feedback">{errors.email?.message}</div>
          )}
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
          {errors.password?.message && (
            <div className="invalid-feedback">{errors.password?.message}</div>
          )}
          <ButtonStyled type="submit" variant="contained" color="primary">
            Register
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
            Already have an account?{" "}
            <Link href={props.urlExtension + "/login"} underline="hover">
              Login
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
