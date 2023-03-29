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

export interface ILoginProps {
    setLoading: (loading: boolean) => void;
}

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

const FormStyled = styled('form')(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1em",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    backgroundColor: "#25283D",
    color: "white",
  alignSelf: "flex-start",
}));

export default function Login(props: ILoginProps) {
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        props.setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        props.setLoading(false);

        console.log(username, password)

    }
  return (
    <ContainerStyled maxWidth="xs">
      <PaperStyled elevation={3}>
        <Typography variant="h4" align="center" sx={{paddingBottom: "10px"}}>
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
            <Link href="/register" underline="hover">
              Register
            </Link>
          </Typography>

          {/* Link to search page */}
          <Typography>
            Continue as guest?{" "}
            <Link href="/search" underline="hover">
              Search
            </Link>
          </Typography>
        </FormStyled>
      </PaperStyled>
    </ContainerStyled>
  );
}
