<template>
  <div class="projects">
    <div class="container">
      <!-- Header Section -->
      <div class="projects-header">
        <h1>Project Manager</h1>
        <p>Manage your portfolio projects with full CRUD operations</p>
        <button @click="showCreateModal = true" class="btn-primary">
          ➕ Add New Project
        </button>
      </div>

      <!-- Filters Section -->
      <div class="filters card">
        <h3>Filters</h3>
        <div class="filter-grid">
          <div class="filter-group">
            <label>Category:</label>
            <select
              v-model="filters.category"
              @change="applyFilters({ category: filters.category })"
            >
              <option value="">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status:</label>
            <select
              v-model="filters.status"
              @change="applyFilters({ status: filters.status })"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Featured:</label>
            <select
              v-model="filters.featured"
              @change="applyFilters({ featured: filters.featured })"
            >
              <option value="">All Projects</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>
          <button @click="clearFilters" class="btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading projects...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error card">
        <h3>⚠️ Error</h3>
        <p>{{ error }}</p>
        <button @click="fetchProjects()" class="btn-primary">Retry</button>
      </div>

      <!-- Projects Grid -->
      <div v-if="!loading && !error" class="projects-content">
        <div v-if="projects.length === 0" class="empty-state card">
          <h3>No Projects Found</h3>
          <p>
            {{
              Object.values(filters).some((f) => f)
                ? "Try adjusting your filters or"
                : ""
            }}
            Create your first project to get started!
          </p>
          <button @click="showCreateModal = true" class="btn-primary">
            Add Project
          </button>
        </div>

        <div v-else class="project-grid">
          <div
            v-for="project in projects"
            :key="project._id"
            class="project-card"
          >
            <div class="project-header">
              <h3>{{ project.title }}</h3>
              <div class="project-actions">
                <button
                  @click="editProject(project)"
                  class="btn-icon"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="deleteProjectConfirm(project)"
                  class="btn-icon delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p class="project-description">{{ project.description }}</p>

            <div class="project-meta">
              <span
                class="category-badge"
                :class="project.category.toLowerCase()"
              >
                {{ project.category }}
              </span>
              <span class="status-badge" :class="project.status">
                {{ project.status }}
              </span>
              <span v-if="project.featured" class="featured-badge"
                >⭐ Featured</span
              >
            </div>

            <div class="project-tech">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>

            <div class="project-footer">
              <div class="project-links">
                <a :href="project.github" target="_blank" class="btn-link"
                  >GitHub</a
                >
                <a
                  v-if="project.demo"
                  :href="project.demo"
                  target="_blank"
                  class="btn-link"
                  >Demo</a
                >
              </div>
              <div class="project-year">{{ project.year }}</div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="pagination">
          <button
            @click="changePage(pagination.current - 1)"
            :disabled="pagination.current === 1"
            class="btn-secondary"
          >
            Previous
          </button>
          <span class="page-info">
            Page {{ pagination.current }} of {{ pagination.pages }} ({{
              pagination.total
            }}
            total)
          </span>
          <button
            @click="changePage(pagination.current + 1)"
            :disabled="pagination.current === pagination.pages"
            class="btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ProjectModal
      v-if="showCreateModal || showEditModal"
      :project="editingProject"
      :is-editing="showEditModal"
      @close="closeModal"
      @save="handleSaveProject"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click="showDeleteModal = false"
    >
      <div class="modal delete-modal" @click.stop>
        <h3>Delete Project</h3>
        <p>Are you sure you want to delete "{{ deletingProject?.title }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="confirmDelete" class="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProjects } from "@/composables/useProjects";
import type { Project } from "@/services/api";
import ProjectModal from "@/components/ProjectModal.vue";

// Use the projects composable for CRUD operations
const {
  projects,
  loading,
  error,
  pagination,
  filters,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  applyFilters,
  clearFilters,
  changePage,
} = useProjects();

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Editing state
const editingProject = ref<Project | null>(null);
const deletingProject = ref<Project | null>(null);

// Modal actions
const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingProject.value = null;
};

const editProject = (project: Project) => {
  editingProject.value = { ...project };
  showEditModal.value = true;
};

const deleteProjectConfirm = (project: Project) => {
  deletingProject.value = project;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (deletingProject.value?._id) {
    const result = await deleteProject(deletingProject.value._id);
    if (result.success) {
      // Show success message (you can add a toast notification here)
      console.log("Project deleted successfully!");
    }
  }
  showDeleteModal.value = false;
  deletingProject.value = null;
};

const handleSaveProject = async (
  projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">
) => {
  let result;

  if (showEditModal.value && editingProject.value?._id) {
    // Update existing project
    result = await updateProject(editingProject.value._id, projectData);
  } else {
    // Create new project
    result = await createProject(projectData);
  }

  if (result.success) {
    closeModal();
    // Show success message (you can add a toast notification here)
    console.log(result.message || "Project saved successfully!");
  } else {
    // Handle validation errors (you can show them in the modal)
    console.error("Save failed:", result.errors || result.error);
  }
};
</script>

<style scoped>
.projects {
  padding: 2rem 0;
}

.card {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.project-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.btn-link {
  background: transparent;
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-link:hover {
  background: #667eea;
  color: white;
}
</style>
