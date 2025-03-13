<template>
  <div class="app">
    <MenuComponent />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue'

export default {
  name: 'App',
  components: {
    MenuComponent
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 22rem;
}

:root {
  --color-pink-primary: #E788FF;
}

body {
  /* line-height: 1.6; */
  text-align: left;
  /* color: #333; */
}

#app {
  /* background-color: aquamarine; */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* main { */
  /* margin-top: 2rem; */
/* } */
</style>

