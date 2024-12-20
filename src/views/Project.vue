
<template>
  <div class="project-page">
    <!-- Импортированный заголовок -->
    <ImageGallery />

    <!-- Контейнер с текстом -->
    <div class="text-container">
      <p>Millions of Ukrainians have been driven from their homes by war. The intimate relationship with their homeland was abruptly broken. What does that relationship consist of? What defines a home(land)? With these fundamental questions, the exhibition Home(Land) not only zooms in on the war in Ukraine but also on underlying themes such as: how important are traditions and heritage? What happens when war takes away this physical and tangible connection to a place and its people?</p>

      <p>Dasha Tsapenko together with a team of Ukrainian and Dutch curators brought together designers from Ukraine and The Netherlands to explore these questions, based on the belief that new perspectives can be found in design. The results of this knowledge exchange demonstrate various sustainable and ethical design practices. Traditional crafts and techniques, local materials and innovative knowledge on bio-design and sustainable production processes are (re)discovered and connected.</p>
    </div>

    <!-- Кнопка для перехода на другие шоу -->
    <div class="button-container">
      <BaseButton to="/shows">Other Shows</BaseButton>
    </div>
    <ImageGallery />
    <ImageGallery />
    <ImageGallery />

  </div>
</template>

  <script>
import BaseButton from '../components/BaseButton.vue'
import ImageGallery from '../components/ImageGallery.vue'
  
  export default {
    name: 'ProjectPage',
    components: {
      ImageGallery,
      BaseButton
    }
  }
  </script>

<style scoped>
.project-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.text-container {
  margin: 20px 0;
  text-align: center;
}

.button-container {
  margin: 20px 0;
}
</style>
