import { createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const host= "https://resumeanalyzer-j1i7.onrender.com";
  // const host= "http://localhost:5000";

  const [user, setUser] = useState(null)

  const fetchUser= async()=>{
    const response= await fetch(host+"/api/auth/profile", {
      method: "GET",
      credentials: "include"
    })
    const data= await response.json();
    // console.log(data, user);
    if(data.loggedIn){
      setUser(data.user);
    }
  }

  const userLogout= async()=>{
    await fetch(host+"/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  }

  const handleGoogleLogin = () => {
    // redirect to backend Google OAuth route
    window.location.href = host+"/api/auth/login/google";
  }

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, userLogout, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;