Photo Caption Contest
-----------------------
This is a Node.js-based web application that allows users to upload photos and add captions, with functionality for user registration, login, and viewing photos.

Features
-----------------------
User Management: Users can register, log in, and delete their accounts.

Photo Upload: Authenticated users can upload photos with captions.

Photo Viewing: Users can view all uploaded photos or search photos by username.

Sessions and Security: User sessions are managed securely using session storage and JWT tokens for authentication.

Caching: Photos and user data are cached to improve performance.

Setup
-----------------------
Prerequisites
Node.js (v12.x or higher)
PostgreSQL database
A .env file with the following variables:

        DB_NAME=your_db_name
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_DIALECT=postgres
        SESSION_SECRET=your_session_secret

Installation
----------------------
Clone the repository:

        git clone https://github.com/your-username/photo-caption-contest.git
        cd photo-caption-contest

Install dependencies:

        npm install

Set up the database by configuring the .env file as mentioned in the prerequisites.

Run the database migrations and sync the models:

        npm run sync-db

Start the server:

        npm start

The server will run on http://localhost:3000.

API Endpoints
----------------------
        User Routes (/api)
        POST /register - Register a new user.
        POST /login - Log in and get a token.
        POST /logout - Log out a user.
        Photo Routes (/api)
        POST /photo - Upload a new photo with a caption (requires login).
        GET /photos - View all photos (supports caching).
        GET /photos/username/:username - View photos by a specific user.
        GET /photo/id/:id - Get a photo by its ID.

Dependencies
-------------------------
        express for server routing
        sequelize and pg for database interaction
        multer for handling file uploads
        bcrypt for password hashing
        jsonwebtoken for user authentication
        node-cache for caching data

Dev Dependencies
---------------------------
chai, mocha, and supertest for testing
