import { createContext } from "react";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {

  const host= "https://resumeanalyzer-j1i7.onrender.com";
  // const host= "http://localhost:5000";

  const fetchResumes= async()=>{
    const response= await fetch(host+"/api/resume/fetchresumes", {
      method: "GET",
      credentials: "include"
    })
    return response;
  }
  const deleteResume= async(id)=>{
    await fetch(`${host}/api/resume/deleteresume/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
  
  const fetchAnalysis= async(formData)=>{
    const response= await fetch(host+"/api/resume/analyze", {
      method: 'POST',
      body: formData,
      credentials: "include"
    })
    return response;
  }

  return (
    <ResumeContext.Provider value={{ fetchResumes, deleteResume, fetchAnalysis }}>
      {children}
    </ResumeContext.Provider>
  )
}

export default ResumeContext;