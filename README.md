Prerequisites: 
	mongoDB, mongoDB tools, nodeJS, angular
	
	1. Git Clone https://github.com/NBarzilska/Bookstore.git
	2. DB 
		a. Open powershell at the project location and execute : mongorestore  dump/
	3. Install dependencies 
		a. cd my-angular-project
		b. npm install
	4. Start angular 
		a. cd my-angular-project
		b. ng serve 
	5.  Start server
		a. Open new terminal at project location
		b. cd Rest-api
		c. npm install express mongoose cors multer bcrypt cookie-parser
		d. node server.js
			