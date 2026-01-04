# NeevasHub API

NeevasHub API is a RESTful API for property and roommate applications. It is built using Typescript, Node.js, Express.js, and Drizzle ORM.

## Endpoints

### User Endpoints

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login to an existing user
- **GET /api/auth/user**: Get the current user's information

### Property Endpoints

- **POST /api/properties**: Create a new property
- **GET /api/properties**: Get all properties
- **GET /api/properties/:id**: Get a specific property
- **PUT /api/properties/:id**: Update a specific property
- **DELETE /api/properties/:id**: Delete a specific property

### Roommate Endpoints

- **POST /api/roommate-openings**: Create a new roommate opening
- **GET /api/roommate-openings**: Get all roommate openings
- **GET /api/roommate-openings/:id**: Get a specific roommate opening
- **PUT /api/roommate-openings/:id**: Update a specific roommate opening
- **DELETE /api/roommate-openings/:id**: Delete a specific roommate opening

### Application Endpoints

- **POST /api/applications/property**: Apply for a property
- **POST /api/applications/roommate**: Apply for a roommate opening

### Admin Endpoints

#### User Verification Endpoints

- **GET /api/users**: Get a list of all users who are waiting for verification
- **PUT /api/users/verify/:id**: Update the status of a user to 'accepted' or 'rejected'

#### Property Applications Endpoints

- **GET /api/property-applications**: Get a list of all applications for properties

#### Roommate Applications Endpoints

- **GET /api/roommate-applications**: Get a list of all applications for roommates

## Installation

1. Clone the repository
2. Install the dependencies using `npm install`
3. Create a .env file for your database configuration, for example:

   ```
   DATABASE_URL = "mysql://<username>:<password>@localhost:3306/<name of your database>"
   JWT_SECRET = "256 bit secret key which you can generate from (here)[https://jwtsecrets.com/] "
   PORT = port number (eg. 5000)
   ```

4. Use "npx drizzle-kit generate" to generate the metadata for Drizzle ORM.
5. Use "npx drizzle-kit migrate" to migrate the database schema to your MySQL database.
6. Start the server using `npm run dev`

## Usage

You can use the YAML file in the root directory to test the API endpoints using Insomnia or any desired API testing tool.
