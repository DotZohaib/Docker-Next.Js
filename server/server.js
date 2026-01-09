import express from "express";
import cors from "cors";

// --- FIX START ---
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const usersData = require("./users.json");
// --- FIX END ---

const app = express();
const PORT = 8000;

/* ==============================
   MIDDLEWARES
================================ */
app.use(cors({
  origin: [
    "https://docker-next-js-eight.vercel.app", // Slash (/) hata diya hai end se, ye safe rehta hai
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* ==============================
   ROUTES
================================ */

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express API is running 🚀",
    createdBy: usersData.createdBy,
    totalUsers: usersData.totalUsers
  });
});

// Get All Users
app.get("/api/users", (req, res) => {
  res.status(200).json({
    success: true,
    data: usersData.users
  });
});

// Get Single User by ID
app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = usersData.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// Filter by Department
app.get("/api/users/department/:dept", (req, res) => {
  const dept = req.params.dept.toLowerCase();
  const filteredUsers = usersData.users.filter(
    user => user.department.toLowerCase() === dept
  );

  res.status(200).json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

/* ==============================
   ERROR HANDLING
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ==============================
   SERVER
================================ */

// 🔴 Vercel Export
export default app;

// 🔵 Local Development
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}