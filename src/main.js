import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import DynamicComponent from './components/DynamicComponent.vue';

// Створи додаток
const app = createApp(App);

// Підключи Storyblok
app.use(StoryblokVue, {
  accessToken: 'jVwJlAUbh5ZbmDF1SC5OHQtt', // Замініть на свій API токен
  use: [apiPlugin],
});

app.component('StoryblokComponent', DynamicComponent);

// Підключи маршрутизацію
app.use(router);

// Монтируй додаток
app.mount('#app');
