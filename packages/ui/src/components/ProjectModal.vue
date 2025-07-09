<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? "Edit Project" : "Create New Project" }}</h3>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="project-form">
        <div class="form-grid">
          <!-- Title -->
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              maxlength="100"
              :class="{ error: errors.title }"
            />
            <span v-if="errors.title" class="error-message">{{
              errors.title
            }}</span>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label for="category">Category *</label>
            <select
              id="category"
              v-model="form.category"
              required
              :class="{ error: errors.category }"
            >
              <option value="">Select Category</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
            </select>
            <span v-if="errors.category" class="error-message">{{
              errors.category
            }}</span>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="form.status">
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>

          <!-- Year -->
          <div class="form-group">
            <label for="year">Year *</label>
            <input
              id="year"
              v-model.number="form.year"
              type="number"
              :min="2020"
              :max="new Date().getFullYear() + 1"
              required
              :class="{ error: errors.year }"
            />
            <span v-if="errors.year" class="error-message">{{
              errors.year
            }}</span>
          </div>

          <!-- Featured -->
          <div class="form-group checkbox-group">
            <label>
              <input v-model="form.featured" type="checkbox" />
              Featured Project
            </label>
          </div>

          <!-- Icon -->
          <div class="form-group">
            <label for="icon">Icon (MDI name)</label>
            <input
              id="icon"
              v-model="form.icon"
              type="text"
              placeholder="e.g., mdi-web, mdi-mobile, mdi-server"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            v-model="form.description"
            required
            maxlength="500"
            rows="3"
            :class="{ error: errors.description }"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{
            errors.description
          }}</span>
        </div>

        <!-- Full Description -->
        <div class="form-group">
          <label for="fullDescription">Full Description *</label>
          <textarea
            id="fullDescription"
            v-model="form.fullDescription"
            required
            maxlength="2000"
            rows="5"
            :class="{ error: errors.fullDescription }"
          ></textarea>
          <span v-if="errors.fullDescription" class="error-message">{{
            errors.fullDescription
          }}</span>
        </div>

        <!-- Technologies -->
        <div class="form-group">
          <label for="technologies">Technologies *</label>
          <input
            id="technologies"
            v-model="technologiesText"
            type="text"
            required
            placeholder="Vue 3, TypeScript, Node.js (comma-separated)"
            :class="{ error: errors.technologies }"
          />
          <small>Enter technologies separated by commas</small>
          <span v-if="errors.technologies" class="error-message">{{
            errors.technologies
          }}</span>
        </div>

        <!-- GitHub URL -->
        <div class="form-group">
          <label for="github">GitHub URL *</label>
          <input
            id="github"
            v-model="form.github"
            type="url"
            required
            placeholder="https://github.com/username/repository"
            :class="{ error: errors.github }"
          />
          <span v-if="errors.github" class="error-message">{{
            errors.github
          }}</span>
        </div>

        <!-- Demo URL -->
        <div class="form-group">
          <label for="demo">Demo URL</label>
          <input
            id="demo"
            v-model="form.demo"
            type="url"
            placeholder="https://your-demo-site.com"
            :class="{ error: errors.demo }"
          />
          <span v-if="errors.demo" class="error-message">{{
            errors.demo
          }}</span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{
              saving
                ? "Saving..."
                : isEditing
                ? "Update Project"
                : "Create Project"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Project } from "@/services/api";

interface Props {
  project?: Project | null;
  isEditing?: boolean;
}

interface Emits {
  close: [];
  save: [projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">];
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  isEditing: false,
});

const emit = defineEmits<Emits>();

// Form state
const form = ref({
  title: "",
  description: "",
  fullDescription: "",
  technologies: [] as string[],
  github: "",
  demo: "",
  category: "" as Project["category"],
  status: "completed" as Project["status"],
  year: new Date().getFullYear(),
  icon: "",
  featured: false,
});

// Technologies as text for easier editing
const technologiesText = ref("");

// Form validation errors
const errors = ref<Record<string, string>>({});

// Saving state
const saving = ref(false);

// Watch for project prop changes (when editing)
watch(
  () => props.project,
  (project) => {
    if (project) {
      form.value = {
        title: project.title,
        description: project.description,
        fullDescription: project.fullDescription,
        technologies: [...project.technologies],
        github: project.github,
        demo: project.demo || "",
        category: project.category,
        status: project.status || "completed",
        year: project.year,
        icon: project.icon || "",
        featured: project.featured || false,
      };
      technologiesText.value = project.technologies.join(", ");
    }
  },
  { immediate: true }
);

// Clear errors when form changes
watch(
  () => form.value,
  () => {
    errors.value = {};
  },
  { deep: true }
);

// Update technologies array when text changes
watch(technologiesText, (text) => {
  form.value.technologies = text
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);
});

// Form validation
const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = "Title is required";
  }

  if (!form.value.description.trim()) {
    errors.value.description = "Description is required";
  }

  if (!form.value.fullDescription.trim()) {
    errors.value.fullDescription = "Full description is required";
  }

  if (form.value.technologies.length === 0) {
    errors.value.technologies = "At least one technology is required";
  }

  if (!form.value.github.trim()) {
    errors.value.github = "GitHub URL is required";
  } else if (!/^https:\/\/(github\.com|gitlab\.com)/.test(form.value.github)) {
    errors.value.github = "Must be a valid GitHub or GitLab URL";
  }

  if (!form.value.category) {
    errors.value.category = "Category is required";
  }

  if (
    !form.value.year ||
    form.value.year < 2020 ||
    form.value.year > new Date().getFullYear() + 1
  ) {
    errors.value.year = "Year must be between 2020 and next year";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  saving.value = true;

  try {
    const projectData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      fullDescription: form.value.fullDescription.trim(),
      technologies: form.value.technologies,
      github: form.value.github.trim(),
      demo: form.value.demo.trim() || undefined,
      category: form.value.category,
      status: form.value.status,
      year: form.value.year,
      icon: form.value.icon.trim() || undefined,
      featured: form.value.featured,
    };

    emit("save", projectData);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.project-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.form-group small {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
}

.checkbox-group input {
  margin-right: 0.5rem;
  width: auto;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}
</style>
