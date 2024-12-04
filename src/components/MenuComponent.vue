<template>
  <nav class="menu">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :outlined="true"
      @click="navigateTo(item.path)"
    >
      {{ item.name }}
    </BaseButton>

    <BaseButton 
    class="align-self-end"
    :outlined="false" 
    @click="navigateTo('/components')"
    variant="active">
        {components}
    </BaseButton>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

export default {
  name: 'MenuComponent',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter()
    
    const menuItems = [
      { name: 'Atelier Dasha Tsapenko', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Objects', path: '/objects' },
      { name: 'Shows', path: '/shows' },
      { name: 'Press', path: '/press' },
      { name: 'Profile', path: '/profile' },
    ]

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      menuItems,
      navigateTo
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


.align-self-end {
  margin-left: auto;
}
</style>    