<template>
  <ion-page class="ion-page-wrapper">
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>{{ slides[currentStep] }}</ion-title>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Step Circles with Connecting Lines -->
      <div class="stepper-wrapper">
        <div class="stepper">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="step-item"
          >
            <!-- Circle -->
            <div
              class="step-circle"
              :class="{ active: index <= currentStep }"
            >
              {{ index + 1 }}
            </div>

            <!-- Line (after circle) -->
            <div
              v-if="index < slides.length - 1"
              class="step-line"
              :class="{ active: index < currentStep }"
            ></div>
          </div>
        </div>

        <!-- Step Labels -->
        <div class="step-labels">
          <div v-for="(slide, index) in slides" :key="'label-' + index" class="label">
            {{ slide }}
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="step-content" style="height: 68vh; overflow-y: scroll;">
          <template v-if="currentStep === 0">
            <BookingDetails />
          </template>
          <template v-if="currentStep === 1">
            <Confirmation />

          </template>
          <!-- <template v-if="currentStep === 2">
            <Confirmation />
          </template> -->
      </div>
    </ion-content>

    <!-- Fixed footer with Continue button -->
     
    <ion-footer v-if="currentStep < slides.length - 1" class="ion-no-border">
      <ion-toolbar>
        <ion-button
          color="dark"
          shape="round"
          expand="block"
          class="book-button"
          :disabled="currentStep === slides.length - 1"
          @click="nextStep"
          style="margin: 0 16px;"
        >
          Continue
        </ion-button>
      </ion-toolbar>
    </ion-footer>
     <ion-footer class="ion-no-border" v-if="currentStep === 1">
      <ion-toolbar>
        <ion-button
          color="dark"
          shape="round"
          expand="block"
          class="book-button"
          @click="handleOrderPlace"
          style="margin: 0 16px;"
        >
          Place Order
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { arrowBack } from 'ionicons/icons';
import BookingDetails from '@/component/BookingDetails.vue';
import Confirmation from '@/component/Confirmation.vue';
import PaymentMethods from '@/component/PaymentMethods.vue';
import { IonPage, IonHeader, IonTitle, IonContent, IonButtons, IonIcon, IonButton } from '@ionic/vue';
export default {
    name: 'PageIndicator',
    components: {
      IonPage,
      BookingDetails,
      Confirmation,
      PaymentMethods,
      IonHeader,
      IonTitle,
      IonContent,
      IonButtons,
      IonIcon,
      IonButton
    },

  data() {
    return {
    arrowBackIcon: arrowBack,
    slides: ['Booking Details', 'Confirmation'],
    // slides: ['Booking Details', 'Payment Methods', 'Confirmation'],
    currentStep: 0,
    };
  },
  methods: {
    handleOrderPlace() {
      this.$router.push('/success-order');
    },
    handleBack() {
      if (this.currentStep > 0) {
        this.currentStep--;
      } else {
        // If already at the first step, navigate back to the previous page
        this.$router.back(-1);
      }
    },
    nextStep() {
      if (this.currentStep < this.slides.length - 1) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
};
</script>
<style scoped>
.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}

/* Keep existing stepper styles */

.step-controls {
  /* Remove this because button is now fixed in footer */
  display: none;
}
.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}
.stepper-wrapper {
  max-width: 400px; /* limit width */
  margin-left: auto;
  margin-right: auto;
}

.stepper {
  display: flex;
  justify-content: center; /* center circles + lines */
  align-items: center;
  position: relative;
}

.step-item {
  display: flex;
  align-items: center;
  /* Remove flex: 1 to avoid stretching */
  position: relative;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #ccc;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  font-size: 14px;
  flex-shrink: 0;
}

.step-circle.active {
  background-color: #3880ff;
}

.step-line {
  width: 230px; /* fixed width for line */
  height: 2px;
  background-color: #ccc;
  margin: 0 10px; /* space around the line */
  z-index: 1;
}

.step-line.active {
  background-color: #3880ff;
}

.step-labels {
  display: flex;
  justify-content: space-between; /* center labels too */
  margin-top: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.label {
  width: 88px; /* match circle + line widths (28 + 60) */
  text-align: center;
  font-size: 10px;
  color: #000;
}

.step-content {
  text-align: center;
}

.step-controls {
  display: flex;
  gap: 10px;
}
</style>

<style scoped>
.ion-page-wrapper{
    --ion-background-color: #f9f9f9;
}
</style>
