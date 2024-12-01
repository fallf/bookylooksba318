const express = require("express");
const app = express();
const PORT = 3000;

app.set("view-engine", "ejs");
app.get("/", (req, res) => {
  res.render("index.ejs", { name: "Fatou" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post("/register", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
