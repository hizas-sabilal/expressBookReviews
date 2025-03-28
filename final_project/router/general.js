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
  // return res.status(200).json( { books });
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })

  getBooks
    .then((books) => {
      return res.status(200).json({ books });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const findBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })

  findBook
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    })
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const findBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = [];
      for (const key in books) {
          if (books[key].author === author) {
              booksByAuthor.push({
                  isbn: key,
                  title: books[key].title,
                  reviews: books[key].reviews
              });
          }
      }
      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject("No books found for this author.");
      }
  });

  findBooksByAuthor
      .then(data => res.status(200).json({ booksbyauthor: data }))
      .catch(error => res.status(404).json({ message: error }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const findBooksByTitle = new Promise((resolve, reject) => {
      const booksByTitle = [];
      for (const key in books) {
          if (books[key].title === title) {
              booksByTitle.push({
                  isbn: key,
                  author: books[key].author,
                  reviews: books[key].reviews
              });
          }
      }
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject("No books found with this title.");
      }
  });

  findBooksByTitle
      .then(data => res.status(200).json({ booksbytitle: data }))
      .catch(error => res.status(404).json({ message: error }));
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
