import React, { useContext } from "react"
import { Typography, Button, Paper } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import AuthContext from "../context/AuthContext";

export default function Register() {

  const {handleGoogleLogin}= useContext(AuthContext);

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          borderRadius: "20px",
          width: "350px",
          textAlign: "center",
          background: "#111827",
          color: "white"
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Welcome
        </Typography>

        <Typography variant="body2" mb={4} color="#9ca3af">
          Sign up to AI Resume Analyzer
        </Typography>

        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            background: "#ffffff",
            color: "#111827",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "10px",
            "&:hover": {
              background: "#e5e7eb"
            }
          }}
        >
          Sign up with Google
        </Button>
      </Paper>
    </div>
  )
}