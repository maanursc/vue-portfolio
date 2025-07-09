import { ref, reactive, onMounted } from "vue";
import { projectsAPI } from "@/services/api";
import type { Project, ApiResponse } from "@/services/api";

export function useProjects() {
  // Reactive state
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = reactive({
    current: 1,
    pages: 0,
    total: 0,
    limit: 10,
  });

  // Filters
  const filters = reactive({
    category: "",
    status: "",
    featured: undefined as boolean | undefined,
  });

  // Fetch projects with filters
  const fetchProjects = async (page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.featured !== undefined && { featured: filters.featured }),
      };

      const response = await projectsAPI.getAll(params);

      if (response.success && response.data) {
        projects.value = response.data.projects;
        Object.assign(pagination, response.data.pagination);
      } else {
        error.value = response.message || "Failed to fetch projects";
      }
    } catch (err) {
      error.value = "Network error: Unable to fetch projects";
      console.error("Error fetching projects:", err);
    } finally {
      loading.value = false;
    }
  };

  // Create new project
  const createProject = async (
    projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsAPI.create(projectData);

      if (response.success) {
        await fetchProjects(pagination.current); // Refresh current page
        return { success: true, message: "Project created successfully!" };
      } else {
        error.value = response.message || "Failed to create project";
        return { success: false, errors: response.errors };
      }
    } catch (err) {
      error.value = "Network error: Unable to create project";
      console.error("Error creating project:", err);
      return { success: false, error: "Network error" };
    } finally {
      loading.value = false;
    }
  };

  // Update project
  const updateProject = async (id: string, projectData: Partial<Project>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsAPI.update(id, projectData);

      if (response.success) {
        await fetchProjects(pagination.current); // Refresh current page
        return { success: true, message: "Project updated successfully!" };
      } else {
        error.value = response.message || "Failed to update project";
        return { success: false, errors: response.errors };
      }
    } catch (err) {
      error.value = "Network error: Unable to update project";
      console.error("Error updating project:", err);
      return { success: false, error: "Network error" };
    } finally {
      loading.value = false;
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsAPI.deleteProject(id);

      if (response.success) {
        await fetchProjects(pagination.current); // Refresh current page
        return { success: true, message: "Project deleted successfully!" };
      } else {
        error.value = response.message || "Failed to delete project";
        return { success: false };
      }
    } catch (err) {
      error.value = "Network error: Unable to delete project";
      console.error("Error deleting project:", err);
      return { success: false, error: "Network error" };
    } finally {
      loading.value = false;
    }
  };

  // Apply filters
  const applyFilters = (newFilters: Partial<typeof filters>) => {
    Object.assign(filters, newFilters);
    fetchProjects(1); // Reset to first page when filtering
  };

  // Clear filters
  const clearFilters = () => {
    filters.category = "";
    filters.status = "";
    filters.featured = undefined;
    fetchProjects(1);
  };

  // Change page
  const changePage = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchProjects(page);
    }
  };

  // Initialize
  onMounted(() => {
    fetchProjects();
  });

  return {
    // State
    projects,
    loading,
    error,
    pagination,
    filters,

    // Methods
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    applyFilters,
    clearFilters,
    changePage,
  };
}
