const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send({ message: "Customer successfully logged in" });
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  const review = req.body.review
  for(const key in books){
      if(key === isbn){
          books[key].reviews[username] = review
          return res.status(200).json({ message: `The review for the book with ISBN ${key} has been added/updated.`})
      }
  }
  return res.status(404).json({ message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  for(const key in books){
      if(key === isbn){
          delete books[key].reviews[username]
          return res.status(200).json({ message: `Review for ISBN ${isbn} posted by user ${username} deleted.`})
      }
  }
  return res.status(404).json({ message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
