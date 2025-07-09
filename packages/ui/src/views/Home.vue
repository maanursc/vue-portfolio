<template>
  <div class="dashboard">
    <div class="container">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Project Dashboard</h1>
        <p class="dashboard-subtitle">
          Manage your portfolio projects with MongoDB CRUD
        </p>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.overview.total }}</div>
          <div class="stat-label">Total Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.overview.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.overview.inProgress }}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.overview.featured }}</div>
          <div class="stat-label">Featured</div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div
        v-if="stats && stats.categories.length"
        class="category-section card"
      >
        <h3>Projects by Category</h3>
        <div class="category-grid">
          <div
            v-for="category in stats.categories"
            :key="category._id"
            class="category-item"
          >
            <span class="category-name">{{ category._id }}</span>
            <span class="category-count">{{ category.count }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <router-link to="/projects" class="btn-primary">
          🗂️ Manage Projects
        </router-link>
        <router-link to="/contact" class="btn-secondary">
          📧 Contact Form
        </router-link>
      </div>

      <!-- System Status -->
      <div class="system-status card">
        <h3>System Status</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">MongoDB:</span>
            <span
              class="status-value"
              :class="{
                'status-success': mongoStatus === 'connected',
                'status-error': mongoStatus !== 'connected',
              }"
            >
              {{ mongoStatus === "connected" ? "Connected" : "Disconnected" }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">API Backend:</span>
            <span
              class="status-value"
              :class="{
                'status-success': backendStatus === 'running',
                'status-error': backendStatus !== 'running',
              }"
            >
              {{ backendStatus === "running" ? "Running" : "Disconnected" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error card">
        <h3>⚠️ Connection Error</h3>
        <p>{{ error }}</p>
        <button @click="loadDashboard" class="btn-primary">Retry</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { projectsAPI, healthAPI } from "@/services/api";

const stats = ref<any>(null);
const loading = ref(false);
const error = ref("");
const mongoStatus = ref("disconnected");
const backendStatus = ref("disconnected");

const loadDashboard = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Check backend health and MongoDB status
    const healthResponse = await healthAPI.check();
    console.log("Health check response:", healthResponse);
    if (healthResponse) {
      backendStatus.value = "running";
      mongoStatus.value = healthResponse.mongodb?.status || "disconnected";
    } else {
      backendStatus.value = "disconnected";
      mongoStatus.value = "disconnected";
    }

    // Fetch project statistics
    const response = await projectsAPI.getStats();

    if (response.success && response.data) {
      stats.value = response.data;
    } else {
      error.value = response.message || "Failed to load dashboard data";
    }
  } catch (err) {
    error.value = "Failed to connect to the backend API";
    backendStatus.value = "disconnected";
    mongoStatus.value = "disconnected";
    console.error("Dashboard loading error:", err);
  } finally {
    loading.value = false;
  }
};

// Load dashboard data on component mount
onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
  min-height: 80vh;
}

.dashboard-header {
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-section {
  margin-bottom: 3rem;
}

.category-section h3 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.category-grid {
  display: grid;
  gap: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.category-name {
  font-weight: 500;
  color: #374151;
}

.category-count {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.system-status {
  margin-bottom: 2rem;
}

.system-status h3 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.status-grid {
  display: grid;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.status-label {
  font-weight: 500;
  color: #374151;
}

.status-value {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-success {
  background: #10b981;
  color: white;
}

.status-error {
  background: #ef4444;
  color: white;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.btn-primary,
.btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid #ffd700;
  display: inline-block;
}

.btn-secondary:hover {
  background: #ffd700;
  color: #333;
}

.api-data {
  margin-top: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.loading,
.error {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
}

.loading {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.error {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

pre {
  text-align: left;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
