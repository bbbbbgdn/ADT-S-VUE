import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import DynamicComponent from './components/DynamicComponent.vue';
import lazyLoad from './directives/lazyLoad';
import LazyImage from './components/LazyImage.vue';
import LazyBackground from './components/LazyBackground.vue';

const app = createApp(App);

app.use(StoryblokVue, {
  accessToken: import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN,
  bridge: import.meta.env.NODE_ENV !== 'production', // optimizes by excluding the bridge on production
  use: [apiPlugin],

  apiOptions: {
    region: "eu",
 },
});

app.component('StoryblokComponent', DynamicComponent);
app.component('LazyImage', LazyImage);
app.component('LazyBackground', LazyBackground);

// Register the lazy loading directive globally
app.directive('lazy-load', lazyLoad);

app.use(router);

app.mount('#app');
