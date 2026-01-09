import express from "express";
import cors from "cors";
import { createRequire } from "module";

// ✅ JSON Load karne ka Sahi Tareeqa (Vercel Compatible)
const require = createRequire(import.meta.url);
const usersData = require("./users.json");

const app = express();
const PORT = 8000;

/* ==============================
   MIDDLEWARES
================================ */
app.use(cors({
  origin: [
    "https://docker-next-js-eight.vercel.app", // Slash (/) hata diya hai, ye better hai
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* ==============================
   ROUTES
================================ */

// ✅ Root Route - Ab yahan Saara Data show hoga
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All Users Data Fetched Successfully 🚀",
    totalUsers: usersData.totalUsers,
    data: usersData.users // Ye line saara data show karegi
  });
});

// Get Single User by ID (Optional - agar zaroorat ho)
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

// Filter by Department (Optional)
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
   SERVER EXPORT (Important)
================================ */

// 🔴 Vercel ke liye ZAROORI line
export default app;

// 🔵 Local development ke liye
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}