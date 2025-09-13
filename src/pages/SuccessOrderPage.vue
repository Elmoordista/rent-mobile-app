<template>
  <ion-page class="success-page">
    <ion-content class="ion-padding">
      <!-- Success Icon & Message -->
      <div class="success-header">
        <ion-icon :icon="checkmarkCircleOutline" size="large" class="success-icon"></ion-icon>
        <h2>Booking Confirmed!</h2>
        <p>Your car rental has been successfully booked.</p>
      </div>

      <!-- Payment Info (GCash only) -->
      <ion-card v-if="order?.payment_type && order?.payment_type.toLowerCase() === 'gcash'" class="payment-info">
        <ion-item lines="none">
          <ion-label>
            <h3>💳 Pay via GCash</h3>
            <p>Please send your payment to:</p>
          </ion-label>
        </ion-item>
        <div class="gcash-details">
          <p><strong>GCash Number:</strong> {{ gcashDetails.account_number }}</p>
          <p><strong>Account Name:</strong> {{ gcashDetails.account_name }}</p>
          <p><strong>Total Amount:</strong> ₱{{ booking.totalPrice.toLocaleString() }}</p>
          <p class="note">📌 Don’t forget to upload your proof of payment in your booking details.</p>
        </div>
      </ion-card>
      <!-- Action Buttons -->
      <ion-button expand="block" shape="round" color="success" class="action-btn" @click="goHome">
        Go to Home
      </ion-button>
      <ion-button expand="block" shape="round" color="medium" class="action-btn" @click="viewBooking">
        View Bookings
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { onIonViewWillEnter } from '@ionic/vue';
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
        paymentType: 'gcash', // 👈 Example set to gcash
        pickupDate: '2025-09-05T09:00:00',
        returnDate: '2025-09-07T18:00:00',
        totalPrice: 4000,
      },
      gcashDetails: {
        account_number: '0917-123-4567',
        account_name: 'Juan Dela Cruz',
      },
      order : null,
    };
  },

  ionViewWillEnter() {
    const savedOrder = localStorage.getItem('lastOrder');
    const savedGcashInfo = localStorage.getItem('gcash_info');
    if (savedOrder) {
      this.order = JSON.parse(savedOrder);
    }
    if (savedGcashInfo) {
      this.gcashDetails = JSON.parse(savedGcashInfo);
    }
  },
  methods: {
    goHome() {
      location.href = '/';
    },
    viewBooking() {
      this.$router.push('/pending-order');
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

/* Payment Info Card */
.payment-info {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  padding: 10px;
}

.gcash-details {
  text-align: left;
  padding: 10px 16px 16px;
  font-size: 15px;
  line-height: 1.5;
}

.gcash-details strong {
  color: #000;
}

.gcash-details .note {
  color: #e67e22;
  font-size: 14px;
  margin-top: 8px;
}

.action-btn {
  max-width: 400px;
  margin: 8px auto;
  border-radius: 10px;
}
</style>
