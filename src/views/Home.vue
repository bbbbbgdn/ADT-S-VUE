<template>
  <div class="home">

  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    // Add fade-in class after a short delay to ensure initial opacity is set
    setTimeout(() => {
      this.$el.classList.add('fade-in');
    }, 50);
  }
}
</script>

<style>
body {
  background-color: transparent;
}
</style>

<style scoped>
.home {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-image: url('/main/assets/DSC00121@0.5x2.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.8s ease-out;
}

.home.fade-in {
  opacity: 1;
}

.content {
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

h1 {
  font-size: 3rem;
  margin: 0;
}

/* .iframe-demo {
  height: 100%;
  width: 100%;
  border: none;
} */

/* h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
} */
</style> 