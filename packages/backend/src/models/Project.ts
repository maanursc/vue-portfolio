import mongoose, { Document, Schema } from "mongoose";

// Project Interface
export interface IProject extends Document {
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  github: string;
  demo?: string;
  category: "Frontend" | "Backend" | "Full-Stack" | "Mobile" | "DevOps";
  status: "completed" | "in-progress" | "planned";
  year: number;
  icon: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Project Schema
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
      maxlength: [2000, "Full description cannot exceed 2000 characters"],
    },
    technologies: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    github: {
      type: String,
      required: [true, "GitHub URL is required"],
      validate: {
        validator: function (v: string) {
          return /^https:\/\/(github\.com|gitlab\.com)/.test(v);
        },
        message: "Please provide a valid GitHub or GitLab URL",
      },
    },
    demo: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Please provide a valid URL",
      },
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
      enum: {
        values: ["Frontend", "Backend", "Full-Stack", "Mobile", "DevOps"],
        message:
          "Category must be Frontend, Backend, Full-Stack, Mobile, or DevOps",
      },
    },
    status: {
      type: String,
      required: [true, "Project status is required"],
      enum: {
        values: ["completed", "in-progress", "planned"],
        message: "Status must be completed, in-progress, or planned",
      },
      default: "in-progress",
    },
    year: {
      type: Number,
      required: [true, "Project year is required"],
      min: [2020, "Year must be 2020 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be more than next year"],
    },
    icon: {
      type: String,
      required: [true, "Project icon is required"],
      default: "🚀",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });
ProjectSchema.index({ year: -1 });

export default mongoose.model<IProject>("Project", ProjectSchema);
