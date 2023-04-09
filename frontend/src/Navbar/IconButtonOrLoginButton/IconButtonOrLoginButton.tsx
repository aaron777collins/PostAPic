import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";
import { UserType } from "../../Types/UserType";

export interface IIconButtonOrLoginButtonProps {
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
  anchorElUser: HTMLElement | null;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  user: UserType;
  urlExtension: string;
  settingsPages: string[];
}

export default function IconButtonOrLoginButton(
  props: IIconButtonOrLoginButtonProps
) {

  function stringToColor(str: string) {
    if (!str || str.length === 0) {
      return "#000000";
    }
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }

  // console.log(props.user)
  if (!props.user || !props.user.id ||  props.user.id === "") {
    return (
      <Button
        variant="outlined"
        component={Link}
        to={props.urlExtension + "/login"}
        sx={{
          ml: 1,
          mr: 1,
          color: "white",
          borderColor: "white",
          ":hover": { color: "white", borderColor: "white !important" },
        }}
      >
        Login
      </Button>
    );
  } else {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={props.handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={props.user.firstName.toUpperCase()} src="1234" sx={{bgcolor: stringToColor(props.user.firstName)}}/>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={props.anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(props.anchorElUser)}
          onClose={props.handleCloseUserMenu}
        >
          <div className="settingsmenu">
            {props.settingsPages.map((page) => {
              if (page.toLowerCase() === "Logout".toLowerCase()) {
                return (
                  <MenuItem key={page} onClick={props.handleCloseUserMenu}>
                    {/* button with function call that looks like a link*/}
                    <Button
                      onClick={() => {
                        props.setUser({
                          id: "",
                          firstName: "",
                          lastName: "",
                          email: "",
                          username: "",
                          token: "",
                          tokenExpiration: 0,
                        } as UserType);
                        localStorage.removeItem("userinfo");
                      }}
                      component={Link}
                      id={page + "-btn-navbar3"}
                      to={props.urlExtension + "/"}
                      sx={{textTransform: "none"}}
                      >
                      {page}
                    </Button>

                  </MenuItem>
                );
              } else {
                return (
                  <MenuItem key={page} onClick={props.handleCloseUserMenu}>
                  <Button
                      component={Link}
                      to={props.urlExtension + "/" + page.toLowerCase()}
                      sx={{textTransform: "none"}}
                      >
                      {page}
                    </Button>
                </MenuItem>
              );
            }})}
          </div>

        </Menu>
      </Box>
    );
  }
}
