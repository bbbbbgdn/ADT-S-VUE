<template>
  <nav class="menu">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :variant="currentPath === item.path ? 'active' : 'black'"
      :disabled="!item.path"
      @click="navigateTo(item.path)"
    >
      {{ item.name }}
    </BaseButton>
  </nav>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'MenuComponent',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentPath = ref(route.path)
    
    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentPath.value = newPath
      }
    )
    
    const menuItems = [
      { name: 'Atelier Dasha Tsapenko', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Objects', path: '/objects' },
      { name: 'Shows', path: '/shows' },
      { name: 'Press', path: '' },
      { name: 'Profile', path: '' },
    ]

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      menuItems,
      navigateTo,
      currentPath
    }
  }
}
</script>

<style scoped>
.menu {
padding: 3rem;
  display: flex;
  flex-wrap: wrap;

  gap: 3rem;
}

.components-button {
    position: absolute;
    right: 0;
    top: 0;
    margin: 3rem;
}
</style>    