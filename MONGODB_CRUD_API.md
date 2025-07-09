# 🗄️ MongoDB CRUD API Documentation

## 🚀 **Quick Start**

Your Vue Portfolio now includes a complete MongoDB CRUD API for managing projects and contact form submissions!

### 📋 **Prerequisites**

- ✅ MongoDB installed and running locally on `mongodb://localhost:27017`
- ✅ All dependencies installed via `npm install` (mongoose, joi, etc.)

### 🏃‍♂️ **Start the Backend**

```bash
# Navigate to project root
cd c:\Users\Emmanuel\Projects\vue-portfolio

# Start the backend server
npm run backend:dev
```

### 🌱 **Seed Sample Data**

```bash
# From project root
npm run backend:seed
```

## 📊 **API Endpoints**

### 🎯 **Projects CRUD**

#### **GET /api/projects** - Get All Projects

**Query Parameters:**

- `category` - Filter by category (Frontend, Backend, Full-Stack, Mobile, DevOps)
- `status` - Filter by status (completed, in-progress, planned)
- `featured` - Filter featured projects (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example Requests:**

```bash
# Get all projects
curl http://localhost:3001/api/projects

# Get featured projects only
curl http://localhost:3001/api/projects?featured=true

# Get Full-Stack projects, page 1, 5 items
curl http://localhost:3001/api/projects?category=Full-Stack&page=1&limit=5
```

**Response:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "648f8f8f8f8f8f8f8f8f8f8f",
        "title": "Vue Portfolio Monorepo",
        "description": "A modern portfolio built with Vue 3...",
        "fullDescription": "This portfolio showcases...",
        "technologies": ["Vue 3", "TypeScript", "Node.js"],
        "github": "https://github.com/yourusername/vue-portfolio",
        "demo": "https://your-portfolio.com",
        "category": "Full-Stack",
        "status": "completed",
        "year": 2025,
        "icon": "mdi-web",
        "featured": true,
        "createdAt": "2025-01-08T...",
        "updatedAt": "2025-01-08T..."
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 5,
      "limit": 10
    }
  }
}
```

#### **GET /api/projects/:id** - Get Single Project

```bash
curl http://localhost:3001/api/projects/648f8f8f8f8f8f8f8f8f8f8f
```

#### **POST /api/projects** - Create New Project

**Required Fields:**

- `title` (1-100 chars)
- `description` (1-500 chars)
- `fullDescription` (1-2000 chars)
- `technologies` (array of strings)
- `github` (GitHub/GitLab URL)
- `category` (Frontend, Backend, Full-Stack, Mobile, DevOps)
- `year` (2020-current year+1)

**Optional Fields:**

- `demo` (URL)
- `status` (completed, in-progress, planned) - default: completed
- `icon` (string)
- `featured` (boolean) - default: false

**Example:**

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome App",
    "description": "A great application built with Vue",
    "fullDescription": "This is a comprehensive application that demonstrates...",
    "technologies": ["Vue 3", "TypeScript", "Vite"],
    "github": "https://github.com/yourusername/awesome-app",
    "demo": "https://awesome-app.com",
    "category": "Frontend",
    "year": 2025,
    "featured": true
  }'
```

#### **PUT /api/projects/:id** - Update Project

```bash
curl -X PUT http://localhost:3001/api/projects/648f8f8f8f8f8f8f8f8f8f8f \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "demo": "https://updated-demo.com"
  }'
```

#### **DELETE /api/projects/:id** - Delete Project

```bash
curl -X DELETE http://localhost:3001/api/projects/648f8f8f8f8f8f8f8f8f8f8f
```

### 📧 **Contact Form**

#### **POST /api/contact** - Submit Contact Form

**Required Fields:**

- `name` (2-50 chars)
- `email` (valid email)
- `message` (10-1000 chars)

**Optional Fields:**

- `subject` (5-100 chars)

**Example:**

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential project..."
  }'
```

#### **GET /api/contact** - Get Contact Submissions

```bash
# Get all contact submissions (with pagination)
curl http://localhost:3001/api/contact?page=1&limit=10
```

## 🛠️ **Database Schema**

### 📝 **Project Model**

```typescript
interface IProject {
  title: string; // Required: 1-100 chars
  description: string; // Required: 1-500 chars
  fullDescription: string; // Required: 1-2000 chars
  technologies: string[]; // Required: Array of tech names
  github: string; // Required: GitHub/GitLab URL
  demo?: string; // Optional: Demo URL
  category: string; // Required: Frontend|Backend|Full-Stack|Mobile|DevOps
  status?: string; // Optional: completed|in-progress|planned
  year: number; // Required: 2020-current+1
  icon?: string; // Optional: Icon name
  featured?: boolean; // Optional: Is featured project
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### 📮 **Contact Model**

```typescript
interface IContact {
  name: string; // Required: 2-50 chars
  email: string; // Required: Valid email
  subject?: string; // Optional: 5-100 chars
  message: string; // Required: 10-1000 chars
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

## 🧪 **Testing the API**

### 🌱 **1. Seed Database**

```bash
npm run backend:seed
```

### 🔍 **2. Test Endpoints**

```bash
# Test basic connectivity
curl http://localhost:3001/api/hello

# Get all projects
curl http://localhost:3001/api/projects

# Get featured projects
curl http://localhost:3001/api/projects?featured=true

# Submit contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}'
```

### 📊 **3. Check MongoDB**

```bash
# Connect to MongoDB shell
mongosh

# Use the database
use vue-portfolio

# Check projects collection
db.projects.find().pretty()

# Check contacts collection
db.contacts.find().pretty()

# Count documents
db.projects.countDocuments()
db.contacts.countDocuments()
```

## 🚦 **Error Handling**

### ✅ **Success Response Format**

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Optional success message"
}
```

### ❌ **Error Response Format**

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "error": "Technical error (dev mode only)"
}
```

### 🔍 **Common HTTP Status Codes**

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🌐 **Environment Variables**

Make sure your `.env` file in `packages/backend/` contains:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/vue-portfolio

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Security (for future auth features)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

## 🔧 **Integration with Frontend**

### 📦 **Example Frontend API Client**

```typescript
// utils/api.ts
const API_BASE = "http://localhost:3001/api";

export const projectsAPI = {
  // Get all projects
  getAll: (params?: { category?: string; featured?: boolean }) =>
    fetch(`${API_BASE}/projects?${new URLSearchParams(params as any)}`).then(
      (r) => r.json()
    ),

  // Get single project
  getById: (id: string) =>
    fetch(`${API_BASE}/projects/${id}`).then((r) => r.json()),

  // Create project
  create: (data: ProjectData) =>
    fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Update project
  update: (id: string, data: Partial<ProjectData>) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Delete project
  delete: (id: string) =>
    fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" }).then((r) =>
      r.json()
    ),
};

export const contactAPI = {
  // Submit contact form
  submit: (data: ContactData) =>
    fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};
```

### 🎯 **Vue Composable Example**

```typescript
// composables/useProjects.ts
import { ref, onMounted } from "vue";
import { projectsAPI } from "@/utils/api";

export function useProjects() {
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchProjects = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsAPI.getAll(filters);
      if (response.success) {
        projects.value = response.data.projects;
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = "Failed to fetch projects";
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => fetchProjects());

  return {
    projects,
    loading,
    error,
    fetchProjects,
  };
}
```

## 🎉 **You're All Set!**

Your MongoDB CRUD API is now fully functional with:

- ✅ **Complete Project CRUD** with validation and pagination
- ✅ **Contact Form** with database storage
- ✅ **Sample Data Seeding** for testing
- ✅ **Professional Error Handling**
- ✅ **TypeScript Support** throughout
- ✅ **Ready for Frontend Integration**

**Next Steps:**

1. Start the backend: `npm run backend:dev`
2. Seed sample data: `npm run backend:seed`
3. Test the API endpoints
4. Integrate with your Vue microfrontends
5. Add authentication (optional)
6. Deploy to production (optional)

---

**Happy coding! 🚀**
