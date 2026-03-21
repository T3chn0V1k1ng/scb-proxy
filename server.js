import express from "express";

const app = express(); // 

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("SCB Proxy is running 🚀");
});

// SCB endpoint (placeholder just nu)
app.post("/scb", (req, res) => {
  res.json({ message: "SCB proxy endpoint working" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
