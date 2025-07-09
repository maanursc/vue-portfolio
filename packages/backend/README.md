# Backend API

This folder contains the Node.js + TypeScript backend API.

## Quick Start

```bash
npm run dev    # Start development server with hot reload
npm run build  # Build TypeScript to JavaScript
npm run start  # Start production server
```

## API Endpoints

- `GET /api/hello` - Simple hello message
- `GET /api/portfolio` - Portfolio information
- `GET /api/projects` - List of projects
- `POST /api/contact` - Contact form submission
- `GET /health` - Health check

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Technologies

- Node.js
- Express.js
- TypeScript
- CORS, Helmet, Compression
- ESLint
