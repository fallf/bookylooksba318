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
const path = require("path");
const initializePassport = require("./routes/passport-config");

// Paths to JSON files
const booksFilePath = path.join(__dirname, "data", "books.json");
const usersFilePath = path.join(__dirname, "data", "users.json");

// Load data from JSON files
let books = JSON.parse(fs.readFileSync(booksFilePath, "utf8"));
let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Change to false for development
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
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login if not authenticated
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

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
    const newUser = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Persist users to file
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login"); // Redirects to login if not authenticated
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect("/"); // Redirects to home if already authenticated
//   }
//   next();
// }

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/books", checkAuthenticated, (req, res) => {
  res.render("books.ejs", { books });
});

app.post("/api/books", checkAuthenticated, (req, res) => {
  const { title, review, rating } = req.body;
  const newBook = { id: Date.now().toString(), title, review, rating };
  books.push(newBook);
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
  res.status(201).json(newBook);
});

app.put("/api/books/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;
  const { title, review, rating } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).send("Book not found");

  book.title = title || book.title;
  book.review = review || book.review;
  book.rating = rating || book.rating;

  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
  res.json(book);
});

app.delete("/api/books/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) return res.status(404).send("Book not found");

  books.splice(bookIndex, 1);
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
  res.status(204).send();
});

app.listen(3000, () => console.log("Server running on port 3000"));
