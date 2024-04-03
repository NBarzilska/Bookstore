My Bookstore.
/A brief documentation of my Angular project/

Content:
1. Front-End (Angular)
1.1. Components
1.1.1.	Home page (book-list.component):
1.1.2.	Register page (register.component):
1.1.3.	Login page (login.component):
1.1.4.	Logout page (logout.component):
1.1.5.	Sale Book (add-book.component):
1.1.6.	My Profile (profile.component):
1.1.7.	My Messages (my-messages.component):
1.1.8 Authorization: 
1.1.8.1. Interceptor
1.1.8.2. Authenticate Component 
1.1.8.3. Token/Cookies

1.2. Rest-api 
1.2.1. Server.js
1.2.2. Endpoints / Routes
1.2.3. Models:

1.3. My DB

1. Front-End (Angular)
1.1. Components
For the structure of my first Angular project I chose to use the following components:
•	Home 
•	Register
•	Login
•	Logout
•	Sale Book
•	My Profile
•	My Messages

1.1.1.	Home page (book-list.component):
It contains all the books in the web application. The information that is both visible the same way for guests and logged-in users is with the Details button of each book.
If the guest wants to add book in order to sale, or to like a look and add it to his favorite book list or send a message to the owner of the book – the guest should log in.
For logged-in users after clicking on Details button – they have options for editing or deleting only for the books that they have been adding to the all-books list. Buttons Edit and Delete are not visible for guests. Those buttons are not visible also if a logged-in user choose some other owner’s book.
Building the logic for Details of the book, Edit book and Delete book – I used CRUD operations.
There is also a filter for the Search field that helps the user to find books by their title.
1.1.2.	Register page (register.component):
In order to register the user needs to input username, password and email address. There are validations for those input fields such as:
-	Username: should be at least 8 characters long and contains at least 1 capital letter and 1 digit. 
-	Password: should be at least 8 characters long, also to have at least 1 capital letter, 1 digit and 1 special character.
-	Email: should be a valid email address (xx@xx.xx)
There is also a validation for each input field to not be empty for the registration process.
1.1.3.	Login page (login.component):
If you are already registered, all you need is to log in so you can have more opportunities on the web application. In order to do that you need only username and password. The validations for those input fields are the same as those for registration.
After the user is logged-in, he has access to the following pages: Sale Book, My Profile, My Messages.
1.1.4.	Logout page (logout.component):

There is the logout() method from the AuthService to clear the authentication state. Upon successful logout, it navigates the user to the home page.

1.1.5.	Sale Book (add-book.component):
This page is visible only for logged-in user. If he wants to sale book, the information that it required to be given is presented in the following input fields with there validations such as:
-	Title: is required and should not be bigger than 100 characters
-	Author: is required and should not be bigger than 50 characters
-	Description: is required and should not be bigger than 500 characters
-	Price: is required and should not be negative
-	Image: not required
All the fields should not be empty (except the Image) in order to add your book successfully and see it on the Home book-list page.
1.1.6.	My Profile (profile.component):
Only the logged-in user can see this page. On this page there are two collections of books:
-	My Added Books – it is a list of all the books that the current user has added for selling in the all-books list visible on the Home page.
-	My Favorite Books – it is a list of all the books that the current user has liked from the all-books list visible on the Home page.

1.1.7.	My Messages (my-messages.component):
Only the logged-in user can see this page. There he can find all his chats with the book’s owner for a book. When they click on the chat, they will be redirected to another service called ChatService responsible for communicating with the backend API to handle chat-related functionalities, where logged-in users can send and receive messages. It provides methods to retrieve messages, send messages, and fetch communication threads for a specific user. The getMessages method retrieves messages based on the owner ID, book ID, and sender. The sendMessage method sends a message. The getMyMessages method retrieves communication threads for a specific user. The chats would have different color according to if the logged-in user is selling the book or interested in the book.
1.1.8. Authorization: 
1.1.8.1. Interceptor
The AppInterceptor class in this Angular code intercepts outgoing HTTP requests, modifying the URL to match the API URL specified in the environment configuration. It handles errors by redirecting to the login page for 401 (Unauthorized) errors and displaying an error page for other errors. The appInterseptorProvider exports the interceptor for injection into the HTTP pipeline.
1.1.8.2. Authenticate Component 
This Angular component, AuthenticateComponent, is responsible for handling authentication-related tasks. Upon initialization (ngOnInit), it calls the getProfile method from the AuthService to check if the user is authenticated. Depending on the result (success or error), it sets the isAuthenticating flag to false, indicating that the authentication process is complete.
1.1.8.3. Token/Cookies
This code defines an authentication middleware function named auth that checks for the presence of a JSON Web Token (JWT) in the request cookies. If a valid token is found, it retrieves the associated user from the database and attaches it to the request object (req.user). If the token is expired, blacklisted, or missing, it returns a 401 Unauthorized status with an error message. Additionally, it provides an option to redirect unauthenticated users if specified.
1.2. Rest-api 
1.2.1. Server.js
The code sets up a Node.js server using Express, connecting to MongoDB. It handles user authentication, book management, and messaging. Routes include user registration, login, profile management, book listing/filtering, liking/unliking books, and messaging. It also supports fetching communication threads for a user. An error handler middleware is included, and the server listens on a specified port. Here I generate token.
1.2.2. Endpoints / Routes
The endpoints that I used are:
•	app.post(`/login`, (req, res, next)) -> expects username and password fields.When receiving request, it verifies the credentials by searching for the provided username in my db. If found, it checks whether the provided password matches the store one. If the credentials are valid, it generates a JWT token based on the user’s_id, sets it as a cookie, and sends back the user object without sensitive information. In case of invalid credentials, it returns a 401 status with an error message.

•	app.get(`/profile`, auth(), async(req, res, next)) -> the request uses an authentication middleware auth() to authenticate the user before proceeding before accessing the /profile route. After authentication, it extracts the user’s _id from req.user and queries my db for the user profile without sensitive fields like password. If the user is found, it returns the user profile as JSON with a status of 200. If there are errors or if the user isn’t found, it handles with appropriate errors. This route serves authenticated users with their profile details without sensitive information.

•	app.post(`/register`, async (req, res, next)) -> the request should contain username, password and email in the request body. It creates a new user in my db with the provided information. If successful -> it generates a JWT, sets it a cookie, removes sensitive data from the user object, and sends the user object with a status code 200. If there is a duplicate key error (like username or email), it returns a 409 status code.

•	app.post(`/logout`, auth(), async(req, res)) -> verifies user authentication using the auth() middleware. During the request, it invalidates the user's JWT token by adding it to a tokenblacklist model. After successful invalidation, it clears the token from cookies, sends a 204 status (indicating successful operation with no content), and confirms the logout with a message. If any errors occur, they are handled and returned as responses.

•	app.get(`/books`, async (req, res)) -> first extracts the user _id from the query parameters, then fetches all books from my db. It populates each book object with the owner's username. If a userId is provided, it iterates through each book to check if it's liked by the specified user, updating the book objects with a 'liked' property. At the end it sends a JSON response containing an array of books with their respective details. If there are errors, it logs the error and returns a 500 status along with a message with a server error.
	
•	app.get(`/books/filter`, async (req, res)) -> it filters books by title, optionally considering a user ID. It retrieves books whose titles match the provided query string, performing a case-insensitive search. If a user ID is given, it checks if each book is liked by that user and adds a 'liked' property accordingly. The response is a JSON array of filtered books with owner usernames. In case of errors, it returns a 500 status with an error message.

•	app.get(`/books/:id`, async (req, res)) -> retrieves a single book by its ID. If the book is found, it returns the book object with a 200 status. If the book is not found, it responds with a 404 status and a "Book not found" message. In case of errors, it returns a 500 status with an error message.

•	app.get(`/books`, auth(), upload.single(`image`), async (req, res)) -> adds a new book to my db, allowing image upload. It handles authentication and image upload, then saves the book data. If successful, it responds with the saved book object and a status code of 201. If there's an error, it returns a 500 status along with a failure message.

•	app.delete(`/books/:id`, auth(), async(req,res)) -> deletes a book by its ID. It requires user authentication.Upon receiving the request, it attempts to delete the book from my db. If successful, it responds with a 200 status and the deleted book object. If the book is not found, it responds with a 404 status and a "Book not found" message. In case of errors, it returns a 500 status with an error message.

•	app.put(`/books/:id`, auth(), upload.single(`image`), async (req, res)) -> updates a book's details, potentially including an image upload. It requires user authentication. Upon receiving a PUT request, it updates the book's details in my db. If successful, it responds with a 200 status and the updated book object. If the book is not found, it responds with a 404 status and a "Book not found" message.In case of errors, it returns a 500 status with an error message. 

•	app.get(`/books/owner/:ownerId`, auth(), async (req, res)) -> retrieves books owned by a specific user. It requires user authentication. Upon receiving a GET request, it validates and extracts the owner ID from the request parameters. If the owner ID is missing or invalid, it returns a 400 status with an appropriate error message. It retrieves books owned by the specified user ID and returns them. If successful, it responds with a JSON array of books. In case of errors, it returns a 500 status with an error message.

•	app.put(`/likes`, auth(), async (req, res)) -> handles book liking/unliking. Requires user authentication. Upon receiving a PUT request, it checks if the book is already liked by the user. If the book is liked: 
o	If unliking, it removes the book from the liked list.
o	If already liked, it responds accordingly.
If the book is not liked, it adds the book to the liked list. If an error occurs, it responds with a 500 status.
•	app.get(`/likes`, auth(), async (req, res))  -> retrieves books liked by a user. Requires user authentication. Extracts the user ID from the query parameters. Finds and returns detailed information about the liked books. In case of errors, it returns a 500 status with an error message.

•	app.post(`/sendmessage`, auth(), async (req, res)) -> enables users to send messages. It creates a new message object with sender, receiver, book ID, and message data. Responds with a 201 status and the saved message on success. On error, returns a 500 status with an error message.

•	app.get(`/messages`, auth(), async (req, res)) -> retrieves messages for a specific sender, receiver, and book, and returns them. It requires user authentication and handles errors by returning a 500 status with an error message if any occur.

•	app.get(`/mymessages`, auth(), async (req, res)) -> retrieves communication threads for a user, considering them as either sender or receiver. Requires user authentication. Extracts userId from query parameters. Matches threads where the user is sender or receiver. Groups messages by book ID, extracting relevant details. Responds with populated threads. Handles errors by returning a 500 status with an error message.
1.2.3. Models:
The models that I am using to send requests to my db are: Book, LikedBook, Message, User, CommunicationThread, tokenBlacklistModel. Here are the following schemas for each of them:
•	Book:
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
•	LikedBook: 
const likedBookSchema = new mongoose.Schema({
    bookId: String,
    ownerId: String
});
•	Message:
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true
  },
  message: {
    type: String,
    required: true
  },
  senderUsername: {
    type: String,
    required: false
  },
  receiverUsername: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now // Automatically sets to current date/time
  },
  seen: {
    type: Boolean,
    default: false // Automatically sets to false initially
  }
});
•	User:
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
}, { timestamps: { createdAt: 'created_at' } });
•	CommunicationThread:
const communicationThreadSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  bookTitle: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otherParty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: String,
  otherPartyUsername: {
    type: String,
    required: false
  },
});
•	tokenBlacklistModel:
const tokenBlacklistSchema = new mongoose.Schema({
    token: String,
}, { timestamps: { createdAt: 'created_at' } });
1.3. My DB
To build my Angular project I created my own database tables in MongoDb. For this purpose I have the following schemas:
•	Users – contains all the information for the user after successful login: _id, username, password, email,  __v
•	Books – contains all the details about the book: _id, title, author, description, price, imageUrl, owner, __v
•	Likedbooks – contains _id, bookId, ownerId, __v
•	Messages – contains: _id, sender, receiver, book_id, message, seen, date, __v
•	Tokenblacklists – contains: _id, token, created_at, updatedAt, __v

