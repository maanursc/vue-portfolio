<template>
  <div class="about">
    <div class="container">
      <div class="card">
        <h1>About Me</h1>
        <p>
          I'm a passionate full-stack developer with expertise in modern web
          technologies. This portfolio showcases my skills in Vue.js,
          TypeScript, and Node.js development.
        </p>

        <div class="skills">
          <h2>Skills</h2>
          <div class="skill-grid">
            <div class="skill-item" v-for="skill in skills" :key="skill">
              {{ skill }}
            </div>
          </div>
        </div>

        <div class="experience">
          <h2>Experience</h2>
          <p>
            Building modern web applications with clean, maintainable code and
            best practices. Experienced in both frontend and backend development
            with a focus on TypeScript and modern JavaScript frameworks.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const skills = ref([
  "Vue.js 3",
  "TypeScript",
  "Node.js",
  "Express.js",
  "Vite",
  "Pinia",
  "Vue Router",
  "REST APIs",
  "Git",
  "Modern CSS",
]);
</script>

<style scoped>
.about {
  padding: 2rem 0;
}

.card {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

h2 {
  color: #555;
  margin: 2rem 0 1rem 0;
}

p {
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.skill-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: transform 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-2px);
}

.experience {
  margin-top: 2rem;
}
</style>
