import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Box, Chip, Typography, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router";
import ResumeContext from "../context/ResumeContext";

export default function Account() {
  const {fetchResumes, deleteResume}= useContext(ResumeContext);
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const navigate= useNavigate();

  useEffect(() => {
    fetchResumes()
      .then((res) => res.json())
      .then((data) => {
        if(data.error){
          navigate("/login");
        }
        else{
          setResumes(data.resumes);
        }
      });
  });

  const handleDelete = async (id) => {
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredSorted = useMemo(() => {
    console.log(resumes);
    let data = resumes.filter((r) =>
      r.originalname.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "score") {
      data.sort((a, b) => b.ats_score - a.ats_score);
    } else {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [resumes, search, sortBy]);


  return (

      <Container style={{paddingTop: "30px", color: "white"}}>

        {/* Header */}
        <Box className="d-flex justify-content-between align-items-center mb-4">
          <Typography variant="h4" fontWeight="bold">My Resumes</Typography>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ background: "white", borderRadius: "8px" }}
          >
            <MenuItem value="date">Sort by Date</MenuItem>
            <MenuItem value="score">Sort by ATS Score</MenuItem>
          </Select>
        </Box>

        {/* Search */}
        <Form.Control
          type="text"
          placeholder="Search resumes by filename..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: "10px", padding: "10px" }}
        />

        {/* Cards */}
        <Row>
          {filteredSorted.map((r) => (
            <Col md={4} key={r.id} className="mb-4">
              <Card
                className="border-0 shadow-lg"
                style={{ borderRadius: "16px", overflow: "hidden" }}
              >

                {/* Thumbnail */}
                <div
                  style={{
                    height: "180px",
                    backgroundImage: `url(${"https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2025/02/pdf.jpg" || "/placeholder.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                  }}
                >
                  <Chip
                    label={`ATS: ${r.ats_score}`}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: r.ats_score > 75 ? "#16a34a" : r.ats_score > 50 ? "#f59e0b" : "#dc2626",
                      color: "white",
                      fontWeight: "bold"
                    }}
                  />
                </div>

                {/* Body */}
                <Card.Body style={{ background: "#111827", color: "white" }}>
                  <Card.Title style={{ fontSize: "1rem" }}>
                    {r.originalname}
                  </Card.Title>

                  <Card.Text style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </Card.Text>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-info"
                      size="sm"
                      href={r.fileurl}
                    >
                      Download
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredSorted.length === 0 && (
          <p className="text-center text-light mt-4">No resumes found</p>
        )}

      </Container>
  );
}