<template>
  <ion-page class="ion-page-wrapper login-page ion-padding">
    <ion-content>
        <div style="display: flex; justify-content: center; align-items: center;">
            <!-- Logo -->
            <img src="/3pf_logo.jpg" alt="Logo" height="100" />
        </div>

        <div style="display: flex; margin-top: 20px; flex-direction: column; gap: 16px; padding: 0 16px;">
            <!-- Email Input -->
            <ion-input 
              class="login-input"
              label-placement="stacked" 
              v-model="email"
              placeholder="Email" 
              type="email">
            </ion-input>

            <!-- Password Input -->
            <ion-input 
              class="login-input"
              label-placement="stacked" 
              v-model="password"
              placeholder="Password" 
              type="password">
            </ion-input>
        </div>

        <div style="display: flex; margin-top: 24px; flex-direction: column; gap: 12px; padding: 0 16px;">
            <!-- Login Button -->
            <ion-button 
              color="dark" 
              shape="round" 
              expand="block" 
              size="default" 
              class="book-button" 
              @click="handleLogin" 
              style="display: flex; align-items: center; height: 40px;">
                Login
            </ion-button>

            <!-- Sign Up Button -->
            <ion-button 
              color="light" 
              shape="round" 
              expand="block" 
              size="default" 
              class="book-button" 
              @click="handleSignUp" 
              style="color: #000; height: 40px;">
                Sign Up
            </ion-button>

            <!-- Forgot Password Link -->
            <ion-item lines="none" style="justify-content: center; margin-top: 8px;">
                <ion-label style="color: #3880ff; font-size: 14px;" @click="handleForgotPassword">Forgot Password?</ion-label>
            </ion-item>
        </div>
        <ion-loading :is-open="loginLoading" message="Logging in..."></ion-loading>
        <ion-alert
          :is-open="showAlert"
          :header="alertHeader"
          message="Invalid credentials"
          :buttons="alertButtons"
           @didDismiss="showAlert = false"
          @ionAlertDidDismiss="showAlert = false"
        ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonButton, IonLabel, IonItem, IonInput, IonPage, IonContent, IonLoading, IonAlert } from '@ionic/vue';

export default {
  components: {
    IonButton,
    IonLabel,
    IonItem,
    IonPage,
    IonContent,
    IonLoading,
    IonAlert,
    IonInput
  },
  data() {
    return {
      loginLoading : false,
      showAlert : false,
      alertHeader : 'Login Failed',
      alertButtons : ['OK'],
      email: '',
      password: '',
    }
  },
  mounted(){
  },
  methods: {
    // Handle Login
    handleLogin() {
        this.loginLoading = true;
        this.axios.post(`/user/login`, {
            email: this.email,
            password: this.password
        }).then((res)=>{

            localStorage.setItem('token', res.data.token);
            this.$store.commit('setAuthToken', res.data.token);
            this.$store.commit('setUser', res.data.user);
            this.$router.push('/cars');
        }).catch((error)=>{
            this.showAlert = true;
        }).finally(()=>{
            this.loginLoading = false;
        })
    },

    // Handle Sign Up
    handleSignUp() {
      // Add your sign-up logic here
      console.log("Redirecting to sign up...");
    },

    // Handle Forgot Password
    handleForgotPassword() {
      // Navigate to password recovery page or show a modal
      console.log("Redirecting to forgot password page...");
    }
  },
}
</script>

<style scoped>
ion-input {
  min-height: 40px !important;
  --background: #fff;
  --color: #000;
  --placeholder-color: #666;
  --padding-start: 12px;
  --border-radius: 12px;
  border: 1px solid #bdbcbc;
  border-radius: 12px;
  text-align: start;
}

ion-button {
  --background: #3880ff;
  --color: white;
}

ion-item {
  --border-color: transparent;
}

ion-label {
  text-align: center;
  cursor: pointer;
}

.book-button {
  width: 100%;
}
</style>
