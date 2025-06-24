<template>
  <div class="profile-page-wrapper">
    <div class="profile-container">
      <div class="profile-image">
        <img 
          :src="profileImage" 
          :class="{'image-visible': imageLoaded}"
          alt="Dasha Tsapenko working with bio-material" 
          @load="handleImageLoaded"
          ref="profileImg"
        />
        <div class="image-placeholder" v-if="!imageLoaded"></div>
      </div>
      
      <div class="profile-content">
        <div class="profile-header">
          <MainText>Atelier Dasha Tsapenko is an artistic practise focusing on bio-design, based in The Hague, NL.</MainText>
        </div>
        
        <div class="profile-description">

            <p>
              With a strong believe in the bio-based future of fashion, the founder of the atelier Dasha Tsapenko, develops sustainable concepts, products, and innovative techniques, using self-grown flexible matter as a medium. Fascinated by nature and her non-human inhabitants, Dasha uses natural cycles & rythms as guidelines and frameworks for design.
            </p>
            
            <p>
              To produce surfaces by letting them grow, the atelier collaborates with diverse living organisms like fungi and plants, often working between the microbiology lab and a farm—in close contact with scientists and local farmers. After the growth period, the harvested surfaces are hand-processed and transformed into garments, tapestries and flexible interior items.
            </p>
            
            <p>
              The intersection of fashion and agriculture is another major topic of investigation. Both fields share similar problems, but most importantly - methods and principles that can be learned and benefited from. Textile dyes from local crop waste, fur from regional bean pods and fungal felt are few examples of projects, the Atelier is currently busy with.
            </p>
            
            <p>
              Besides growing (art) pieces and developing alternative production procecess, Atelier Dasha Tsapenko offers artistic direction, curation and tailored workshops in fields of bio-based fashion and textile design.
            </p>
        </div>
        
        <div class="contact-info">
          <div class="contact-section">
            <div class="section-title">EMAIL:</div>
            <BaseButton @click="sendEmail">tsapenkodash@gmail.com</BaseButton>
          </div>
          
          <div class="contact-section">
            <div class="section-title">MAILING ADDRESS:</div>
            <BaseButton class="mailing-address" >
              De Constant Rebecqueplein 20-B
              2518RA 's-Gravenhage,
              Netherlands
            </BaseButton>
          </div>
          
          <div class="contact-section">
            <div class="section-title">LINKS:</div>
            <div class="social-links">
              <BaseButton @click="openLink('https://www.instagram.com/atelier__dashatsapenko/')">Instagram</BaseButton>
              <!-- <BaseButton @click="openLink('https://linkedin.com')">Linkedin</BaseButton> -->
              <BaseButton @click="openLink('https://www.linkedin.com/in/dasha-tsapenko-66b1838b/')">Linkedin</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-info">
      <div class="footer-left">
        <p class="small-text">KVK: 70382514, VAT: NL002491950B87</p>
        <p>2025 © Atelier Dasha Tsapenko</p>
      </div>
      <div class="footer-right">
        <p>This website is still cultivating its final form.</p>
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
      profileImage: '/main/assets/profile-image.webp'
    }
  },
  mounted() {
    this.preloadImage();
    
    if (!this.imageLoaded) {
      this.imageLoaded = true;
    }
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
  /* min-height: 100vh; */
  overflow: visible;
  z-index: -1;
  /* height: 100%; */
}

.profile-image img {
  width: 100%;
  object-fit: contain;
  padding: 0 var(--space-md) 0 var(--space-md);
  opacity: 0;
  transition: opacity 300ms ease;
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  display: block;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
}

.image-visible {
  opacity: 1 !important;
}

.profile-content {
  padding: var(--space-xl) var(--space-2xl) var(--space-xl) var(--space-2xl);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
}

.profile-header {
  margin-bottom: var(--space-lg);
}

.profile-description {
  margin-bottom: var(--space-xl);
}

.contact-info {
  margin-top: var(--space-xl);
}

.contact-section {
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: bold;
  margin-bottom: var(--space-xs);
}

.mailing-address {
}

.social-links {
  display: flex;
  gap: var(--space-md);
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

</style> 