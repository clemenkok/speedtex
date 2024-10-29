// router/index.js or router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue' // assuming App.vue is your main view

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  // other routes
]

const router = createRouter({
  history: createWebHistory(''),
  routes
})

export default router
