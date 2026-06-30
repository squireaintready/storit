# storit

A clean, full-stack web app for storing and organizing documents. Upload files to private cloud storage and browse them in a simple UI, all behind token-based auth.

## Stack

- **Frontend** (`my-app/`) — React (CRA), React Router, axios
- **Backend** (`src/`) — Node.js, Express, MongoDB (Mongoose)
- **Storage** — AWS S3 (`multer-s3` streaming uploads)
- **Auth** — JWT + bcrypt password hashing

## Architecture

```
my-app/              React client (runs on :3001)
src/
  app.js             Express entry + Mongo connection
  routes/            /api/users, /api/files
  models/            user, file (Mongoose schemas)
  middlewares/       JWT auth guard
```

Files are streamed to S3 on upload; metadata (owner, key, name) is persisted in MongoDB and served back per authenticated user.

## Run locally

```bash
# 1. backend
npm install
node src/app.js                         # http://localhost:3000

# 2. frontend (separate terminal)
cd my-app && npm install && npm start   # http://localhost:3001
```

## Environment

Create a `.env` in the project root:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
PORT=3000
```

S3 uploads use the standard AWS credential chain (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, region + bucket).
