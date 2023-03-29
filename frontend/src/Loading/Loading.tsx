import { Backdrop, CircularProgress } from "@mui/material";
import * as React from "react";

export interface ILoadingProps {
  loading: boolean;
}

export default function Loading(props: ILoadingProps) {
  const { loading } = props;

  if (!loading) {
    return <></>;
  } else {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}
