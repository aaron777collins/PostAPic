import { Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { UserType } from '../../Types/UserType';

export interface IIconButtonOrLoginButtonProps {
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void
  handleCloseUserMenu: () => void;
  anchorElUser: HTMLElement | null;
  user: UserType;
  urlExtension: string;
  settingsPages: string[];
}

export default function IconButtonOrLoginButton (props: IIconButtonOrLoginButtonProps) {
  if (props.user.id === "") {
    return (
      <Button
        variant="outlined"
        component={Link}
        to={props.urlExtension + "/login"}
        sx={{ ml: 1, mr: 1, color: "white", borderColor: "white", ":hover": { color: "white", borderColor: "white !important" } }}
      >
        Login
      </Button>
    );
  } else {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={props.handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={props.user.firstName} src="1234" />
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
            {props.settingsPages.map((page) => (
              <MenuItem key={page} onClick={props.handleCloseUserMenu}>
                <Link
                  to={props.urlExtension + "/" + page.toLowerCase()}
                  style={{ textDecoration: "none" }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </Link>
              </MenuItem>
            ))}
          </div>
        </Menu>
      </Box>
    );
  }
}
