import React, { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/Login";
import { Box } from "@mui/material";
import Account from "./components/Account";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Alert from "./components/Alert";
import AuthContext from "./context/AuthContext";

export default function App() {

  const {fetchUser}= useContext(AuthContext);
  const [alert, setAlert]= useState(null);
  const showAlert= (type, message)=>{
    setAlert({type: type, msg: message});
    setTimeout(()=>{
      setAlert(null);
    },2000);
  }
  
  useEffect(()=>{
    fetchUser();
  });
  
  return<>
    <Box sx={{ background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", minHeight: "100vh" }}>
      <BrowserRouter>
        <Navbar/>
        <Alert alert={alert}/>
        <Routes>
          <Route path="/" element={<Home showAlert={showAlert}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path={`/users/:username`} element={<Account />} />
        </Routes>
      </BrowserRouter>
    </Box>
  </>
}

