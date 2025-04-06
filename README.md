# Neatify 🚜📉

A smart cleanliness reporting app that lets users submit campus or municipality-specific garbage reports, and routes them to the relevant authorities. Built with Expo (React Native) for frontend, Node.js (Express) for backend, MongoDB Atlas for data storage, and Clerk for authentication.

---

## 🔧 Project Structure

```
root/
├── frontend/       # Expo app with Clerk Auth and Report UI
│   └── .env        # Contains public API keys and Ngrok URL
├── backend/        # Node.js + Express server
│   └── .env        # Mongo URI and Clerk secret key
└── .gitignore       # Secure env files and platform files are ignored
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok-free.app
```

> Prefix with `EXPO_PUBLIC_` to make them available in Expo.

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/neatify.git
cd neatify
```

### 2. Install dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

---

### 3. Set up `.env` files in both folders (see above)

> Be sure to update the Ngrok URL whenever it changes in `frontend/.env`.

---

## 🚡 Run Locally

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npx expo start
```
Open in Expo Go or emulator.

---

## 🕵️‍♂️ Features
- ✅ **User Authentication** with Clerk
- 🏢 **Campus & Municipality Mode** for reporting
- 🔒 **Admin Dashboard** routed by email
- 📃 **Image Upload + Report Storage** in MongoDB
- 🧬 **Admin Filtering**: Only see reports from your assigned campus

---

## ❌ .gitignore Highlights

```gitignore
# Local env files
.env*

# Dependencies and build
node_modules/
dist/
.expo/
web-build/

# Sensitive native files
*.pem
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Others
.DS_Store
*.tsbuildinfo
```

> Ensures all secrets are kept out of GitHub.

---

## 📖 Resources

- [Expo Docs](https://docs.expo.dev)
- [Clerk + Expo](https://clerk.com/docs/expo)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Ngrok](https://ngrok.com)
- [Express Docs](https://expressjs.com)

---

## ✨ Upcoming
- Notifications for report status
- Report history
- Admin response panel

---

## 🚑 Maintainers
Built with ❤️ by the Neatify.IN team. PRs and suggestions welcome!

--