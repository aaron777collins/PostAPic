import "./Create.css";
import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
import API from "../API";
import { PostType } from "../Types/PostType";
import SuccessAndFailureSnackbar from "../CustomSnackbar/SuccessAndFailureSnackbar";
import { UserType } from "../Types/UserType";

interface ICreateProps {
  urlExtension: string;
  setLoading: (loading: boolean) => void;
  apiURL: string;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

interface IFormInputs {
  title: string;
  description: string;
  image: FileList;
}

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required").max(50),
  description: yup.string().required("Description is required").max(500),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return false;
      const file = Array.from(value as FileList)[0];
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg, image/gif"];
      return validImageTypes.includes(fileType);
    })
    .test("fileSize", "File size is too large (2MB max)", (value) => {
      if (!value) return false;
      const file = Array.from(value as FileList)[0];
      const fileSize = file.size;
      const validImageSize = 2000000;
      return fileSize < validImageSize;
    }),
});

export default function Create(props: ICreateProps) {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const properReset = () => {
    reset({
      title: "",
      description: "",
      image: undefined,
    });
    setImageName("");
  };

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

  const [imageName, setImageName] = useState("");

  const onSubmit = async (data: IFormInputs) => {
    // making a xmlhttprequest to the backend to create a post
    props.setLoading(true);

      if (props.user.tokenExpiration < Date.now()) {
        setSnackbarErrorMessage(
          "Post creation failed: Your token has expired. Please log in again. (Redirecting to login page in 3 seconds..)"
        );
        setSnackbarErrorOpen(true);
        props.setUser({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          token: "",
          tokenExpiration: 0,
        } as UserType);
        setTimeout(() => {
          window.location.href = props.urlExtension + "/login";
        }, 3000);
        return;
      }

      // create formData
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image[0]);
      formData.append("imagetype", data.image[0].type);
      formData.append("token", props.user.token);

      await API.POST_MULTIPART_FORM_DATA(
        formData,
        props.apiURL + "/createpost.php",
        (data: any, req: XMLHttpRequest) => {
          // successful response

          // checking if the response has "error" property
          if (!data || data.includes("<br />") || data.includes("error")) {
            // show error message
            console.error("Creation failed");
            console.error(data);
            if (data.includes("upload")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please upload a valid image file (JPEG, JPG, PNG, GIF)."
              );
            } else if (data.includes("fill in")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please fill in all the fields."
              );
            } else if (data.includes("log in")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please log in to create a post (Redirecting to login page in 3 seconds..)."
              );
              setTimeout(() => {
                window.location.href = props.urlExtension + "/login";
              }, 3000);
            } else {
              setSnackbarErrorMessage(
                "Post creation failed. Please try again later."
              );
            }
            setSnackbarErrorOpen(true);
          } else {
            // login successful
            // set user info in local storage
            const jsonData = JSON.parse(data);
            const remappeddata = {
              id: jsonData.id,
              title: jsonData.title,
              description: jsonData.description,
              image: jsonData.image,
              imagetype: jsonData.imagetype,
              createdAt: jsonData.createdAt,
            } as PostType;

            props.setLoading(false);
            console.log(jsonData);
            console.log(jsonData["image"]);
            console.log(JSON.stringify(remappeddata));

            // Handle submission logic here (e.g. call API to store data in the database)
            setSnackbarSuccessMessage(
              "Post created successfully. Redirecting to the home page in 3 seconds.."
            );
            setSnackbarSuccessOpen(true);
            setTimeout(() => {
              window.location.href = props.urlExtension + "/home";
            }, 3000);
            // Reset form
            properReset();
          }

          props.setLoading(false);
        },
        (data: any, req: XMLHttpRequest) => {
          // error
          console.error("Login failed");
          console.error(data);
          // Handle submission logic here (e.g. call API to store data in the database)
          if (data) {
            if (data.includes("upload")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please upload a valid image file (JPEG, JPG, PNG, GIF)."
              );
            } else if (data.includes("fill in")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please fill in all the fields."
              );
            } else if (data.includes("log in")) {
              setSnackbarErrorMessage(
                "Post creation failed: Please log in to create a post (Redirecting to login page in 3 seconds..)."
              );
              setTimeout(() => {
                window.location.href = props.urlExtension + "/login";
              }, 3000);
            } else {
              setSnackbarErrorMessage(
                "Post creation failed. Please try again later."
              );
            }
          }
          props.setLoading(false);
          console.error(data);
          setSnackbarErrorOpen(true);
        }
      );

  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setValue("image", event.target.files);
      setImageName(file.name);
    }
  };
  return (
    <Box className="create-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Create
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="image"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <>
              <input
                {...field}
                onChange={handleImageChange}
                value={undefined} // Change this line
                accept="image/jpeg, image/png, image/jpg, image/gif"
                id="contained-button-file"
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </>
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
        <Button
          type="reset"
          variant="contained"
          color="secondary"
          onClick={properReset}
        >
          Reset
        </Button>
        {imageName && ( // Add this block to display the image name
          <Typography variant="body2" component="p">
            {imageName}
          </Typography>
        )}
        {errors.image && (
          <Typography variant="body2" color="error">
            {errors.image.message}
          </Typography>
        )}
      </form>
      <SuccessAndFailureSnackbar
        snackbarSuccessOpen={snackbarSuccessOpen}
        handleSnackbarSuccessClose={handleSnackbarSuccessClose}
        snackbarSuccessMessage={snackbarSuccessMessage}
        snackbarErrorOpen={snackbarErrorOpen}
        handleSnackbarErrorClose={handleSnackbarErrorClose}
        snackbarErrorMessage={snackbarErrorMessage}
      />
    </Box>
  );
}
