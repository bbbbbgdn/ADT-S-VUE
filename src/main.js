import './style.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import DynamicComponent from './components/DynamicComponent.vue';
import lazyLoad from './directives/lazyLoad';
import LazyImage from './components/LazyImage.vue';
import LazyBackground from './components/LazyBackground.vue';

const app = createApp(App);

// Get the access token
const accessToken = import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN;

// Initialize Storyblok only if token is available
if (accessToken) {
  app.use(StoryblokVue, {
    accessToken,
    use: [apiPlugin]
  });
} else {
  console.warn('Storyblok access token is missing. The app will run in fallback mode.');
  // You can add fallback data or mock components here if needed
}

app.component('StoryblokComponent', DynamicComponent);
app.component('LazyImage', LazyImage);
app.component('LazyBackground', LazyBackground);

app.directive('lazy-load', lazyLoad);

app.use(router);

app.mount('#app');
