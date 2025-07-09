import { Request, Response } from "express";
import Project, { IProject } from "../models/Project.js";
import Joi from "joi";

// Validation schema
const projectValidationSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  fullDescription: Joi.string().min(1).max(2000).required(),
  technologies: Joi.array().items(Joi.string()).min(1).required(),
  github: Joi.string()
    .uri()
    .pattern(/^https:\/\/(github\.com|gitlab\.com)/)
    .required(),
  demo: Joi.string().uri().optional().allow(""),
  category: Joi.string()
    .valid("Frontend", "Backend", "Full-Stack", "Mobile", "DevOps")
    .required(),
  status: Joi.string().valid("completed", "in-progress", "planned").optional(),
  year: Joi.number()
    .integer()
    .min(2020)
    .max(new Date().getFullYear() + 1)
    .required(),
  icon: Joi.string().optional(),
  featured: Joi.boolean().optional(),
});

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, status, featured, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === "true";

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const projects = await Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Get project by ID
export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Create new project
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = projectValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const project = new Project(value);
    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Update project
export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = projectValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Delete project
export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Get project statistics
export const getProjectStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          planned: { $sum: { $cond: [{ $eq: ["$status", "planned"] }, 1, 0] } },
          featured: { $sum: { $cond: ["$featured", 1, 0] } },
        },
      },
    ]);

    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          total: 0,
          completed: 0,
          inProgress: 0,
          planned: 0,
          featured: 0,
        },
        categories: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project statistics",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
