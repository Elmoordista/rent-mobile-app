import { createStore } from 'vuex';
import axios from '../utils/axios'; // Use the custom axios instance

const store = createStore({
  state: {
    // User data and authentication token
    user: '',
    cart: [],
    authToken: localStorage.getItem('token') || null,  // Try to load token from localStorage
    item_to_rent: [],
    booking_details: null,
  },
  mutations: {
    setCart(state, cart) {
      state.cart = cart;
    },
    setBookingDetails(state, details) {
      state.booking_details = details ? details : null;
    },
    removeItemToRent(state, itemId) {
      if(state.item_to_rent.length === 0) return;
      state.item_to_rent = state.item_to_rent.filter(i => i.cart_id !== itemId);
    },
    setItemToRent(state, item) {
      //check if item already exists, if so, update quantity
      const existingItemIndex = state.item_to_rent.findIndex(i => i.cart_id === item.cart_id);
      if (existingItemIndex !== -1) {
        state.item_to_rent[existingItemIndex].qty += item.qty;
        return;
      }
      state.item_to_rent = [...state.item_to_rent, item];
    },
    removeAllItemToRent(state) {
      state.item_to_rent = [];
    },
    setUser(state, user) {
      state.user = user;
    },
    setAuthToken(state, token) {
      state.authToken = token;
      localStorage.setItem('token', token); // Store token in localStorage
    },
    logout(state) {
      state.user = null;
      state.authToken = null;
      localStorage.removeItem('token');  // Remove token on logout
      window.location.href = '/login';  // Redirect to login page
    },
  },
  actions: {
    // This action can be used to log in the user
    login({ commit }, { token, user }) {
      commit('setAuthToken', token);
      commit('setUser', user);
    },
    getInfoUser({ commit }) {
      //axios
      axios.get('/user/info')
      .then(response => {
        commit('setUser', response.data.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
    },
    getCart({ commit }) {
      //axios
      axios.get('/cart')
      .then(response => {
        console.log(response.data.data);
        commit('setCart', response.data.data);
      })
      .catch(error => {
        console.error('Error fetching cart info:', error);
      });
    },
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.authToken;  // Return true if a token exists
    },
    getUser(state) {
      return state.user;  // Return the user object
    },
    getCart(state) {
      return state.cart;  // Return the cart array
    },
    getItemToRent(state) {
      return state.item_to_rent;  // Return the item_to_rent array
    },
    getBookingDetails(state) {
      return state.booking_details;  // Return the booking_details object
    }
  },
});

export default store;
