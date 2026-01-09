import express from "express";
import cors from "cors";
import usersData from "./users.json" assert { type: "json" };

const app = express();
const PORT = 8000;

/* ==============================
   MIDDLEWARES
================================ */
app.use(cors({
  origin: [
    "https://docker-next-js-eight.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* ==============================
   ROUTES
================================ */

// Root Route (API Status + Meta)
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

// Filter Users by Department
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

// 🔴 Vercel ke liye REQUIRED
export default app;

// 🔵 Local development ke liye
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
