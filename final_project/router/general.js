const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((booklist) => {
    return res.status(200).send(JSON.stringify(booklist, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const get_book_isbn = new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({status: 404, message: "ISBN not found"});
    }
  });
  get_book_isbn.then((book) => {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }).catch((error) => {
    return res.status(error.status).json({message: error.message});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const get_books_by_author = new Promise((resolve, reject) => {
    let filtered_books = [];
    let keys = Object.keys(books);
    keys.forEach((isbn) => {
      if(books[isbn].author === author) {
        filtered_books.push(books[isbn]);
      }
    });
    resolve(filtered_books);
  });
  get_books_by_author.then((filtered_books) => {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const get_books_by_title = new Promise((resolve, reject) => {
    let filtered_books = [];
    let keys = Object.keys(books);
    keys.forEach((isbn) => {
      if(books[isbn].title === title) {
        filtered_books.push(books[isbn]);
      }
    });
    resolve(filtered_books);
  });
  get_books_by_title.then((filtered_books) => {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
