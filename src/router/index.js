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
      path: '/projects/:slug',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectPage.vue')
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
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
    },
    // {
    //   path: '/objects',
    //   name: 'Objects',
    //   component: () => import('../views/Objects.vue')
    // },
    // {
    //   path: '/press',
    //   name: 'Press',
    //   component: () => import('../views/Press.vue')
    // },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

export default router;
