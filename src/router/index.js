import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Components',
      name: 'Components',
      component: () => import('../views/ComponentsDemo.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Projects.vue')
    },
    {
      path: '/shows',
      name: 'Shows',
      component: () => import('../views/Shows.vue')
    },
    {  
        path: '/shows/:slug',
        name: 'ShowDetail',
        component: () => import('../views/ShowPage.vue'),
        props: true
    },
    {
      path: '/showpage',
      name: 'ShowPage',
      component: () => import('../views/ShowPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

export default router;
