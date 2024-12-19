<template>
  <section class="shows-section">
    <ImageGallery />
    <ImageGallery />
    <ImageGallery />
    <ImageGallery />
    <ImageGallery />
    <ImageGallery />
  </section>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import ImageGallery from '../components/ImageGallery.vue'
import ProjectCard from '../components/ProjectCard.vue'
import MenuComponent from '../components/MenuComponent.vue'

export default {
  name: 'ComponentsDemo',
  components: {
    BaseButton,
    ImageGallery,
    ProjectCard,
    MenuComponent
  }
}
</script>

<style scoped>
.components-demo {
  /* padding: 2rem; */
}

.demo-section {
  /* margin-bottom: 2rem; */
  /* padding: 1rem; */
  /* border: 1px solid #eee; */
  /* border-radius: 8px; */
}

h1 {
  margin-bottom: 0rem;
}

h2 {
  margin-bottom: 0rem;
}
</style> 