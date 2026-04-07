import express from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy  } from "passport-google-oauth20";
import db from "../db.js";

var router = express.Router();

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://resumeanalyzer-j1i7.onrender.com/api/auth/login/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    try {
      let data= await db.query("SELECT * FROM users WHERE googleId= $1", [profile.id]);
      if(data.rows.length!=0){
        return cb(null, data.rows[0]);
      }
      data= await db.query("INSERT INTO users(googleId, username, email) VALUES($1, $2, $3) RETURNING *", [profile.id, profile.displayName, profile.emails[0].value]);
      return cb(null, data.rows[0]);
      
    } catch (error) {
      return cb(error);
    }
  }
));

passport.serializeUser(function(user, cb) {
    // console.log(1, user);
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
    // console.log(2, user);
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: "https://resume-analyzer-mu-seven.vercel.app/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("https://resume-analyzer-mu-seven.vercel.app/");
  });

router.post('/logout', function(req, res) {
  console.log("logout");
  req.logout(function(err) {
    if (err) { return res.send({success: false, err: err}) }
    res.send({success: true, message: "Logged out"})
  });
});

router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;