# README.md

# Dummy Express.js API

This project is a simple Express.js API that follows the MVC (Model-View-Controller) design pattern. It provides basic user management functionalities, including creating, retrieving, and updating user data.

## Project Structure

```
BACKEND
├── controllers
│   └── userController.js
├── models
│   └── userModel.js
├── routes
│   └── userRoutes.js
├── index.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd BACKEND
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run the following command:
```
node index.js
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Users

- **GET /users**: Retrieve all users
- **GET /users/:id**: Retrieve a user by ID
- **POST /users**: Create a new user
- **PUT /users/:id**: Update a user by ID

## License

This project is licensed under the ISC License.