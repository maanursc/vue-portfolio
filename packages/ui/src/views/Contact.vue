<template>
  <div class="contact">
    <div class="container">
      <div class="contact-header">
        <h1>Contact</h1>
        <p>Send me a message and I'll get back to you!</p>
      </div>

      <div class="contact-content">
        <!-- Contact Form -->
        <div class="contact-form-container card">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  maxlength="50"
                  :class="{ error: errors.name }"
                />
                <span v-if="errors.name" class="error-message">{{
                  errors.name
                }}</span>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :class="{ error: errors.email }"
                />
                <span v-if="errors.email" class="error-message">{{
                  errors.email
                }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                required
                maxlength="1000"
                rows="6"
                :class="{ error: errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-message">{{
                errors.message
              }}</span>
            </div>

            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? "Sending..." : "Send Message" }}
            </button>
          </form>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message card">
          <h3>✅ Message Sent!</h3>
          <p>{{ successMessage }}</p>
          <button @click="resetForm" class="btn-secondary">
            Send Another Message
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message card">
          <h3>⚠️ Error</h3>
          <p>{{ errorMessage }}</p>
          <button @click="errorMessage = ''" class="btn-primary">
            Try Again
          </button>
        </div>
      </div>

      <!-- Recent Submissions (Admin View) -->
      <div v-if="showAdmin" class="admin-section card">
        <h3>Recent Contact Submissions</h3>
        <div v-if="loadingSubmissions" class="loading">
          Loading submissions...
        </div>
        <div v-else-if="submissions.length === 0" class="empty-state">
          No contact submissions yet.
        </div>
        <div v-else class="submissions-list">
          <div
            v-for="submission in submissions"
            :key="submission._id"
            class="submission-item"
          >
            <div class="submission-header">
              <strong>{{ submission.name }}</strong>
              <span class="submission-date">{{
                formatDate(submission.createdAt)
              }}</span>
            </div>
            <div class="submission-email">{{ submission.email }}</div>
            <div v-if="submission.subject" class="submission-subject">
              <strong>Subject:</strong> {{ submission.subject }}
            </div>
            <div class="submission-message">{{ submission.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { contactAPI } from "@/services/api";
import type { Contact } from "@/services/api";

// Form state
const form = ref<Contact>({
  name: "",
  email: "",
  subject: "",
  message: "",
});

// Component state
const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const errors = ref<Record<string, string>>({});

// Admin view state
const showAdmin = ref(false);
const submissions = ref<any[]>([]);
const loadingSubmissions = ref(false);

// Form validation
const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = "Name is required";
  } else if (form.value.name.length < 2) {
    errors.value.name = "Name must be at least 2 characters";
  }

  if (!form.value.email.trim()) {
    errors.value.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!form.value.message.trim()) {
    errors.value.message = "Message is required";
  } else if (form.value.message.length < 10) {
    errors.value.message = "Message must be at least 10 characters";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  errorMessage.value = "";

  try {
    const response = await contactAPI.submit({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      subject: form.value.subject?.trim() || undefined,
      message: form.value.message.trim(),
    });

    if (response.success) {
      successMessage.value =
        response.message ||
        "Thank you for your message! I will get back to you soon.";
      form.value = { name: "", email: "", subject: "", message: "" };
      errors.value = {};
    } else {
      errorMessage.value =
        response.message || "Failed to send message. Please try again.";
    }
  } catch (error) {
    errorMessage.value =
      "Network error. Please check your connection and try again.";
    console.error("Contact form error:", error);
  } finally {
    submitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  successMessage.value = "";
  errorMessage.value = "";
  form.value = { name: "", email: "", subject: "", message: "" };
  errors.value = {};
};

// Load contact submissions for admin view
const loadSubmissions = async () => {
  loadingSubmissions.value = true;
  try {
    const response = await contactAPI.getAll({ limit: 10 });
    if (response.success && response.data) {
      submissions.value = response.data.contacts || [];
    }
  } catch (error) {
    console.error("Failed to load submissions:", error);
  } finally {
    loadingSubmissions.value = false;
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Toggle admin view (you can add authentication here)
const toggleAdmin = () => {
  showAdmin.value = !showAdmin.value;
  if (showAdmin.value) {
    loadSubmissions();
  }
};

// Load admin view on mount (for demo purposes)
onMounted(() => {
  // Uncomment this to show admin view by default
  // toggleAdmin();
});

// Add a secret key combination to show admin view
onMounted(() => {
  let keySequence = "";
  const secretCode = "admin";

  document.addEventListener("keydown", (event) => {
    keySequence += event.key.toLowerCase();
    if (keySequence.length > secretCode.length) {
      keySequence = keySequence.slice(-secretCode.length);
    }
    if (keySequence === secretCode) {
      toggleAdmin();
      keySequence = "";
    }
  });
});
</script>

<style scoped>
.contact {
  padding: 2rem 0;
  min-height: 80vh;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-header p {
  font-size: 1.1rem;
  color: #6b7280;
}

.contact-content {
  max-width: 600px;
  margin: 0 auto;
}

.contact-form-container {
  margin-bottom: 2rem;
}

.contact-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
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
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success-message {
  text-align: center;
  padding: 2rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.success-message h3 {
  margin-bottom: 1rem;
  color: #166534;
}

.error-message.card {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.error-message.card h3 {
  margin-bottom: 1rem;
  color: #dc2626;
}

.admin-section {
  margin-top: 3rem;
  padding: 2rem;
}

.admin-section h3 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submission-item {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.submission-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.submission-email {
  color: #667eea;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.submission-subject {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.submission-message {
  color: #374151;
  line-height: 1.5;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
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
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
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
