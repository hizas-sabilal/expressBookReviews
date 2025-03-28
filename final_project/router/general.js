const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password) {
      return res.status(400).json({ message: "Username and Password must be provided."})
  }
  for(const user of users){
      if(user.username === username){
          return res.status(400).json({ message: "Username already exists."})
      }
  }
  users.push({
      username, password
  })
  return res.status(200).json({ message: "Customer successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json( { books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  for(const key in books){
      if(key === isbn){
          return res.status(200).json(books[key]);
      }
  }
  return res.status(404).json({message: "Book not found."});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const booksByAuthor = []
  for(const key in books){
      if(books[key].author === author){
          booksByAuthor.push({
              isbn: key,
              title: books[key].title,
              reviews: books[key].reviews
          })
      }
  }
  return res.status(200).json({ booksbyauthor: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const booksByTitle = []
  for(const key in books){
      if(books[key].title === title){
          booksByTitle.push({
              isbn: key,
              author: books[key].author,
              reviews: books[key].reviews
          })
      }
  }
  return res.status(200).json({ booksbytitle: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  for(const key in books){
      if(key === isbn){
          return res.status(200).json(books[key].reviews);
      }
  }
  return res.status(404).json({message: "Book not found."});
});

module.exports.general = public_users;
