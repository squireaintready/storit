# storit

A clean, private document manager — sign in, upload files, organize and download them, all behind a simple account system.

**Live → [squireaintready.github.io/storit](https://squireaintready.github.io/storit/)**

The live demo runs **entirely in your browser**: files are stored with **IndexedDB** and accounts with the **Web Crypto API** (SHA-256), so nothing is uploaded to a server and the demo always works with no backend to host. A production **Express + MongoDB + S3** backend is also included (`src/`) for a real, multi-user deployment.

## Frontend — `my-app/` (the live demo)

- React 18, plain CSS, no UI library
- **IndexedDB** for file blobs + metadata; **localStorage** session
- Local accounts with SHA-256-hashed passwords (Web Crypto)
- Drag-and-drop upload, rename, download, delete — fully offline, mobile-first

```bash
cd my-app
npm install
npm start          # http://localhost:3000
npm run deploy     # publish the demo to GitHub Pages
```

## Backend — `src/` (production reference)

A token-based REST API for a real deployment, where files live in S3 and metadata in MongoDB.

- Node.js, Express, MongoDB (Mongoose)
- AWS S3 streaming uploads (`multer-s3`)
- JWT auth + bcrypt password hashing
- Routes: `/api/users` (register/login), `/api/files` (upload/list/download/delete)

```bash
npm install
node src/app.js    # http://localhost:3000
```

Environment (`.env` in the project root):

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
PORT=3000
```

S3 uploads use the standard AWS credential chain (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, region + bucket). To point the frontend at this backend instead of IndexedDB, swap the calls in `my-app/src/lib/store.js` for `fetch`/`axios` requests to the API.
