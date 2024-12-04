import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    function loadImage() {
      const imageElement = el as HTMLImageElement
      const imageUrl = binding.value
      
      // Add loading class
      el.classList.add('image-loading')
      
      // Create new image object
      const img = new Image()
      img.src = imageUrl
      
      img.onload = () => {
        if (el.tagName === 'IMG') {
          imageElement.src = imageUrl
        } else {
          el.style.backgroundImage = `url(${imageUrl})`
        }
        el.classList.remove('image-loading')
        el.classList.add('image-loaded')
      }
    }

    loadImage()
  }
} 