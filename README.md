# Vue Portfolio CRUD

A modern full-stack web application built with Vue 3, TypeScript, Node.js, and MongoDB for managing portfolio projects with complete CRUD operations.

## Features

- 🎯 **Full CRUD Operations**: Create, Read, Update, Delete projects
- 🏗️ **Modern Tech Stack**: Vue 3 + Vite + TypeScript + Node.js + Express + MongoDB
- 🎨 **Beautiful UI**: Vuetify 3 (Material Design)
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Advanced Filtering**: Filter projects by category, status, and featured status
- 📄 **Pagination**: Handle large datasets efficiently
- 📊 **Dashboard**: Real-time project statistics
- 📬 **Contact Form**: Save contact submissions to database

## Project Structure

```
vue-portfolio/
├── packages/
│   ├── backend/          # Node.js + Express + MongoDB API
│   └── ui/              # Vue 3 + Vite + TypeScript frontend
├── package.json         # Workspace configuration
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB (local or cloud)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd vue-portfolio
   npm install
   ```

2. **Start MongoDB:**

   ```bash
   # If using local MongoDB
   mongod

   # Or make sure your MongoDB service is running
   ```

3. **Seed the database (optional):**

   ```bash
   npm run backend:seed
   ```

4. **Start both frontend and backend:**

   ```bash
   npm run dev
   ```

   Or start them separately:

   ```bash
   # Terminal 1 - Backend (http://localhost:3001)
   npm run dev:backend

   # Terminal 2 - Frontend (http://localhost:5173)
   npm run dev:ui
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats` - Get project statistics

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions

## Environment Variables

Create `.env` files in the backend package:

```env
# packages/backend/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vue-portfolio
```

## Development Scripts

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:ui

# Build all packages
npm run build

# Lint all packages
npm run lint

# Type check all packages
npm run type-check

# Seed database with sample data
npm run backend:seed
```

## VS Code Tasks

Use Ctrl+Shift+P → "Tasks: Run Task" to run:

- **Start Backend Dev Server** - Start the API server
- **Start Frontend UI** - Start the Vue app
- **Start Full Stack** - Start both simultaneously

## Tech Stack

### Frontend (packages/ui)

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Vuetify 3** - Material Design component library
- **Vue Router** - Client-side routing
- **Pinia** - State management (via composables)

### Backend (packages/backend)

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database and ODM
- **Joi** - Data validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Project Features

### Dashboard

- Real-time project statistics
- Overview of total projects, categories, and completion status

### Projects Management

- Create new projects with rich details
- Edit existing projects
- Delete projects with confirmation
- Filter by category, status, and featured status
- Pagination for large datasets
- Responsive grid layout

### Contact Management

- Contact form submission
- Admin view for contact submissions
- Data persistence in MongoDB

## Database Schema

### Project Model

```typescript
{
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  github: string;
  demo?: string;
  category: "Frontend" | "Backend" | "Full-Stack" | "Mobile" | "DevOps";
  status: "completed" | "in-progress" | "planned";
  year: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Contact Model

```typescript
{
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
}
```

## License

MIT License - see LICENSE file for details.
