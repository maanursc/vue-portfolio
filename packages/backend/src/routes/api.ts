import express from "express";
import { projectRouter } from "./projects.js";
import { contactRouter } from "./contacts.js";

export const router = express.Router();

// Mount route modules
router.use("/projects", projectRouter);
router.use("/contact", contactRouter);

// Sample API endpoints (keeping for backward compatibility)
router.get("/hello", (req: express.Request, res: express.Response) => {
  res.json({
    message: "Hello from the backend!",
    timestamp: new Date().toISOString(),
    server: "Node.js + TypeScript + Express + MongoDB",
  });
});

router.get("/portfolio", (req: express.Request, res: express.Response) => {
  res.json({
    name: "Your Name",
    title: "Full Stack Developer",
    skills: [
      "Vue.js 3",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "Docker",
    ],
    experience: "3+ years",
    location: "Your Location",
  });
});

// Legacy projects endpoint (for backward compatibility - use /api/projects for full CRUD)
router.get("/projects", (req: express.Request, res: express.Response) => {
  res.json([
    {
      id: 1,
      title: "Vue Portfolio Monorepo",
      description: "A modern portfolio built with Vue 3 and Node.js",
      technologies: ["Vue 3", "TypeScript", "Node.js", "Express"],
      status: "completed",
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution",
      technologies: ["Vue 3", "Node.js", "PostgreSQL", "Stripe"],
      status: "in-progress",
    },
  ]);
});

// Note: Contact form is now handled by /api/contact (POST and GET)
// The following endpoint is kept for legacy support
router.post(
  "/contact-legacy",
  (req: express.Request, res: express.Response) => {
    const { name, email, message } = req.body;

    console.log("Legacy contact form submission:", { name, email, message });

    res.json({
      success: true,
      message:
        "Thank you for your message! Please use /api/contact endpoint for full functionality.",
    });
  }
);
