import { createStore } from 'vuex';
import axios from '../utils/axios'; // Use the custom axios instance

const store = createStore({
  state: {
    // User data and authentication token
    user: '',
    authToken: localStorage.getItem('token') || null,  // Try to load token from localStorage
  },
  mutations: {
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
  },
});

export default store;
