import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router';

import { ready } from '~/src/state/service';

interface RouteOptions {
  alias?: string;
}

export const createRoute = (name: string, options: RouteOptions = {}) => {
  const component = () => import(/* webpackChunkName: "[request]" */ `./pages/${name}.vue`);

  return {
    name,
    component,
    path: `/${name}`.toLowerCase().replace(/_/g, ':').replace('index', ''),
    ...options,
  };
};

export const routes: Array<RouteRecordRaw> = [
  // Index
  createRoute('Index'),

  // Services
  createRoute('Services/Index'),
  createRoute('Services/Aws'),
  createRoute('Services/Gcp'),
  createRoute('Services/GoogleDrive'),
  createRoute('Services/Browser'),

  // Concepts
  createRoute('Concepts/Index'),
  createRoute('Concepts/_uuid'),
];

export const scrollBehavior = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  _savedPosition: unknown,
) => ({ left: 0, top: 0 });

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next();
  }

  if (!ready.value) {
    if (!to.path.startsWith('/services')) {
      return next('/services');
    }
  }
  next();
});
