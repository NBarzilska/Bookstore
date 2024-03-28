// server.js (Node.js backend)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Book = require('./models/Book');
const Message = require('./models/Message');
const LikedBook = require('./models/LikedBook');

const cors = require('cors'); // Import cors middleware
const multer = require('multer'); // Import multer for file uploads
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});
const upload = multer({ storage: storage });


// Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful', userId: user.id });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Username or email already exists' });
            return;
        }

        const newUser = new User({ username, password, email });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get all books
app.get('/books', async (req, res) => {
    try {
        const userId = req.query.userId; // Get the user ID from the query parameters

        let books = await Book.find().populate('owner', 'username');

        // Only check likes if userId is provided
        if (userId) {
            books = await Promise.all(books.map(async (book) => {
                // Check if the book is liked by the user
                const isLiked = await LikedBook.exists({ bookId: book._id, ownerId: userId });
                return { ...book.toObject(), liked: isLiked }; // Include liked status in book object
            }));
        }

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Filter books by title
app.get('/books/filter', async (req, res) => {
    const { title, userId } = req.query; // Get the title and user ID from the query parameters

    try {
        let books = await Book.find({ title: { $regex: title, $options: 'i' } }).populate('owner', 'username');

        // Only check likes if userId is provided
        if (userId) {
            books = await Promise.all(books.map(async (book) => {
                // Check if the book is liked by the user
                const isLiked = await LikedBook.exists({ bookId: book._id, ownerId: userId });
                return { ...book.toObject(), liked: isLiked }; // Include liked status in book object
            }));
        }

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    // console.log(book);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

//Delete book
app.delete('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);
    // console.log(book);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});


// Add a new book with image upload
app.post('/books', upload.single('image'), async (req, res) => {
    const { title, author, description, price, owner } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Get the image file path if uploaded

    try {
        const newBook = new Book({ title, author, description, price, imageUrl, owner });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add book' });
    }
});

//Change book 
app.put('/books/:id', upload.single('image'), async (req, res) => {
    const bookId = req.params.id;
    const { title, author, description, price, owner } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Get the image file path if uploaded

    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, {
            title,
            author,
            description,
            price,
            imageUrl,
            owner
        }, { new: true }); // Set { new: true } to return the updated document
        if (updatedBook) {
            res.status(200).json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update book' });
    }
});


app.get('/books/owner/:ownerId', async (req, res) => {
    const ownerId = req.params.ownerId;
    // Check if ownerId is provided
    if (!ownerId) {
        return res.status(400).json({ message: 'ownerId parameter is required' });
    }

    // Check if ownerId is a valid ObjectId
    if (!mongoose.isValidObjectId(ownerId)) {
        return res.status(400).json({ message: 'Invalid ownerId' });
    }

    try {
        const books = await Book.find({ owner: ownerId }).populate('owner', 'username');
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//Liked books
app.put('/likes', async (req, res) => {
    try {
        console.log('likes');
        const { bookId, ownerId, likes } = req.body;

        // Check if the book is already in the liked list
        const existingLikedBook = await LikedBook.findOne({ bookId, ownerId });
        //console.log("existingBook" + existingLikedBook);

        if (existingLikedBook) {
            if (!likes) {
                // If the book was previously liked but is now unliked, remove it from the liked list
                await LikedBook.deleteOne({ bookId, ownerId });
                res.status(200).send("Book removed from liked list.");
            } else {
                // If the book is already in the liked list and remains liked, return success
                res.status(200).send("Book is already liked.");
            }
        } else {
            // If the book is not in the liked list, save it
            const newLikedBook = new LikedBook({ bookId, ownerId });
            await newLikedBook.save();
            res.status(200).send("Book added to liked list successfully.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating liked status.");
    }
});

//Get all liked books in my profile
app.get('/likes', async (req, res) => {
    const userId = req.query.userId;

    try {
        // Find all liked books for the specified userId
        const likedBooks = await LikedBook.find({ ownerId: userId });

        // Array to store detailed book information
        const detailedLikedBooks = [];

        // Loop through each liked book
        for (const likedBook of likedBooks) {
            // Retrieve detailed book information from the books collection based on the bookId
            const book = await Book.findById(likedBook.bookId);
            // Push detailed book information to the result array
            detailedLikedBooks.push(book);
        }

        res.json(detailedLikedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching liked books', error });
    }
});

app.post('/sendmessage', async (req, res) => {
    const { sender, receiver, book_id, message, date, seen } = req.body;

    const newMessage = new Message({
        sender: sender,
        receiver: receiver,
        book_id: book_id,
        message: message,
      });
    
      try {
        const savedMessage = await newMessage.save();
        console.log('Message saved:', savedMessage);
        res.status(201).json(savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });

      }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
