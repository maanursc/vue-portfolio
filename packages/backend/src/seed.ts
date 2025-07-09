import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Project from "./models/Project.js";

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing projects
    await Project.deleteMany({});
    console.log("🧹 Cleared existing projects");

    // Sample projects data
    const sampleProjects = [
      {
        title: "Vue Portfolio Monorepo",
        description:
          "A modern portfolio built with Vue 3, TypeScript, and microfrontend architecture",
        fullDescription:
          "This portfolio showcases a complete monorepo setup with Vue 3, TypeScript, and a microfrontend architecture using Vite Federation. It includes a Node.js backend with MongoDB integration, Vuetify components, and a professional design system.",
        technologies: [
          "Vue 3",
          "TypeScript",
          "Node.js",
          "Express",
          "MongoDB",
          "Vite",
          "Vuetify",
        ],
        github: "https://github.com/yourusername/vue-portfolio",
        demo: "https://your-portfolio.com",
        category: "Full-Stack",
        status: "completed",
        year: 2025,
        icon: "mdi-web",
        featured: true,
      },
      {
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution with payment integration",
        fullDescription:
          "A comprehensive e-commerce platform built with modern technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard.",
        technologies: [
          "Vue 3",
          "Node.js",
          "PostgreSQL",
          "Stripe",
          "JWT",
          "Docker",
        ],
        github: "https://github.com/yourusername/ecommerce-platform",
        demo: "https://ecommerce-demo.com",
        category: "Full-Stack",
        status: "in-progress",
        year: 2024,
        icon: "mdi-shopping",
        featured: true,
      },
      {
        title: "Task Management App",
        description: "Collaborative task management with real-time updates",
        fullDescription:
          "A real-time task management application similar to Trello. Features drag-and-drop boards, real-time collaboration using WebSockets, team management, file attachments, and deadline tracking.",
        technologies: ["Vue 3", "Socket.io", "Node.js", "MongoDB", "Redis"],
        github: "https://github.com/yourusername/task-manager",
        demo: "",
        category: "Frontend",
        status: "completed",
        year: 2024,
        icon: "mdi-clipboard-check",
        featured: false,
      },
      {
        title: "Weather Dashboard",
        description: "Interactive weather dashboard with data visualization",
        fullDescription:
          "A beautiful weather dashboard that displays current conditions, forecasts, and historical data with interactive charts and maps. Integrates with multiple weather APIs for accurate data.",
        technologies: [
          "Vue 3",
          "Chart.js",
          "Mapbox",
          "Weather API",
          "TypeScript",
        ],
        github: "https://github.com/yourusername/weather-dashboard",
        demo: "https://weather-demo.com",
        category: "Frontend",
        status: "completed",
        year: 2023,
        icon: "mdi-weather-cloudy",
        featured: false,
      },
      {
        title: "DevOps CI/CD Pipeline",
        description: "Automated deployment pipeline with Docker and Kubernetes",
        fullDescription:
          "A complete DevOps solution implementing CI/CD pipelines using GitHub Actions, Docker containerization, and Kubernetes orchestration. Includes automated testing, security scanning, and blue-green deployments.",
        technologies: [
          "Docker",
          "Kubernetes",
          "GitHub Actions",
          "Terraform",
          "AWS",
        ],
        github: "https://github.com/yourusername/devops-pipeline",
        demo: "",
        category: "DevOps",
        status: "planned",
        year: 2025,
        icon: "mdi-rocket-launch",
        featured: false,
      },
    ];

    // Insert sample projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(`✅ Seeded ${projects.length} projects`);

    // Log the created projects
    projects.forEach((project: any) => {
      console.log(
        `📝 ${project.title} (${project.category}) - ${project.status}`
      );
    });

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
