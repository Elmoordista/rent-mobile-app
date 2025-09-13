<template>
  <ion-page class="ion-page-wrapper">
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>{{ slides[currentStep] }}</ion-title>
    </ion-header>

    <div class="ion-padding" style="padding: 0 20px; padding-top: 20px; background-color: #f9f9f9;">
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
      <div class="step-content" style="height: 68vh; overflow-y: scroll; margin-top: 20px;">
          <template v-if="currentStep === 0">
            <BookingDetails :setBookingDetails="setBookingDetails" :bookingDetails="booking_details"/>
          </template>
          <template v-if="currentStep === 1">
            <Confirmation />

          </template>
          <!-- <template v-if="currentStep === 2">
            <Confirmation />
          </template> -->
      </div>
    </div>

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
    <ion-loading :is-open="submitLoading" message="Placing order..."></ion-loading>
  </ion-page>
</template>

<script>
import { arrowBack } from 'ionicons/icons';
import BookingDetails from '@/component/BookingDetails.vue';
import Confirmation from '@/component/Confirmation.vue';
import PaymentMethods from '@/component/PaymentMethods.vue';
import { IonPage, IonHeader, IonTitle, IonContent, IonButtons, IonIcon, IonButton, IonLoading } from '@ionic/vue';
export default {
    name: 'PageIndicator',
    components: {
      IonPage,
      BookingDetails,
      Confirmation,
      IonLoading,
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
      booking_details: null,
      arrowBackIcon: arrowBack,
      slides: ['Booking Details', 'Confirmation'],
      // slides: ['Booking Details', 'Payment Methods', 'Confirmation'],
      currentStep: 0,
      submitLoading: false,
    };
  },
  computed: {
    item_to_rent() {
      return this.$store.state.item_to_rent;
    },
    bookingDetails() {
      return this.$store.state.booking_details;
    },
  },
  methods: {
    handleOrderPlace() {
      this.submitLoading = true;
      this.axios.post(`/order`, { booking_details: this.bookingDetails, item_to_rent: this.item_to_rent }).then((res) => {
          this.$store.commit('setBookingDetails', null);
          this.$store.commit('removeAllItemToRent');
          this.$store.dispatch('getCart');
          const orderData = res.data.booking;
          const gcash_info = res.data.gcash_info;
          localStorage.setItem('lastOrder', JSON.stringify(orderData));
          localStorage.setItem('gcash_info', JSON.stringify(gcash_info));
          setTimeout(() => {
            this.$router.push('/success-order');
          }, 200);
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.submitLoading = false;
      })
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
      if(this.item_to_rent.length && this.item_to_rent[0].need_driver_license && !this.booking_details?.selectedFileBase64 && !this.booking_details?.book_with_driver){
        alert('Please upload a copy of your driver license.');
        return;
      }
      if(!this.booking_details?.address || !this.booking_details?.full_name || !this.booking_details?.email || !this.booking_details?.phone){
        alert('Please fill in all required fields.');
        return;
      }
      else if (!this.booking_details?.deliveryOption){
        alert('Please provide a delivery address.');
        return;
      }
      else if (!this.booking_details.paymentType){
        alert('Please select a payment method.');
        return;
      }
      else if (!this.booking_details.pickupDate || !this.booking_details.returnDate){
        alert('Please select a pickup date.');
        return;
      }
      else if (this.booking_details.pickupDate && this.booking_details.returnDate) {
        const pickup = new Date(this.booking_details.pickupDate);
        const returnD = new Date(this.booking_details.returnDate);

        // Normalize to date only (ignore time zone/time of day)
        const pickupDateOnly = new Date(pickup.getFullYear(), pickup.getMonth(), pickup.getDate());
        const returnDateOnly = new Date(returnD.getFullYear(), returnD.getMonth(), returnD.getDate());

        if (pickupDateOnly >= returnDateOnly) {
          alert('Return date must be after pickup date.');
          return;
        }
      }
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

  watch: {
    bookingDetails(newVal) {
      this.booking_details = newVal;
    },
  },
};
</script>
<style scoped>
.header {
  border-bottom: 1px solid #e0e0e0;
}

/* Keep existing stepper styles */

.step-controls {
  /* Remove this because button is now fixed in footer */
  display: none;
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
