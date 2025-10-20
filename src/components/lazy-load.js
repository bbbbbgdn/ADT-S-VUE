// lazy-load.js
export default {
  mounted(el, binding) {
    const loadImage = () => {
      if (el.__vueParentComponent?.proxy) {
        // for Vue components (like AppearingImage)
        el.__vueParentComponent.proxy.src = binding.value
      } else {
        // for normal <img>
        el.src = binding.value
      }
      observer.unobserve(el)
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) loadImage()
      })
    }, { rootMargin: '100px' })

    observer.observe(el)
  }
}