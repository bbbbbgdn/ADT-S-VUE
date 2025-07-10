<template>
  <div class="profile-page-wrapper">
    <div class="profile-container">
      <div class="profile-image" ref="profileImageContainer">
        <img 
          :src="profileImage" 
          :class="{'image-visible': imageLoaded}"
          alt="Dasha Tsapenko working with bio-material" 
          @load="handleImageLoaded"
          ref="profileImg"
        />
        <div class="image-placeholder" v-if="!imageLoaded"></div>
      </div>
      
      <!-- Placeholder to maintain layout when image is sticky -->
      <div class="image-placeholder-spacer" ref="imagePlaceholder" :style="{ height: placeholderHeight + 'px' }"></div>
      
      <div class="profile-content" ref="profileContent">
        <div class="profile-header">
          <MainText>Where fashion grows with nature.</MainText>
        </div>
        
        <div class="profile-description">
            <p>
              Atelier Dasha Tsapenko explores the future of (fashion) design through living systems, cultivating garments and materials in collaboration with fungi, plants, and time. Founded on a strong belief in a bio-based, post-industrial approach to design, the atelier develops sustainable concepts, techniques, and surfaces using self-grown flexible matter.
            </p>
            
            <p>
              Working between microbiology labs and open fields, the studio maintains close ties with scientists and farmers to grow its own textiles and coatings. After a period of cultivation, these living materials are hand-processed into garments, tapestries, and collectible design objects—offering a new language for design expression that is both ecological and deeply embodied.
            </p>
            
            <p>
              At the heart of the atelier's practice lies the intersection of (fashion) design and agriculture. The studio views these disciplines not only as parallel in their challenges, but also in their methods—embracing slowness, seasonality, and regeneration. Projects include dyeing with local crop waste, crafting fur-like fibers and developing fungal felts grown into form.
            </p>
            
            <p>
              Beyond its own research and collections, Atelier Dasha Tsapenko is evolving into a fully-fledged bio-atelier—where garments are grown. Alongside bespoke, site-specific bio-material development for (fashion) brands, the atelier also works directly with fashion-conscious clients to cultivate one-of-a-kind, haute couture pieces. Each garment is a living collaboration with fungi, plants, and time—offering a radically new, deeply approach to wearable design.
            </p>

            <div class="contact-section">
            <div class="section-title">TEAM:</div>
            Dasha Tsapenko, Maria Kitaeva
          </div>
          <br>
          <div class="contact-section">
            <div class="section-title">SELECTED CLIENTS & PARTNERS:</div>
            Atmos, TG Botanical, YOD Group, Biobased Creations, Utrecht University, UFEG, Design Academy Eindhoven, Blue City Lab, Stichting DOEN, Haagse Hogeschool.
          </div>
          <br>
        </div>
        
        <div class="contact-info">

          <div class="contact-section">
            <div class="section-title">EMAIL:</div>
            <BaseButton @click="sendEmail">tsapenkodash@gmail.com</BaseButton>
          </div>
          <br>
          <div class="contact-section">
            <div class="section-title">ADDRESS:</div>
            <BaseButton class="mailing-address" variant="grey">
              De Constant Rebecqueplein 20-B, 2518RA Den Haag, Netherlands
            </BaseButton>
          </div>
          <br>
          <div class="contact-section">
            <div class="section-title">LINKS:</div>
            <div class="social-links">
              <BaseButton @click="openLink('https://www.instagram.com/atelier__dashatsapenko/')">Instagram</BaseButton>
              <BaseButton @click="openLink('https://www.linkedin.com/in/dasha-tsapenko-66b1838b/')">Linkedin</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-info">
      <div class="footer-left">
        <span class="small-text">KVK: 70382514, VAT: NL002491950B87</span>
        <br>
        <span>2025 © Atelier Dasha Tsapenko</span>
      </div>
      <div class="footer-right">
        <span>This website is still cultivating its final form.</span>
      </div>
    </div>
  </div>
</template>

<script>
import MainText from '../components/MainText.vue'
import InfoText from '../components/InfoText.vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Profile',
  components: {
    MainText,
    InfoText,
    BaseButton
  },
  data() {
    return {
      imageLoaded: false,
      profileImage: '/main/assets/IMG_0943.JPG',
      isSticky: false,
      initialTop: 0,
      placeholderHeight: 0
    }
  },
  mounted() {
    this.preloadImage();
    this.setupStickyImage();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    preloadImage() {
      if (this.$refs.profileImg && this.$refs.profileImg.complete) {
        this.imageLoaded = true;
      }
    },
    handleImageLoaded() {
      this.imageLoaded = true;
    },
    setupStickyImage() {
      this.$nextTick(() => {
        if (this.$refs.profileImageContainer) {
          this.initialTop = this.$refs.profileImageContainer.offsetTop;
          this.placeholderHeight = this.$refs.profileImageContainer.offsetHeight;
        }
      });
    },
    handleScroll() {
      if (!this.$refs.profileImageContainer) return;
      const isDesktop = window.innerWidth > 768;
      const container = this.$refs.profileImageContainer;
      const placeholder = this.$refs.imagePlaceholder;
      if (!isDesktop) {
        // Always reset on mobile
        this.isSticky = false;
        container.style.position = 'static';
        container.style.top = 'auto';
        container.style.left = 'auto';
        container.style.width = 'auto';
        container.style.zIndex = 'auto';
        if (placeholder) placeholder.style.display = 'none';
        return;
      }
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > this.initialTop) {
        if (!this.isSticky) {
          this.isSticky = true;
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '50%';
          container.style.zIndex = '10';
          if (placeholder) {
            placeholder.style.display = 'block';
            placeholder.style.width = '50%';
            placeholder.style.height = this.placeholderHeight + 'px';
          }
        }
      } else {
        if (this.isSticky) {
          this.isSticky = false;
          container.style.position = 'static';
          container.style.top = 'auto';
          container.style.left = 'auto';
          container.style.width = 'auto';
          container.style.zIndex = 'auto';
          if (placeholder) {
            placeholder.style.display = 'none';
          }
        }
      }
    },
    handleResize() {
      // Reset sticky state on resize to recalculate positions
      this.isSticky = false;
      const isDesktop = window.innerWidth > 768;
      if (this.$refs.profileImageContainer) {
        this.$refs.profileImageContainer.style.position = 'static';
        this.$refs.profileImageContainer.style.top = 'auto';
        this.$refs.profileImageContainer.style.left = 'auto';
        this.$refs.profileImageContainer.style.width = 'auto';
        this.$refs.profileImageContainer.style.zIndex = 'auto';
      }
      if (this.$refs.imagePlaceholder) {
        this.$refs.imagePlaceholder.style.display = 'none';
      }
      if (isDesktop) {
        this.setupStickyImage();
      }
    },
    sendEmail() {
      window.location.href = 'mailto:tsapenkodash@gmail.com'
    },
    openLink(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
.profile-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--button-min-height));
}

.profile-container {
  flex: 1 0 auto;
  margin-bottom: var(--space-4xl);
}

.profile-container {
  display: flex;
  flex-direction: row;
  padding: 0;
  align-items: flex-start;
}

.profile-image {
  flex: 0 0 50%;
  overflow: hidden;
  position: relative;
  overflow: visible;
  z-index: -1;
}

.profile-image img {
  width: 100%;
  object-fit: contain;
  padding: 0 var(--space-md);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  display: block;
  background: transparent;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
}

.image-placeholder-spacer {
  display: none;
  flex: 0 0 50%;
}

.image-visible {
  opacity: 1 !important;
}

.profile-content {
  padding: var(--space-xl) var(--space-4xl) var(--space-xl) var(--space-4xl);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  overflow-x: hidden;
  padding-right: calc(var(--space-4xl) *1.5);
}

.profile-header {
  margin-bottom: var(--space-lg);
  overflow: visible;
}

.profile-description {
  margin-bottom: calc(var(--space-4xl));
}

.contact-info {
  margin-top: var(--space-xl);
}

.contact-section {
  margin-bottom: var(--space-md);
}

.section-title {
  margin-bottom: var(--space-sm);
}

.mailing-address {
  overflow-x: scroll;
}

.social-links {
  display: flex;
  gap: var(--space-md);
}
.small-text{
  padding-bottom: var(--space-lg);
}

.footer-info {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  padding: var(--space-sm);
}

.footer-left p, .footer-right p {
  margin: 0;
  line-height: 1.4;
  z-index: 999;
}

.footer-right {
  padding-left: var(--space-4xl)
}

@media screen and (max-width: 768px) {
  .profile-container{
    flex-direction: column;
  }

  .profile-content {
  padding: var(--space-sm) var(--space-md) var(--space-sm) var(--space-md);
  width: 100%;
}

.footer-info {
  grid-template-columns: 1fr;
}

.footer-right {
  padding: 0;
}

}

</style> 