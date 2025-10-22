# LazyCarousel Component Guide

A simple carousel component that uses the `AppearingImage` component for smooth image loading animations. Designed to be minimal and straightforward.

## Features

- Beautiful appearing animation using `AppearingImage`
- Lazy loading with intersection observer
- Drag scrolling (mouse and touch)
- Click to navigate to next image
- Auto-detection of aspect ratios from Storyblok URLs
- Minimal props - just images and height

## Basic Usage

```vue
<template>
  <LazyCarousel
    :images="imageArray"
    height="80vh"
  />
</template>

<script>
import LazyCarousel from '@/components/LazyCarousel.vue';

export default {
  components: { LazyCarousel },
  data() {
    return {
      imageArray: [
        'https://a.storyblok.com/f/319504/1280x1024/image1.jpeg',
        'https://a.storyblok.com/f/319504/800x1074/image2.jpeg',
        'https://a.storyblok.com/f/319504/800x1074/image3.jpeg'
      ]
    };
  }
};
</script>
```

## Props

### Required Props

- **images** (Array, required)
  - Array of image URLs (strings) or image objects
  - Image object format: `{ url: string, alt?: string }`
  - Example: `['url1.jpg', 'url2.jpg']` or `[{ url: 'url1.jpg', alt: 'Description' }]`

### Optional Props

- **height** (String, default: '80vh')
  - Carousel height
  - Supports vh, rem, px, or calc expressions
  - Examples: `'80vh'`, `'calc(100vh - 96rem)'`, `'500px'`

## Image Objects

You can pass either simple URL strings or image objects:

```javascript
// Simple strings
images: [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg'
]

// Or image objects with alt text
images: [
  { 
    url: 'https://example.com/image1.jpg',
    alt: 'Description of image 1'
  },
  { 
    url: 'https://example.com/image2.jpg',
    alt: 'Description of image 2'
  }
]
```

## Behavior

The component has these behaviors built-in (no props needed):

- **Drag scrolling** - Always enabled
- **Click navigation** - Click anywhere to advance to next image
- **No scroll snap** - Smooth free scrolling
- **No gaps or padding** - Images are flush
- **Auto aspect ratio** - Extracted from Storyblok URLs

## Usage Examples

### Simple Photo Gallery

```vue
<LazyCarousel
  :images="photos"
  height="60vh"
/>
```

### Full-Page Project Carousel

```vue
<template>
  <div class="carousel-wrapper">
    <LazyCarousel
      :images="projectImages"
      height="calc(100vh - 96rem)"
    />
    
    <!-- Add tags separately -->
    <div class="project-tags">
      <BaseButton variant="black">{{ projectName }}</BaseButton>
      <BaseButton variant="grey">{{ location }}</BaseButton>
      <BaseButton variant="grey">{{ date }}</BaseButton>
    </div>
  </div>
</template>

<script>
import LazyCarousel from '@/components/LazyCarousel.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  components: { LazyCarousel, BaseButton },
  computed: {
    projectImages() {
      return this.story?.content?.visuals || [];
    },
    projectName() {
      return this.story?.content?.title_tag || '';
    }
  }
};
</script>

<style>
.carousel-wrapper {
  width: 100%;
  position: relative;
}

.project-tags {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  flex-wrap: wrap;
}
</style>
```

### Mobile-Optimized Carousel

```vue
<LazyCarousel
  :images="images"
  height="80vh"
  :style="{ '--mobile-carousel-height': '60svh' }"
/>
```

Add corresponding CSS:

```css
@media screen and (max-width: 768px) {
  .carousel {
    height: var(--mobile-carousel-height, 70svh) !important;
  }
}
```

## Complete Example from ProjectPage.vue

```vue
<template>
  <div class="carousel-wrapper">
    <LazyCarousel
      :images="carouselImages"
      height="calc(100vh - 96rem)"
      :style="{ '--mobile-carousel-height': '70svh' }"
    />
    
    <div v-if="showTags" class="project-tags">
      <BaseButton v-if="projectName" variant="black">
        {{ projectName }}
      </BaseButton>
      <BaseButton v-if="projectLocation" variant="grey">
        {{ projectLocation }}
      </BaseButton>
      <BaseButton v-if="projectDate" variant="grey">
        {{ projectDate }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import LazyCarousel from '@/components/LazyCarousel.vue';
import BaseButton from '@/components/BaseButton.vue';

const carouselImages = computed(() => 
  story.value?.content?.visuals ? formatImages(story.value.content.visuals) : []
);

const projectName = computed(() => story.value?.content?.title_tag || '');
const projectLocation = computed(() => story.value?.content?.location_tag || '');
const projectDate = computed(() => story.value?.content?.date_tag || '');

const showTags = computed(() => 
  projectName.value || projectLocation.value || projectDate.value
);
</script>

<style>
.carousel-wrapper {
  width: 100%;
  position: relative;
}

.project-tags {
  display: flex;
  gap: var(--gallery-tags-gap, 1rem);
  padding: var(--gallery-tags-padding, 1rem 0);
  flex-wrap: wrap;
}
</style>
```

## Aspect Ratio Detection

The carousel automatically extracts aspect ratios from Storyblok URLs:

- URL format: `https://a.storyblok.com/f/319504/1280x1024/image.jpg`
- Extracts: `1280 / 1024` as the aspect ratio
- Fallback: `4 / 5` if detection fails

## Styling

The carousel comes with minimal, hardcoded styling:

- No gaps between images
- No padding
- No border radius
- Hidden scrollbars
- Grab cursor for dragging

To customize, you can:
1. Wrap the carousel in your own container
2. Add CSS custom properties
3. Use the height prop for different sizes

## Mobile Responsiveness

On mobile devices:
- Cursor changes to default (no grab cursor)
- Touch scrolling works natively
- Click navigation still works
- Can override height with CSS variables

## Why So Simple?

This component is intentionally minimal:

- Only 2 props (images and height)
- No configuration needed for common use cases
- Consistent behavior across all uses
- Easy to understand and maintain
- Focus on the images and appearing animation

## Comparison with ImageGallery

| Feature | LazyCarousel | ImageGallery |
|---------|--------------|--------------|
| Appearing Animation | ✅ | ❌ |
| Props Count | 2 | 20+ |
| Complexity | Very Low | High |
| Drag Scrolling | ✅ | ✅ |
| Auto-scroll | ❌ | ✅ |
| Seamless Looping | ❌ | ✅ |
| Use Case | Simple carousels | Complex galleries |

Use `LazyCarousel` for straightforward image carousels with beautiful appearing animations. Use `ImageGallery` when you need advanced features like auto-scrolling or seamless looping.
