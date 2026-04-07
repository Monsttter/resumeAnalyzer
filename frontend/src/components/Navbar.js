import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const {user, setUser, userLogout}= useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = async () => {
    await userLogout();
    setUser(null);
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ background: "#111827" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          AI Resume Analyzer
        </Typography>

        {!user ? (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
          </>
        ) : (
          <>
            <Avatar
              src={user.picture}
              alt={user.name}
              onClick={handleMenuOpen}
              sx={{ cursor: "pointer" }}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>{user.name}</MenuItem>
              <MenuItem onClick={handleClose}> <Link to={`/users/${user.username}`} style={{textDecoration: "none", color: "black"}}>My Resumes</Link></MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
