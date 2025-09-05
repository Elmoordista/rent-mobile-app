<template>
  <ion-page class="success-page">
    <ion-content class="ion-padding">
      <!-- Success Icon & Message -->
      <div class="success-header">
        <ion-icon :icon="checkmarkCircleOutline" size="large" class="success-icon"></ion-icon>
        <h2>Booking Confirmed!</h2>
        <p>Your car rental has been successfully booked.</p>
      </div>

      <!-- Booking Summary Card -->
      
      <!-- Action Buttons -->
      <ion-button expand="block" shape="round" color="success" class="action-btn" @click="goHome">
        Go to Home
      </ion-button>
      <ion-button expand="block" shape="round" color="medium"  class="action-btn" @click="viewBooking">
        View Booking History
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { checkmarkCircleOutline } from 'ionicons/icons';
import { IonPage, IonContent, IonCard, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/vue';

export default {
  name: 'SuccessOrderPage',
  components: { IonPage, IonContent, IonCard, IonItem, IonLabel, IonButton, IonIcon },
  data() {
    return {
      checkmarkCircleOutline,
      booking: {
        id: 'CR12345',
        status: 'Confirmed',
        carModel: 'Toyota Vios',
        deliveryOption: 'Pickup',
        paymentType: 'Cash on Delivery',
        pickupDate: '2025-09-05T09:00:00',
        returnDate: '2025-09-07T18:00:00',
        totalPrice: 4000,
      }
    };
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    },
    goHome() {
      this.$router.push('/');
    },
    viewBooking() {
      this.$router.push('/booking-history');
    }
  }
};
</script>

<style scoped>
.success-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-header {
  margin: 40px 0 20px 0;
}

.success-icon {
  color: #4CAF50;
  font-size: 80px;
  margin-bottom: 20px;
}

.success-header h2 {
  color: #4CAF50;
  margin-bottom: 8px;
  font-size: 24px;
}

.success-header p {
  color: #555;
  margin-bottom: 30px;
  font-size: 16px;
}

.booking-summary {
  width: 100%;
  max-width: 400px;
  text-align: left;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #e0f7f1, #f0fcf9);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.summary-top h3 {
  font-size: 18px;
  font-weight: bold;
}

.summary-top .status {
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.summary-top .status.confirmed {
  background-color: #4CAF50;
}

.summary-top .status.cancelled {
  background-color: #f44336;
}

.summary-body ion-item {
  font-size: 14px;
  margin-bottom: 5px;
}

.action-btn {
  max-width: 400px;
  margin: 8px auto;
  border-radius: 10px;
}
</style>
