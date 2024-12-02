if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const fs = require("fs");
const initializePassport = require("./routes/passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = []; // Temporary user storage
const books = [];

app.set("view-engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.json());

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});
//middle ware
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
//middleware
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.get("/api/books", (req, res) => {
  res.json(books);
});
// Render books page
app.get("/books", checkAuthenticated, (req, res) => {
  res.render("books.ejs", { books });
});

// Create a new book (API)
app.post("/api/books", (req, res) => {
  const { title, review, rating } = req.body;
  const newBook = { id: Date.now().toString(), title, review, rating };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Update a book (API)
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, review, rating } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).send("Book not found");

  book.title = title || book.title;
  book.review = review || book.review;
  book.rating = rating || book.rating;

  res.json(book);
});

// Delete a book (API)
app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) return res.status(404).send("Book not found");

  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.listen(3000);
