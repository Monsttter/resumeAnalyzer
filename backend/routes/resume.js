import express from "express";
import multer from "multer";
import parseResume from "../services/resumeParser.js";
import getAISuggestions from "../services/aiSuggestions.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import db from "../db.js";
import upload from "../upload.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router()

// const upload = multer({ dest: path.join(__dirname, "..", "public/data/uploads/") });

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {

    const file = req.file
    const jobDescription = req.body.jobDescription || ""

    if (!file) {
      return res.status(400).json({ error: "Resume file missing" })
    }

    // Extract text
    const resumeText = await parseResume(file)


    // // AI Suggestions
    const AI_response = await getAISuggestions(resumeText, jobDescription);

    if(req.isAuthenticated()){
      await db.query("INSERT INTO resumes(user_id, filename, fileurl, originalname, ats_score) VALUES($1, $2, $3, $4, $5)", [req.user.id, req.file.filename, req.file.path, req.file.originalname, AI_response.ats_score]);
    }

    res.json({
      AI_response
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Analysis failed" })
  }
})

router.get("/fetchresumes", async(req, res)=>{
  if(req.isAuthenticated()){
    const data= await db.query("SELECT * FROM resumes WHERE user_id= $1", [req.user.id]);
    // console.log(data);
    res.json({resumes: data.rows});
  }
  else{
    res.json({error: "You are not logged in"});
  }
})

router.delete("/deleteresume/:id", async(req, res)=>{
  if(req.isAuthenticated()){
    await db.query("DELETE FROM resumes WHERE id= $1", [req.params.id]);
    res.json({success: true});
  }
  else{
    res.json({success: false, error: "You are not logged in"});
  }
})

export default router;