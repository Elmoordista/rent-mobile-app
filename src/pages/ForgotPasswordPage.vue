<template>
  <ion-page class="ion-page-wrapper login-page ion-padding">
    <ion-content>
      <div style="display: flex; justify-content: center; align-items: center;">
        <!-- Logo -->
        <img src="/3pf_logo.png" alt="Logo" height="130" />
      </div>

      <!-- Step 1: Request OTP -->
      <div v-if="step === 1" style="display: flex; margin-top: 20px; flex-direction: column; gap: 16px; padding: 0 16px;">
        <ion-input
          class="login-input"
          label-placement="stacked"
          v-model="email"
          placeholder="Enter your email"
          type="email"
        ></ion-input>

        <ion-button
          color="dark"
          shape="round"
          expand="block"
          size="default"
          class="book-button"
          @click="sendOtp"
          style="height: 40px;"
        >
          Send OTP
        </ion-button>

        <ion-button
          color="light"
          shape="round"
          expand="block"
          size="default"
          class="book-button"
          @click="goBackToLogin"
          style="color: #000; height: 40px;"
        >
          Back to Login
        </ion-button>
      </div>

      <!-- Step 2: Verify OTP & Reset Password -->
      <div v-else style="display: flex; margin-top: 20px; flex-direction: column; gap: 16px; padding: 0 16px;">
        <ion-input
          class="login-input"
          label-placement="stacked"
          v-model="otp"
          placeholder="Enter OTP"
          type="text"
        ></ion-input>

        <ion-input
          class="login-input"
          label-placement="stacked"
          v-model="newPassword"
          placeholder="Enter new password"
          type="password"
        ></ion-input>

        <ion-button
          color="dark"
          shape="round"
          expand="block"
          size="default"
          class="book-button"
          @click="resetPassword"
          style="height: 40px;"
        >
          Change Password
        </ion-button>
         <ion-button
          color="light"
          shape="round"
          expand="block"
          size="default"
          class="book-button"
          @click="handleBack"
          style="color: #000; height: 40px;"
        >
          Back
        </ion-button>
      </div>

      <!-- Loading Spinner -->
      <ion-loading :is-open="loading" :message="loadingMessage"></ion-loading>

      <!-- Alert -->
      <ion-alert
        :is-open="showAlert"
        :header="alertHeader"
        :message="alertMessage"
        :buttons="alertButtons"
        @didDismiss="showAlert = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonLabel,
  IonItem,
  IonPage,
  IonContent,
  IonLoading,
  IonAlert,
  IonInput,
} from "@ionic/vue";

export default {
  components: {
    IonButton,
    IonLabel,
    IonItem,
    IonPage,
    IonContent,
    IonLoading,
    IonAlert,
    IonInput,
  },
  data() {
    return {
      step: 1, // 1 = request OTP, 2 = verify OTP + reset password
      email: "",
      otp: "",
      newPassword: "",
      loading: false,
      loadingMessage: "",
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      alertButtons: ["OK"],
    };
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    // Step 1: Send OTP
    sendOtp() {
      if (!this.email) {
        this.showMessage("Error", "Please enter your email address.");
        return;
      }
      this.loading = true;
      this.loadingMessage = "Sending OTP...";
      this.axios
        .post(`/user/send-otp`, { email: this.email })
        .then(() => {
          this.showMessage("Success", "OTP sent to your email.");
          this.step = 2;
        })
        .catch((error) => {
          this.showMessage("Error", error.response?.data?.message || "Failed to send OTP.");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Step 2: Reset password with OTP
    resetPassword() {
      if (!this.otp || !this.newPassword) {
        this.showMessage("Error", "Please enter OTP and new password.");
        return;
      }
      this.loading = true;
      this.loadingMessage = "Changing password...";
      this.axios
        .post(`/user/reset-password`, {
          email: this.email,
          otp: this.otp,
          password: this.newPassword,
        })
        .then(() => {
          this.showMessage("Success", "Password changed successfully.");
          this.$router.push("/login");
        })
        .catch(() => {
          this.showMessage("Error", "Invalid OTP or request failed.");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Back to login
    goBackToLogin() {
      this.$router.push("/login");
    },

    // Helper to show alert
    showMessage(header, message) {
      this.alertHeader = header;
      this.alertMessage = message;
      this.showAlert = true;
    },
  },
};
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
