🚀 ConvoHub – Real-Time Chat Application

A modern real-time chat application built using Next.js, Node.js, MongoDB, and Socket.IO.

✨ Features

Real-time messaging (Socket.IO)

One-to-One & Group Chats

JWT Authentication

Online / Offline user status

Typing indicators & read receipts

Image uploads (Cloudinary)

Dark / Light mode

Fully responsive UI

🛠 Tech Stack

Frontend: Next.js 14, React 18, Tailwind CSS, Zustand
Backend: Node.js, Express, MongoDB, Socket.IO
Deployment: Frontend – Vercel | Backend – Render

⚙️ Environment Variables
Backend (backend/.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:3000

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

🚀 Run Locally
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev


Open 👉 http://localhost:3000

📌 Notes

Use Gmail App Password for emails

Use MongoDB Atlas for database

Use Cloudinary for image uploads
