# ConvoHub Frontend

Modern, premium real-time chat application built with Next.js 14

## Installation

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Visit \`http://localhost:3000\`

## Features

- ✨ Premium modern UI with dark/light mode
- 🔐 JWT authentication with login & signup
- 💬 Real-time messaging with Socket.IO
- 👥 Group chat management
- 📧 Email invite system
- 👤 User profiles & online status
- 🎨 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🌙 Dark mode support

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Socket.IO Client
- Zustand (State Management)
- Axios
- Framer Motion
- Lucide React Icons

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── login/
│   │   ├── register/
│   │   ├── invite/
│   │   └── chat/
│   ├── components/
│   ├── stores/
│   ├── lib/
│   ├── hooks/
│   └── styles/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
\`\`\`

## Environment Variables

Create a \`.env.local\` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
\`\`\`

## Running the Project

\`\`\`bash
# Development
npm run dev

# Production build
npm run build
npm run start
\`\`\`
