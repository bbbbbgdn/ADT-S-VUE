<template>
  <div class="projects-grid">
    <ProjectCard
      class="project-card"
      v-for="(image, index) in projectImages"
      :key="index"
      :image="image"
    />
  </div>
</template>

<script>
import ProjectCard from '../components/ProjectCard.vue';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  data() {
    return {
      projectImages: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4'
      ]
    }
  }
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* Creates 2 equal columns */
  width: 100%;
  min-height: 100%;
  height: 100vh;
  /* height: 100%; */
}

.project-card {
  filter: grayscale(100%);
  transition: filter 0.6s ease-out;
}

.project-card:hover {
  filter:grayscale(0%);
  /* height: 50%; */
}

/* Responsive layout for mobile devices */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;  /* Single column on mobile */
  }
}
</style> 