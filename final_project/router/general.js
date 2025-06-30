const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });


});


//Promise that return all books
function getBooks(books) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Assuming books is an Object
                if (!books) {
                    throw new Error("Input must be an object of books");
                }
                resolve(books);
            } catch (error) {
                reject(error); // Reject the promise in case of an error
            }
        }, 1000);
    });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks(books)
        .then(books => {
            return res.status(200).json({ message: "Books returned successfully", books });
        })
        .catch(error => {
            console.error("Error:", error.message);
        });

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    // res.send(getbook);
    getBooks(books)
        .then(books => {
            let getbookByISBN = books[isbn];
            return res.status(200).json({ message: "Books returned successfully", getbookByISBN });
        })
        .catch(error => {
            console.error("Error:", error.message);
        });

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const authorname = req.params.author;
    let book = []
    getBooks(books)
        .then(books => {
            for (let key in books) {
                if (books[key].author === authorname) {
                    book.push(books[key])
                }
            }
            return res.status(200).json({ message: "Books returned successfully", book });
        })
        .catch(error => {
            console.error("Error:", error.message);
        });



});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    let book = []
    getBooks(books)
        .then(books => {
            for (let key in books) {
                if (books[key].title === title) {
                    book.push(books[key])
                }
            }
            return res.status(200).json({ message: "Books returned successfully", book });
        })
        . catch(error => {
            console.error("Error:", error.message);
        });
   
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
