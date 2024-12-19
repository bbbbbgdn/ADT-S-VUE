<template>
  <button 
    class="base-button"
    :class="[
      `button-${variant}`
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'black',
      validator: (value) => ['black', 'grey', 'active'].includes(value)
    },
    to: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      if (this.to) {
        this.$router.push(this.to);
      }
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-block;
  padding: 3rem 12rem 7rem 12rem;
  white-space: nowrap;
  border-radius: 100rem;
  cursor: pointer;
  transition: all 0.2s;
}

/* Black Button */
.button-black {
  background-color: black;
  color: white;
}

.button-black:hover {
  background-color: #E788FF;
  color: black;
}

/* Grey Button */
.button-grey {
  background-color: #C3C3C3;
  color: rgb(0, 0, 0);
}

.button-grey:hover {
  opacity: 0.9;
}

/* Active Button */
.button-active {
  background-color: #E788FF;
  color: black;
}

.button-active:hover {
  background-color: #d065eb;
  color: white;
}
</style> 