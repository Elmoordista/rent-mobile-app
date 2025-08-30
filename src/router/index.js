import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'
import TabsPage from '../pages/TabsPage.vue'
import CarsPage from '../pages/HomePage.vue';
import BookingPage from '../pages/BookingPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import ProductPage from '../pages/ProductPage.vue';
import PageIndigator from '../pages/PageIndigator.vue';
import ProfileEditPage from '../pages/ProfileEditPage.vue';
import ReviewsPage from '../pages/ReviewsPage.vue';
import LoginPage from '../pages/LoginPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/cars'
  },
  {
    path: '/product/:id',
    name: 'ProductPage',
    component: ProductPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/profile/edit',
    name: 'ProfileEditPage',
    component: ProfileEditPage
  },
   {
    path: '/reviews/:id',
    name: 'ReviewsPage',
    component: ReviewsPage
  },
  {
    path: '/page-indicator',
    name: 'PageIndicator',
    component: PageIndigator
  },
  {
    path: '/landing-page',
    name: 'TabsPage',
    component:TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/cars',
        component: CarsPage
      },
      {
        path: '/booking',
        component: BookingPage
      },
      {
        path: '/profile',
        component: ProfilePage
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // If the route requires authentication and the user is not logged in, redirect to the login page
  const isAuthenticated = localStorage.getItem('token'); // Example: check for token in localStorage
  if (requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect to login page
  } else {
    next(); // Allow the navigation
  }
});

export default router
