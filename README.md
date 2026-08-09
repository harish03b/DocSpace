# DocSpace

> A full-stack document management application built with React, Node.js, Express, and MongoDB.

DocSpace provides authenticated users with a centralized workspace for creating, editing, searching, archiving, restoring, and managing documents.

---

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Secure password hashing with bcrypt
- Document creation and editing
- Document listing
- Document search
- Active and archived document management
- Archive and restore workflow
- Document deletion
- Dashboard and document statistics
- RESTful backend API
- MongoDB persistence
- Production deployment with Vercel and Render
- Environment-based configuration

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Material UI

### Backend

- Node.js
- Express
- Mongoose
- JSON Web Token
- bcrypt
- CORS
- Helmet
- Morgan
- dotenv

### Database

- MongoDB / MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## Architecture

```text
                    DOCSPACE
                       |
          +------------+------------+
          |                         |
          v                         v
       Frontend                  Backend
       Vercel                   Render
       React                    Express
          |                         |
          |       HTTPS REST API    |
          +------------------------>|
                                    |
                                    v
                              MongoDB Atlas
```

The browser communicates with the Express API. The backend handles authentication, business logic, and database operations.

The frontend does not connect directly to MongoDB.

---

## Repository Structure

```text
DocSpace/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── document/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── document/
│   │   │   └── user/
│   │   ├── shared/
│   │   ├── sockets/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd DocSpace
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

### Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

The exact environment variable names are defined in:

```text
server/src/config/env.js
```

### Frontend

Create:

```text
client/.env
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

For production:

```env
VITE_API_BASE_URL=https://docspace-orqm.onrender.com/api/v1
```

Never commit real `.env` files or secrets.

---

## Run Locally

### Start the backend

From:

```text
server/
```

run:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

From:

```text
client/
```

run:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Authentication Flow

DocSpace uses JWT-based authentication.

```text
User
 |
 | Register / Login
 v
React Frontend
 |
 | REST API
 v
Express Backend
 |
 v
User Service
 |
 +--> MongoDB
 |
 +--> JWT
       |
       v
   Authenticated Client
```

Protected API requests use the authentication token.

JWT expiration is configurable through:

```env
JWT_EXPIRES_IN=7d
```

The JWT secret is stored only on the backend.

---

## Document Management

The main document workflow is:

```text
Create
  |
  v
Active Document
  |
  +--> Edit
  |
  +--> Search
  |
  +--> Archive
          |
          v
      Archived
          |
          +--> Search
          |
          +--> Restore
                   |
                   v
                 Active
```

The application supports both active and archived document search.

---

## API

The production API base URL is:

```text
https://docspace-orqm.onrender.com/api/v1
```

Authentication routes include:

```text
POST /auth/register
POST /auth/login
```

Document routes are available under the document API module.

For the complete API implementation, see:

```text
server/src/modules/
```

---

## Production Deployment

### Frontend

The production frontend is deployed using Vercel:

```text
https://doc-space-three.vercel.app
```

The frontend requires:

```env
VITE_API_BASE_URL=https://docspace-orqm.onrender.com/api/v1
```

Because DocSpace uses React Router, Vercel SPA rewrite configuration is required for direct navigation to nested routes such as:

```text
/documents/create
```

### Backend

The production backend is deployed using Render:

```text
https://docspace-orqm.onrender.com
```

Required production configuration includes:

```env
MONGODB_URI=<production-database>
JWT_SECRET=<production-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://doc-space-three.vercel.app
```

---

## Database

DocSpace uses MongoDB through Mongoose.

The backend database connection is handled by:

```text
server/src/config/database.js
```

MongoDB credentials must be provided through environment variables.

---

## Security

Important security practices:

- Passwords are hashed using bcrypt.
- Authentication uses JWT.
- JWT secrets remain on the backend.
- MongoDB credentials are stored in environment variables.
- Production secrets are not committed to Git.
- Protected operations require authentication.
- HTTP security middleware is configured on the backend.
- CORS is configured for frontend/backend communication.

---

## Development Workflow

Recommended workflow:

```text
1. Create/update feature
2. Run frontend locally
3. Run backend locally
4. Test API
5. Test authentication
6. Test document workflow
7. Review Git changes
8. Commit
9. Push
10. Deploy
11. Verify production
```

Before pushing:

```bash
git status
git diff
```

For staged changes:

```bash
git diff --cached
```

---

## Troubleshooting

### Backend does not start

Check:

```text
MONGODB_URI
PORT
.env
MongoDB availability
```

### Login returns 500

Check backend logs.

If the error is:

```text
secretOrPrivateKey must have a value
```

configure:

```env
JWT_SECRET=<secret>
```

### MongoDB configuration error

If the backend reports:

```text
MONGODB_URI is not configured.
```

configure `MONGODB_URI` in the deployment environment.

### Production frontend calls localhost

Verify:

```env
VITE_API_BASE_URL
```

in Vercel and redeploy the frontend.

### Nested frontend route returns 404

Check the Vercel SPA rewrite configuration.

For example:

```text
/documents/create
```

must be handled by the React application rather than treated as a physical server file.

---

## Documentation

Detailed project documentation is maintained separately.

Recommended reading order:

1. `project_overview.md`
2. `backend_developer_guide.md`
3. `frontend_developer_guide.md`
4. `deployment_and_environment_guide.md`
5. `project_runbook.md`

These documents contain architecture explanations, implementation details, deployment procedures, troubleshooting steps, and operational guidance.

---

## Production Verification

After deployment, verify:

```text
[ ] Frontend loads
[ ] Registration works
[ ] Login works
[ ] Logout works
[ ] Dashboard loads
[ ] Protected routes work
[ ] Document creation works
[ ] Document editing works
[ ] Search works
[ ] Active document search works
[ ] Archived document search works
[ ] Archive works
[ ] Restore works
[ ] Delete works
[ ] Nested React routes work
```

---

## Current Production URLs

| Component | URL |
|---|---|
| Frontend | https://doc-space-three.vercel.app |
| Backend | https://docspace-orqm.onrender.com |
| API Base | https://docspace-orqm.onrender.com/api/v1 |

---

## Project Status

DocSpace currently includes:

- Full-stack React frontend
- Express backend
- MongoDB persistence
- User authentication
- JWT authorization
- Document management
- Active/archived document workflows
- Search functionality
- Production deployment
- Environment-based configuration
- Deployment and troubleshooting documentation

---

## License

This project is intended as a software development project and portfolio application.

Add the appropriate license here if the repository is intended for open-source distribution.
