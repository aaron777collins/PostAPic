import * as React from "react";
import CustomSnackbar from "./CustomSnackbar";

export interface ISuccessAndFailureSnackbarProps {
  snackbarSuccessOpen: boolean;
  handleSnackbarSuccessClose: () => void;
  snackbarSuccessMessage: string;
  snackbarErrorOpen: boolean;
  handleSnackbarErrorClose: () => void;
  snackbarErrorMessage: string;
}

export default function SuccessAndFailureSnackbar(
  props: ISuccessAndFailureSnackbarProps
) {
  return (
    <>
      <CustomSnackbar
        open={props.snackbarSuccessOpen}
        onClose={props.handleSnackbarSuccessClose}
        message={props.snackbarSuccessMessage}
        severity="success"
      />
      <CustomSnackbar
        open={props.snackbarErrorOpen}
        onClose={props.handleSnackbarErrorClose}
        message={props.snackbarErrorMessage}
        severity="error"
      />
    </>
  );
}
