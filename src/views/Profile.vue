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
      

      
      <div class="profile-content" ref="profileContent">
        <div class="profile-header">
          <MainText>{{ (story && story.content && story.content.Title) }}</MainText>
        </div>
        
        <div class="profile-description">
          <div class="profile-rich-text" v-if="story && story.content && story.content.info_text">
            <div v-for="(block, index) in parsedContent" :key="index">
              <p v-if="block.type === 'paragraph'">
                <template v-for="(segment, segIndex) in block.segments" :key="segIndex">
                  <BaseButton 
                    v-if="segment.type === 'link'" 
                    :to="segment.isExternal ? null : segment.href"
                    @click="segment.isExternal ? handleExternalLink(segment.href) : null"
                  >
                    {{ segment.text }}
                  </BaseButton>
                  <br v-else-if="segment.type === 'break'" />
                  <span v-else>{{ segment.text }}</span>
                </template>
              </p>
              <br v-else-if="block.type === 'empty_paragraph'" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-info">
      <div class="footer-left">
        <span class="small-text">{{ (story && story.content && story.content.Extra) }}</span>
        <br>
        <span>{{ (story && story.content && story.content.footer_left) || '© Atelier Dasha Tsapenko' }}</span>
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
import { renderRichText } from '@storyblok/vue'
import { loadStory } from '../utils/storyblok'
import { useStoryblokBridge } from '@storyblok/vue'
import { isDraftMode } from '../utils/storyblok'

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
      profileImage: '/main/assets/IMG_3967.JPEG',
      story: null,
      isLoading: false,
      errorMessage: '',
      renderRichText,
      // Scrollback data
      dividerScrollTimeouts: {},
      isDividerScrolling: {},
      dividerSpringAnimationIds: {}
    }
  },
  computed: {
    parsedContent() {
      if (!this.story || !this.story.content || !this.story.content.info_text) {
        return [];
      }
      
      const richTextContent = this.story.content.info_text;
      const blocks = [];
      
      if (richTextContent.content) {
        richTextContent.content.forEach(block => {
          if (block.type === 'paragraph') {
            if (block.content && block.content.length > 0) {
              const segments = [];
              block.content.forEach(textNode => {
                if (textNode.type === 'text') {
                  const hasLink = textNode.marks && textNode.marks.find(mark => mark.type === 'link');
                  if (hasLink) {
                    const linkMark = hasLink;
                    const href = linkMark.attrs.href;
                    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
                    
                    segments.push({
                      type: 'link',
                      text: textNode.text,
                      href: href,
                      isExternal: isExternal
                    });
                  } else {
                    segments.push({
                      type: 'text',
                      text: textNode.text
                    });
                  }
                } else if (textNode.type === 'hard_break') {
                  segments.push({
                    type: 'break'
                  });
                }
              });
              blocks.push({
                type: 'paragraph',
                segments: segments
              });
            } else {
              // Empty paragraph - treat as spacing
              blocks.push({
                type: 'empty_paragraph'
              });
            }
          }
        });
      }
      
      return blocks;
    }
  },
  mounted() {
    this.preloadImage();
    this.fetchProfile();
  },
  beforeUnmount() {
    // Clean up scrollback animations
    Object.values(this.dividerSpringAnimationIds).forEach(animationId => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
    
    // Clean up timeouts
    Object.values(this.dividerScrollTimeouts).forEach(timeout => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  },
  methods: {
    handleExternalLink(href) {
      if (href.startsWith('mailto:')) {
        window.location.href = href;
      } else if (href.startsWith('http')) {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
    },
    applyProfileStory(newStory) {
      this.story = newStory;
      const cmsImage = this.story && this.story.content && this.story.content.Image && this.story.content.Image.filename;
      if (cmsImage) {
        this.profileImage = cmsImage;
      }
    },
    async fetchProfile() {
      try {
        this.isLoading = true;
        const result = await loadStory('profile');
        if (result && result.status === 'success') {
          this.applyProfileStory(result.data);
          if (isDraftMode() && this.story && this.story.id) {
            useStoryblokBridge(this.story.id, (updatedStory) => {
              this.applyProfileStory(updatedStory);
            });
          }
        } else {
          this.errorMessage = 'Could not load profile content.';
        }
      } catch (e) {
        this.errorMessage = 'Could not load profile content.';
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
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
    },
    // Scrollback methods for button dividers
    handleDividerScroll(dividerType) {
      this.isDividerScrolling[dividerType] = true;
      
      // Clear existing timeout
      clearTimeout(this.dividerScrollTimeouts[dividerType]);
      
      // Set timeout to detect when scrolling stops - increased to 1 second
      this.dividerScrollTimeouts[dividerType] = setTimeout(() => {
        this.isDividerScrolling[dividerType] = false;
        this.animateDividerSpringReturn(dividerType);
      }, 1000); // Changed from 150ms to 1000ms (1 second)
    },
    
    handleDividerTouchStart(dividerType) {
      this.isDividerScrolling[dividerType] = true;
    },
    
    handleDividerTouchEnd(dividerType) {
      // Increased delay to allow for momentum scrolling and match the 1-second delay
      setTimeout(() => {
        this.isDividerScrolling[dividerType] = false;
        this.animateDividerSpringReturn(dividerType);
      }, 1000); // Changed from 100ms to 1000ms (1 second)
    },
    
    animateDividerSpringReturn(dividerType) {
      const dividerElement = this.$refs[`${dividerType}Divider`];
      if (!dividerElement) return;
      
      const currentScrollLeft = dividerElement.scrollLeft;
      const targetPosition = 0;
      
      // Start spring animation
      this.startDividerSpringAnimation(dividerType, currentScrollLeft, targetPosition);
    },
    
    startDividerSpringAnimation(dividerType, startPosition, targetPosition) {
      if (this.dividerSpringAnimationIds[dividerType]) {
        cancelAnimationFrame(this.dividerSpringAnimationIds[dividerType]);
      }
      
      const dividerElement = this.$refs[`${dividerType}Divider`];
      if (!dividerElement) return;
      
      const startTime = performance.now();
      const duration = 600; // Animation duration in milliseconds
      const distance = targetPosition - startPosition;
      
      // Cubic ease-out
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        
        dividerElement.scrollLeft = currentPosition;
        
        if (progress < 1) {
          this.dividerSpringAnimationIds[dividerType] = requestAnimationFrame(animate);
        } else {
          this.dividerSpringAnimationIds[dividerType] = null;
        }
      };
      
      this.dividerSpringAnimationIds[dividerType] = requestAnimationFrame(animate);
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



.image-visible {
  opacity: 1 !important;
}

.profile-content {
  padding: var(--space-xl) var(--space-4xl) var(--space-xl) var(--space-4xl);
  /* display: flex; */
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
  overflow: auto;
  overflow-x: hidden;
  /* padding-right: calc(var(--space-4xl) *1.5); */
}

.profile-header {
  margin-bottom: var(--space-lg);
  overflow: visible;
}

.profile-description {
  margin-bottom: calc(var(--space-4xl));
}

.profile-description :deep(.info-text){
  padding: 0;

}

.profile-description :deep(p) {
 margin: 0;
 margin-bottom: 1em;
 padding: 0;
}

.profile-rich-text .base-button {
  margin: 0 0.25rem;
  display: inline-flex;
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
  user-select: all;
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
  z-index: 10;
  background-color: white;
}

.footer-left p, .footer-right p {
  margin: 0;
  line-height: 1.4;
  z-index: 999;
}

.footer-right {
  padding-left: var(--space-4xl)
}

.button-divider {
  width: 100vw;
  /* margin-left: calc(-50vw + 50%); */
  padding: 0 var(--space-lg) 0 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  overflow: -moz-scrollbars-none; /* Firefox (older versions) */
}

.button-divider::-webkit-scrollbar {
  display: none;
}

.button-divider .social-links {
  display: flex;
  gap: var(--space-md);
  min-width: max-content;
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



.button-divider {
  padding: 0 var(--space-lg) 0 0;
}

.contact-info .section-title, .contact-info .button-divider {
  padding-left: var(--space-md);
}

.contact-info {
  margin-left: calc(var(--space-md) * -1);
}

}

</style> 