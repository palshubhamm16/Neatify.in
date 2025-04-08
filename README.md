# Neatify 🚮📲

Neatify is a smart cleanliness reporting app that lets users submit campus or municipality-specific garbage reports and routes them to the relevant authorities. Built with:

- **Frontend:** Expo (React Native)
- **Backend:** Node.js + Express
- **Auth:** Clerk (with custom JWT templates)
- **Storage:** MongoDB Atlas
- **Image Uploads:** Cloudinary

---

## 🔧 Project Structure

```
root/
├── frontend/       # Expo app with Clerk Auth, Report UI, Campus selection
│   └── .env        # Clerk public key, Ngrok backend URL
├── backend/        # Node.js backend with Clerk JWT verification & MongoDB
│   └── .env        # Secrets: Clerk, Cloudinary, MongoDB
└── .gitignore      # Ignores env and sensitive files
```

---

## 🔐 Environment Variables

### 🔸 Frontend (`frontend/.env`)
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok-free.app
```
> Note: Must prefix with `EXPO_PUBLIC_` for Expo to access them.

---

### 🔹 Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri

# Clerk (for JWT verification)
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_JWKS_URL=https://<your-clerk-subdomain>.clerk.accounts.dev/.well-known/jwks.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔑 Clerk JWT Setup

To securely identify users and route them (admin vs regular):

1. Go to [Clerk Dashboard → JWT Templates](https://dashboard.clerk.dev/jwt-templates)
2. Create a **new template** called `neatify`
3. Add the following **custom claim**:

```json
{
  "public_metadata": {
    "email": "{{user.email_address}}",
    "name": "{{user.first_name}} {{user.last_name}}"
  }
}
```

4. Enable the template for your application
5. Use this URL as your JWKS endpoint:

```
https://<your-clerk-subdomain>.clerk.accounts.dev/.well-known/jwks.json
```

6. The backend uses `jose` to validate JWTs against this JWKS.

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/neatify.git
cd neatify
```

### 2. Install dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

---

## ⚙️ Run Locally

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

> Open with **Expo Go** or a simulator.

---

## 🧹 Features

- ✅ Social & Email Login via Clerk
- 🏫 Campus vs 🏙️ Municipality Reporting Modes
- 📸 Image uploads using Cloudinary
- 🔐 Secure JWT-authenticated API calls
- 🧑‍💼 Admin vs User routing (based on email)
- 📍 Campus-based Report Tagging
- 🔎 Admin report filtering by campus
- ✍️ Admin report status updates (Pending/Ongoing/Complete)

---

## 🧾 .gitignore Highlights

```gitignore
# Ignore sensitive & system files
.env*
node_modules/
dist/
.expo/
web-build/
*.pem
*.key
*.p12
*.mobileprovision
.DS_Store
*.tsbuildinfo
```

---

## 📚 Resources

- [Clerk Docs](https://clerk.dev/docs)
- [JWT Verification](https://clerk.dev/docs/backend-requests/verifying)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary](https://cloudinary.com/documentation)
- [Ngrok](https://ngrok.com)
- [Expo Docs](https://docs.expo.dev)
- [Express Docs](https://expressjs.com)

---

## 🔮 Upcoming Features

- 🔔 Notifications for report updates
- 📜 User report history
- 📬 Admin response messaging panel

---

## 🤝 Maintainers

Built with ❤️ by the Neatify.IN team.  
We welcome PRs, feedback, and collaborations!

