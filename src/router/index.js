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
import CartPage from '../pages/CartPage.vue';
import SuccessOrderPage from '../pages/SuccessOrderPage.vue';
import PendingOrderPage from '../pages/PendingOrderPage.vue';
import AddReviewPage from '../pages/AddReviewPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';
import FavoritePage from '../pages/FavoritePage.vue';

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
    path: '/add-review/:id',
    name: 'AddReviewPage',
    component: AddReviewPage
  },
  {
    path: '/favorites',
    name: 'FavoritePage',
    component: FavoritePage
  },
  {
    path: '/profile/edit',
    name: 'ProfileEditPage',
    component: ProfileEditPage
  },
  {
    path: '/sign-up',
    name: 'SignUpPage',
    component: SignUpPage
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
    path: '/cart',
    name: 'CartPage',
    component: CartPage
  },
  {
    path: '/success-order',
    name: 'SuccessOrderPage',
    component: SuccessOrderPage
  },
  {
    path: '/pending-order',
    name: 'PendingOrderPage',
    component: PendingOrderPage
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
