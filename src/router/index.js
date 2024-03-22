// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import TopNav from '../components/TopNav.vue';
import MainView from '../components/MainView.vue';
import PropertiesPane from '../components/PropertiesPanel.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: MainView },
  { path: '/properties', component: PropertiesPane },
];

const router = new VueRouter({
  routes,
});

export default router;
