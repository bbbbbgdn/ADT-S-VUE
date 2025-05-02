<template>
  <div class="home" :class="{ 'image-loaded': isLoaded }">
    <div class="title-text">Atelier Dasha Tsapenko</div>
    <iframe
      class="video-background"
      src="/homepage_video/index.html"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isLoaded: false
    }
  },
  methods: {
    onIframeLoad() {
      this.isLoaded = true;
    }
  },
  beforeUnmount() {
    this.isLoaded = false;
    const homeElement = document.querySelector('.home');
    if (homeElement) {
      homeElement.style.display = 'none';
    }
  }
}
</script>

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
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.home:not(.image-loaded) {
  display: none;
}

.image-loaded {
  opacity: 1;
}

.content {
  text-align: center;
  color: white;
  padding: 2rem;
  /* background-color: rgba(0, 0, 0, 0.5); */
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

@media screen and (orientation: portrait) {
  .home {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100vh;
    height: 100vw;
    transform: translate(-50%, -50%) rotate(-90deg) scale(1.1);
    transform-origin: center center;
  }
  
  .video-background {
    transform: rotate(90deg) scale(1.1);
    transform-origin: center center;
  }
}

.title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 34rem;
  font-weight: 670;
  color: rgba(0, 0, 0, 1);
  z-index: 0;
  white-space: nowrap;
  font-weight: bold;
  pointer-events: none;
}
</style> 