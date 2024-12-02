# bookylooksba318

## Description

The Book Review App is a web application that allows users to create, read, update, and delete book reviews. Users must register and log in to interact with the app, which is built using Node.js, Express, EJS, and Passport.js for authentication. User data and book reviews are stored in JSON files.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [License](#license)

## Installation

Clone this repository to your local machine.

Install dependencies:

bash
Copy code
npm install
Create a .env file in the root of your project and set the SESSION_SECRET variable:

bash
Copy code
SESSION_SECRET=your-secret-key
Run the server:

bash
Copy code
npm start
or

bash
Copy code
nodemon index.js

## Usage

- Navigate to `http://localhost:3000` to access the app.
- Register a new account or log in if you already have one.
- ## as of now you will have to keep login back to access or ajust will be fixing that bug as soon as possible
- Once logged in, you can view, create, update, and delete book reviews.
- Access the Books page to see your reviews and interact with them.

## Features

- User registration and login using Passport.js for secure authentication.
- Create, read, update, and delete (CRUD) operations for book reviews.
- Persistent data storage using JSON files.
- Data validation with bcrypt for password hashing.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Authentication**: Passport.js
- **Data Storage**: JSON files
- **Utilities**: bcrypt (for password hashing), express-session, express-flash, method-override
