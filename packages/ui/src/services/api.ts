// API configuration and service functions
const API_BASE_URL = "http://localhost:3001/api";

// Helper function to handle API errors
const handleApiError = (error: any): ApiResponse<any> => {
  console.error("API Error:", error);

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      success: false,
      message:
        "Backend server is not running. Please start the backend with: npm run dev:backend",
    };
  }

  return {
    success: false,
    message: error.message || "An unexpected error occurred",
  };
};

// Helper function for making API calls
const apiCall = async <T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Project interface
export interface Project {
  _id?: string;
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  github: string;
  demo?: string;
  category: "Frontend" | "Backend" | "Full-Stack" | "Mobile" | "DevOps";
  status?: "completed" | "in-progress" | "planned";
  year: number;
  icon?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Contact interface
export interface Contact {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// API response interface
export interface ApiResponse<T> {
  mongodb: any;
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Projects API
export const projectsAPI = {
  // Get all projects with optional filters
  getAll: async (params?: {
    category?: string;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ projects: Project[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return apiCall(`${API_BASE_URL}/projects?${queryParams}`);
  },

  // Get single project by ID
  getById: async (id: string): Promise<ApiResponse<Project>> => {
    return apiCall(`${API_BASE_URL}/projects/${id}`);
  },

  // Create new project
  create: async (
    projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Project>> => {
    return apiCall(`${API_BASE_URL}/projects`, {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  // Update project
  update: async (
    id: string,
    projectData: Partial<Project>
  ): Promise<ApiResponse<Project>> => {
    return apiCall(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  deleteProject: async (id: string): Promise<ApiResponse<Project>> => {
    return apiCall(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
    });
  },

  // Get project statistics
  getStats: async (): Promise<ApiResponse<any>> => {
    return apiCall(`${API_BASE_URL}/projects/stats`);
  },
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: async (contactData: Contact): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
    return response.json();
  },

  // Get all contact submissions (admin)
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/contact?${queryParams}`);
    return response.json();
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<ApiResponse<any>> => {
    return apiCall("http://localhost:3001/health");
  },
};
