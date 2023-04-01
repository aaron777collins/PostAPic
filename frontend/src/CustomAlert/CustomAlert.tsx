// CustomAlert.tsx
import React from "react";
import { Alert, AlertProps } from "@mui/material";

type CustomAlertProps = AlertProps & {
  ref?: React.Ref<any>;
  message: string; // Add the message prop
};


const CustomAlert = React.forwardRef<any, CustomAlertProps>((props, ref) => {
    const { children, message, ...otherProps } = props;
    return (
      <Alert ref={ref} {...otherProps}>
        {message} {/* Use the message prop here */}
      </Alert>
    );
  });

  export default CustomAlert;
