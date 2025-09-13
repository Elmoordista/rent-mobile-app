import axios from "axios";

const HttpClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  // baseURL: 'https://rentapp-api.onrender.com/api' || 'http://localhost:8000/api',
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Cookies.remove('company_id');

const responseErrorInterceptor = (error) => {
  if ((error.response && error.response.status == 401)) {
    // if ((error.response && error.response.status == 401) || error.code == "ERR_NETWORK" || error.code == "ERR_BAD_RESPONSE") {
      localStorage.removeItem('token');
      window.location.href = '/login';
  }
  if ((error.response && error.response.data.message)) {
     console.log(error.response.data.message)
  }

  return Promise.reject(error);
};

// function showError(msg) {
//   NotificationService.notifyError(
//     {
//       message: msg,
//       title: 'Request Error',
//     }
//   )
// }

HttpClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor
);

export default HttpClient;
