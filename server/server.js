import express from "express"
import cors from "cors"

const app = express()
const PORT = 8000

app.use(cors(
  {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
))
app.use(express.json())

app.get("/", (req, res) => {
  res.send({
    message: "Hello, World!"
  })
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})