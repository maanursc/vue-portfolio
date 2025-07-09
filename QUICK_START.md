# 🚀 Quick Start Guide - MongoDB CRUD API

## ✅ **Setup Complete!**

Your Vue Portfolio now has a complete MongoDB CRUD API! Here's how to test it:

## 🧪 **Test the Setup**

### 1. **Test MongoDB Connection**

```bash
cd packages/backend
npm run test-db
```

This will:

- ✅ Connect to MongoDB
- ✅ Create a test project
- ✅ Verify CRUD operations
- ✅ Clean up test data

### 2. **Seed Sample Data**

```bash
# From project root
npm run backend:seed

# Or from backend directory
cd packages/backend
npm run seed
```

### 3. **Start the Backend Server**

```bash
# From project root
npm run dev:backend

# Or from backend directory
cd packages/backend
npm run dev
```

### 4. **Test API Endpoints**

Once the server is running on `http://localhost:3001`, you can test:

**Health Check:**

```bash
curl http://localhost:3001/health
```

**Get All Projects:**

```bash
curl http://localhost:3001/api/projects
```

**Create a New Project:**

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A sample project",
    "fullDescription": "This is a full description of my sample project with more details.",
    "technologies": ["Vue 3", "TypeScript"],
    "github": "https://github.com/yourusername/my-new-project",
    "category": "Frontend",
    "year": 2025
  }'
```

**Submit Contact Form:**

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a test message from the contact form."
  }'
```

## 🗄️ **MongoDB Collections**

Your database `vue-portfolio` will have:

- **projects** - All your portfolio projects
- **contacts** - Contact form submissions

## 🎯 **What's Working**

✅ **MongoDB Connection** with automatic reconnection  
✅ **Project CRUD** with validation and pagination  
✅ **Contact Form** with database storage  
✅ **Error Handling** with proper HTTP status codes  
✅ **TypeScript** support throughout  
✅ **Data Validation** using Joi schemas  
✅ **Sample Data** for testing

## 🔧 **Environment Variables**

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

## 🚀 **Start Development**

To start the full development environment:

```bash
# Start all microfrontends + backend
npm run dev
```

This starts:

- 🏠 **Shell App**: http://localhost:3000
- 👤 **Portfolio MF**: http://localhost:3001
- 📁 **Projects MF**: http://localhost:3002
- 🔌 **Backend API**: http://localhost:3001

## 📚 **Documentation**

- **[Complete API Documentation](../MONGODB_CRUD_API.md)**
- **[Microfrontend Guide](../MICROFRONTEND_README.md)**
- **[Vuetify UI Guide](../VUETIFY_GUIDE.md)**

## 🎉 **You're Ready!**

Your MongoDB CRUD API is fully functional and ready for development. Start building amazing features! 🚀
