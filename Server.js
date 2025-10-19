import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error registering user" });
    }
    res.json({ message: " User registered successfully" });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Error logging in" });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "✅ Login successful", user: results[0] });
  });
});
app.get("/api/info", (req, res) => {
  res.json({
    appName: "AeroCare+",
    status: "Running smoothly 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${3000}`)
);