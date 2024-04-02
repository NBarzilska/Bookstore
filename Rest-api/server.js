global.__basedir = __dirname;

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
const config = require('./config/config');

const { auth , jwt, errorHandler} = require('./utils');
const { authCookieName } = require('./app-config');

const { ObjectId } = mongoose.Types;

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require('./config/express')(app);

// Middleware
app.use(cors({
    origin: config.origin,
    credentials: true
  }));
  
  
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


const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}

// Routes
app.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username })
    .then(user => {
        return Promise.all([user, user ? user.matchPassword(password) : false]);
    })
    .then(([user, match]) => {
            if (!match) {
                res.status(401)
                    .send({ message: 'Wrong username or password' });
                return
            }
            user = bsonToJson(user);
            user = removePassword(user);

            const token = jwt.createToken({ id: user._id });
            console.log('login Token: ' + token);

            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(authCookieName, token, { httpOnly: true })
            }
            res.status(200)
                .send(user);
        })
        .catch(next);
});

app.get('/profile',auth(), async (req, res, next) => {
    const { _id: userId } = req.user;

    User.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
        .then(user => { res.status(200).json(user) })
        .catch(next);
});

app.post('/register', async (req, res, next) => {
    const { username, password, email } = req.body;

    User.create({ username, password, email }).then((createdUser) => {
        createdUser = bsonToJson(createdUser);
        createdUser = removePassword(createdUser);

        const token = jwt.createToken({ id: createdUser._id });
        if (process.env.NODE_ENV === 'production') {
            res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
        } else {
            res.cookie(authCookieName, token, { httpOnly: true })
        }
        res.status(200)
            .send(createdUser);
    })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });
    // await newUser.save();
    // res.status(201).json({ success: true, message: 'User registered successfully' });

});

app.post('/logout',auth(), async (req, res) => {
    console.log("logout");
    const token = req.cookies[authCookieName];
    console.log("logout Token: " + token);

    tokenBlacklistModel.create({ token })
        .then(() => {
            res.clearCookie(authCookieName)
                .status(204)
                .send({ message: 'Logged out!' });
        })
        .catch(err => res.send(err));
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
app.delete('/books/:id', auth(), async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findByIdAndDelete(bookId);
        // console.log(book);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }

    } catch (error) {
        // Handle possible errors, such as database errors or issues in the verification process
        res.status(500).json({ message: 'Server error' });
    }
});


// Add a new book with image upload
app.post('/books', auth(), upload.single('image'), async (req, res) => {
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
app.put('/books/:id', auth(), upload.single('image'), async (req, res) => {
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


app.get('/books/owner/:ownerId', auth(), async (req, res) => {
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
app.put('/likes', auth(), async (req, res) => {
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
app.get('/likes', auth(), async (req, res) => {
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

app.post('/sendmessage', auth() , async (req, res) => {
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

//Get messages for this sender, receiver, book
app.get('/messages', auth() , async (req, res) => {
    // Access the query parameters
    const ownerId = req.query.ownerId;
    const bookId = req.query.bookId;
    const sender = req.query.sender;

    console.log('Received parameters:', { ownerId, bookId, sender });
    try {
        // Assuming your Message schema has 'sender', 'receiver', and 'book_id' fields
        const messages = await Message.find({
            $or: [
                { sender: sender, receiver: ownerId, book_id: bookId },
                { sender: ownerId, receiver: sender, book_id: bookId } // If you want bidirectional conversation
            ]
        }).sort({ 'createdAt': 1 }); // Sorting by creation time, assuming you have a createdAt field

        for (const message of messages) {
            const senderUser = await User.findById(message.sender);
            const receiverUser = await User.findById(message.receiver);
            message.senderUsername = senderUser ? senderUser.username : 'Unknown';
            message.receiverUsername = receiverUser ? receiverUser.username : 'Unknown';
        }

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Failed to get messages' });
    }
});

app.get('/mymessages', auth() , async (req, res) => {
    // Extract the user ID from the query parameters
    const userId = req.query.userId;
    console.log("User ID:", userId); // Add this line for debugging

    try {
        const userObjectId = new ObjectId(userId);

        // Find all communication threads where the user is either the sender or the receiver
        const threads = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userObjectId },
                        { receiver: userObjectId }
                    ]
                }
            },
            {
                $group: {
                    _id: "$book_id",
                    bookTitle: { $first: "$bookTitle" },
                    otherParty: {
                        $first: {
                            $cond: [
                                { $eq: ["$sender", userObjectId] },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    },
                    lastMessage: { $last: "$message" }
                    // Add more fields as needed
                }
            }
        ]);
        console.log('threads');
        console.log(threads);
        // Iterate through the threads and fetch the book information for each thread
        const populatedThreads = await Promise.all(threads.map(async (thread) => {
            console.log('thread:');
            console.log(thread);
            const book = await Book.findById(thread._id);
            // Fetch the user information based on the other party's ID
            const otherUser = await User.findById(thread.otherParty);
            const otherPartyUsername = otherUser ? otherUser.username : null;
            return {
                ...thread,
                bookTitle: book.title,
                owner: book.owner,
                otherPartyUsername: otherPartyUsername,
            };
        }));

        res.json(populatedThreads);
    } catch (error) {
        console.error('Error fetching communication threads:', error);
        res.status(500).json({ message: 'Error fetching communication threads' });
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
