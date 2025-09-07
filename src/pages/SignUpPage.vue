<template>
  <ion-page style="display: block !important;">
    <!-- Header -->
    <ion-header class="ion-no-border header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="handleBack">
            <ion-icon :icon="arrowBackIcon" />
          </ion-button>
        </ion-buttons>
        <ion-title>Sign Up</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <div style="padding: 0 10px; margin-top: 20px; max-height: calc(100vh - 100px); overflow-y: auto;">
      <div class="signup-card">
        <form @submit.prevent="handleSignUp" class="signup-form">
          <!-- First Name -->
          <ion-input
            label-placement="stacked"
            v-model="profile.firstName"
            placeholder="First Name"
          />
          <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>

          <!-- Last Name -->
          <ion-input
            label-placement="stacked"
            v-model="profile.lastName"
            placeholder="Last Name"
          />
          <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>

          <!-- Address -->
          <ion-input
            label-placement="stacked"
            v-model="profile.address"
            placeholder="Address"
          />
          <span v-if="errors.address" class="error">{{ errors.address }}</span>

          <!-- Phone -->
          <ion-input
            label-placement="stacked"
            v-model="profile.phone"
            placeholder="Phone Number"
            type="tel"
          />
          <span v-if="errors.phone" class="error">{{ errors.phone }}</span>

          <!-- Email -->
          <ion-input
            label-placement="stacked"
            v-model="profile.email"
            placeholder="Email"
            type="email"
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>

          <!-- Password -->
          <ion-input
            label-placement="stacked"
            v-model="profile.password"
            placeholder="Password"
            type="password"
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>

          <!-- Submit -->
          <ion-button
            expand="block"
            shape="round"
            class="submit-btn"
            type="submit"
            :disabled="loading_item"
          >
            <ion-spinner v-if="loading_item" name="crescent"></ion-spinner>
            <span v-else>✨ Sign Up</span>
          </ion-button>
        </form>
      </div>

      <!-- Loader -->
      <ion-loading :is-open="loading_item" message="Please wait..."></ion-loading>
      <!-- sign up success -->
      <ion-toast :is-open="showToast" message="Sign up successful!" color="success" duration="2000" position="top" style="color: #fff;"></ion-toast>

    </div>
  </ion-page>
</template>

<script>
import { arrowBack } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonLoading,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/vue";

export default {
  name: "SignUp",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonToast,
    IonInput,
    IonButton,
    IonLoading,
    IonButtons,
    IonIcon,
    IonSpinner,
  },
  data() {
    return {
      profile: {
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
      },
      errors: {},
      loading_item: false,
      showToast: false,
      arrowBackIcon: arrowBack,
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.profile.firstName) {
        this.errors.firstName = "First name is required.";
        isValid = false;
      }
      if (!this.profile.lastName) {
        this.errors.lastName = "Last name is required.";
        isValid = false;
      }
      if (!this.profile.address) {
        this.errors.address = "Address is required.";
        isValid = false;
      }
      if (!this.profile.phone) {
        this.errors.phone = "Phone number is required.";
        isValid = false;
      } else if (!/^[0-9]{10,15}$/.test(this.profile.phone)) {
        this.errors.phone = "Enter a valid phone number.";
        isValid = false;
      }
      if (!this.profile.email) {
        this.errors.email = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.profile.email)) {
        this.errors.email = "Enter a valid email.";
        isValid = false;
      }
      if (!this.profile.password) {
        this.errors.password = "Password is required.";
        isValid = false;
      } else if (this.profile.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
        isValid = false;
      }

      return isValid;
    },
    handleSignUp() {
      if (!this.validateForm()) return;

      this.loading_item = true;
      this.axios
        .post(`/user/signup`, this.profile)
        .then((res) => {
          if(res.data.success) {
            this.showToast = true;
            this.$router.push("/login");
          } else {
            alert(res.data.message || "Sign up failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong.");
        })
        .finally(() => {
          this.loading_item = false;
        });
    },
    handleBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
/* Card container */
.signup-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

/* Inputs */
ion-input {
  margin-bottom: 6px;
  --background: #fafafa;
  --color: #000;
  --placeholder-color: #888;
  --padding-start: 12px;
  --border-radius: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

/* Errors */
.error {
  color: #e63946;
  font-size: 13px;
  margin-bottom: 10px;
  margin-left: 4px;
}

/* Submit button */
.submit-btn {
  margin-top: 20px;
  font-weight: 600;
  --background: linear-gradient(135deg, #030614 0%, #5c5b5e 100%);
  --border-radius: 30px;
  height: 48px;
}
.header {
  background: #fff;
}
</style>
