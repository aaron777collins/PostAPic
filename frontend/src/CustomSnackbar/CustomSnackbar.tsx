import * as React from 'react';
import { AlertColor, Snackbar, Typography } from '@mui/material';
import { Alert, AlertProps } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import CustomAlert from '../CustomAlert/CustomAlert';

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
    severity?: AlertColor | undefined;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <CustomAlert onClose={onClose} severity={severity} message={message} />
    </Snackbar>
  );
};

export default CustomSnackbar;
