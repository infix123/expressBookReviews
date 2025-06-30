const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let review = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let userwithsamename = users.filter((user) => { return user.username === username });
    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => { return (user.username === username && user.password === password) });
    if (validusers.length > 0) {
        return true;
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
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

        return res.status(200).send("User successfully logged in");
    }
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
    //return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here

    const review = req.body.reviews;
    const isbn = req.params.isbn;
    const username = req.session.authorization['username']
    let book = books[isbn];

    if (book) {
        // If the book already has reviews, push the new review
        if (!book.reviews) {
            book.reviews = {}; // Initialize reviews if it doesn't exist
        }
        // Add or update the review for the user
        book.reviews[username] = review;

        return res.status(200).json({ message: "Review added successfully", book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username']
    const book = books[isbn];
    if (book) {
        if (!book.reviews) {
            res.send("The book has no review and so no delete operation can be perform")
        }

        delete book.reviews[username];

        return res.status(200).json({ message: "Book deleted successfully", book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
