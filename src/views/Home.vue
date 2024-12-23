<template>
  <div class="home">
    <iframe
      src="/main/index.html"
      frameborder="0"
      allowfullscreen
      class="iframe-demo"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.iframe-demo {
  height: 100%;
  width: 100%;
  border: none;
}

/* h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
} */
</style> 