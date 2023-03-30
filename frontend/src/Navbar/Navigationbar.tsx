import "./Navigationbar.css";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import Icon from "@mui/material/Icon";
import Logo from "../Logo/Logo";
import { UserType } from "../Types/UserType";
import IconButtonOrLoginButton from "./IconButtonOrLoginButton/IconButtonOrLoginButton";

// Home
// Search
// Create
// Admin
// Profile
// Login

// **Hidden:
// Register

// TODO:
// Admin
// Profile
// Login

const pagesWithLinks = ["Home", "Search", "Create"];
const settingsPages = ["Profile", "Logout"];

interface NavigationbarProps {
  urlExtension: string;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

function Navigationbar(props: NavigationbarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#25283D" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className="logocontainer">
            <Logo width={50} height={50} />
          </div>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={props.urlExtension + "/"}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            PostAPic
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pagesWithLinks.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  {/* link to corresponding page*/}
                  <Button
                      onClick={() => {
                        props.setUser({
                          id: "",
                          firstName: "",
                          lastName: "",
                          email: "",
                          username: "",
                          token: "",
                        } as UserType);
                        sessionStorage.removeItem("userinfo");
                      }}
                      component={Link}
                      to={props.urlExtension + "/" + page.toLowerCase()}
                      sx={{textTransform: "none"}}
                      >
                      {page}
                    </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href={props.urlExtension + "/"}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            PostAPic
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pagesWithLinks.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  // go to page
                  document.location.href =
                    props.urlExtension + "/" + page.toLowerCase();
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <div>
            <IconButtonOrLoginButton
              handleOpenUserMenu={handleOpenUserMenu}
              handleCloseUserMenu={handleCloseUserMenu}
              anchorElUser={anchorElUser}
              user={props.user}
              setUser={props.setUser}
              urlExtension={props.urlExtension}
              settingsPages={settingsPages}
            />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navigationbar;
