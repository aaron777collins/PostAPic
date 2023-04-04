import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

export interface IConfirmationDialogProps {
  title: string;
  confirmationDialog: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export default function ConfirmationDialog(props: IConfirmationDialogProps) {
  const handleClickOpen = () => {
    props.setOpen(true);
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleConfirm = () => {
    props.setOpen(false);
    props.onConfirm();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.confirmationDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {props.cancelButtonText ? props.cancelButtonText : "Cancel"}
          </Button>
          <Button onClick={handleConfirm} autoFocus>
            {props.confirmButtonText ? props.confirmButtonText : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
