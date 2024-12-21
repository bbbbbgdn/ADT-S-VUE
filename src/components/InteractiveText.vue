<template>
  <div class="interactive-container">
    <iframe 
      src="https://cables.gl/view/p8u1En"
      class="interactive-frame"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'InteractiveText'
}
</script>

<style>
.interactive-container {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.interactive-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
