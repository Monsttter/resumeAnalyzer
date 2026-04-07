import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card as BCard, Form, Button as BButton, ProgressBar } from "react-bootstrap";
import { Typography, Box, Paper, Chip } from "@mui/material";
import { UploadFile, Description, Insights, AutoAwesome } from "@mui/icons-material";
import ResumeContext from "../context/ResumeContext";

export default function Home(props) {
  const {fetchAnalysis}= useContext(ResumeContext);
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const runAnalysis = async() => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append("jobDescription", jobDesc)
    const response= await fetchAnalysis(formData);
    const data= await response.json();
    // console.log(data);
    if(data.error){
      props.showAlert("danger", data.error);
      setResume(null);
      setJobDesc("");
    }
    else{
      const {ats_score, skills_detected, missing_skills, strengths, weaknesses, suggestions}= data.AI_response;
      setAnalysis({
        score: ats_score,
        detectedSkills: skills_detected,
        missingSkills: missing_skills,
        strengths: strengths,
        weaknesses: weaknesses,
        suggestions: suggestions
      });
    }
  };

  return (

      <Container className="py-5">

        {/* Header */}
        <Box textAlign="center" mb={5}>
          <Typography variant="h3" fontWeight="bold" color="#ffffff">
            Analyze and Improve Your Resume
          </Typography>
          <Typography variant="subtitle1" color="#d1d5db">
            Upload your resume and get ATS insights instantly
          </Typography>
        </Box>

        {/* Upload + JD Section */}
        <Row className="g-4">

          <Col md={6}>
            <BCard className="shadow-lg border-0">
              <BCard.Body>
                <div className="d-flex align-items-center mb-3">
                  <UploadFile style={{ marginRight: 8 }} />
                  <h5 className="mb-0">Upload Resume</h5>
                </div>

                <Form.Group>
                  <Form.Control type="file" onChange={handleUpload} />
                </Form.Group>

                {resume && (
                  <p className="text-muted mt-2">Uploaded: {resume.name}</p>
                )}
              </BCard.Body>
            </BCard>
          </Col>

          <Col md={6}>
            <BCard className="shadow-lg border-0">
              <BCard.Body>
                <div className="d-flex align-items-center mb-3">
                  <Description style={{ marginRight: 8 }} />
                  <h5 className="mb-0">Job Description</h5>
                </div>

                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Paste job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </BCard.Body>
            </BCard>
          </Col>
        </Row>

        {/* Analyze Button */}
        <div className="text-center mt-4">
          <BButton size="lg" variant="primary" onClick={runAnalysis}>
            Analyze Resume
          </BButton>
        </div>

        {/* Analysis Section */}
        {analysis && (
          <Row className="mt-5 g-4">

            {/* ATS Score */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <div className="d-flex align-items-center mb-3">
                  <Insights style={{ marginRight: 8 }} />
                  <h5 className="mb-0">ATS Score</h5>
                </div>

                <ProgressBar now={analysis.score} label={`${analysis.score}%`} className="mb-3" />
                <Typography>Overall ATS Score: {analysis.score}/100</Typography>
              </Paper>
            </Col>

            {/* Detected Skills */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <h5 className="mb-3">Detected Skills</h5>

                <div className="d-flex flex-wrap gap-2">
                  {analysis.detectedSkills.map((skill, i) => (
                    <Chip key={i} label={skill} color="error" />
                  ))}
                </div>
              </Paper>
            </Col>
            {/* Missing Skills */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <h5 className="mb-3">Missing Skills</h5>

                <div className="d-flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <Chip key={i} label={skill} color="error" />
                  ))}
                </div>
              </Paper>
            </Col>

            {/* Strengths */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <h5 className="mb-3">Strengths</h5>
                <ul>
                  {analysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Paper>
            </Col>
            {/* Weaknesses */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <h5 className="mb-3">Weaknesses</h5>
                <ul>
                  {analysis.weaknesses.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Paper>
            </Col>

            {/* Suggestions */}
            <Col md={6}>
              <Paper elevation={4} sx={{ padding: 3 }}>
                <div className="d-flex align-items-center mb-3">
                  <AutoAwesome style={{ marginRight: 8 }} />
                  <h5 className="mb-0">AI Suggestions</h5>
                </div>

                <ul>
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Paper>
            </Col>


          </Row>
        )}

      </Container>
  );
}

