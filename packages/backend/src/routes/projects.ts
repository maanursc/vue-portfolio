import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from "../controllers/projectController.js";

export const projectRouter = express.Router();

// GET /api/projects/stats - Get project statistics (must be before /:id route)
projectRouter.get("/stats", getProjectStats);

// GET /api/projects - Get all projects (with filtering and pagination)
projectRouter.get("/", getAllProjects);

// GET /api/projects/:id - Get a specific project by ID
projectRouter.get("/:id", getProjectById);

// POST /api/projects - Create a new project
projectRouter.post("/", createProject);

// PUT /api/projects/:id - Update a project
projectRouter.put("/:id", updateProject);

// DELETE /api/projects/:id - Delete a project
projectRouter.delete("/:id", deleteProject);
