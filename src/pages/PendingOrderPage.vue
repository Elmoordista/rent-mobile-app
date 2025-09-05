<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center">
      <ion-title>Pending Orders</ion-title>
    </ion-header>

    <ion-content class="ion-padding pending-orders-content">
      <ion-list>
        <ion-item
          v-for="(booking, id) in orders"
          :key="id"
          class="booking-card"
        >
          <ion-label>
            <div class="order-summary">
              <div class="summary-row">
                <span>Total Price:</span>
                <span class="highlight">₱{{ totalPrice(booking) }}</span>
              </div>
              <div class="summary-row">
                <span>Rent Time:</span>
                <span class="highlight">{{ rentalDays(booking) }} days</span>
              </div>
              <div class="summary-row">
                <span>Payment:</span>
                <span class="payment-badge">{{ booking.paymentType }}</span>
              </div>
            </div>

            <ion-button
              expand="full"
              fill="solid"
              color="dark"
              class="show-items-btn"
              @click="goToOrderDetails(id)"
            >
              Show All Items
            </ion-button>
          </ion-label>
        </ion-item>

        <ion-item v-if="!Object.keys(orders).length">
          <ion-label>No pending orders found.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from "@ionic/vue";

export default {
  name: "PendingOrders",
  components: {
    IonPage,
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton
  },
  data() {
    return {
      // Example dynamic orders object
      orders: {
        1: {
          pickupDate: "2025-09-05T09:00:00",
          returnDate: "2025-09-07T18:00:00",
          dailyPrice: 2000,
          paymentType: "GCash",
          status: "Pending",
          items: [
            { id: 1, name: "GPS", price: 200 },
            { id: 2, name: "Child Seat", price: 300 }
          ]
        },
        2: {
          pickupDate: "2025-09-20T09:00:00",
          returnDate: "2025-09-21T18:00:00",
          dailyPrice: 1500,
          paymentType: "Credit Card",
          status: "Pending",
          items: [{ id: 1, name: "Extra Insurance", price: 500 }]
        },
        3: {
          pickupDate: "2025-09-20T09:00:00",
          returnDate: "2025-09-21T18:00:00",
          dailyPrice: 1500,
          paymentType: "Credit Card",
          status: "Pending",
          items: [{ id: 1, name: "Extra Insurance", price: 500 }]
        },
        4: {
          pickupDate: "2025-09-20T09:00:00",
          returnDate: "2025-09-21T18:00:00",
          dailyPrice: 1500,
          paymentType: "Credit Card",
          status: "Pending",
          items: [{ id: 1, name: "Extra Insurance", price: 500 }]
        }
      }
    };
  },
  methods: {
    goToOrderDetails(id) {
      // Navigate to detailed order page
      this.$router.push({ name: "OrderDetails", params: { id } });
    },
    rentalDays(booking) {
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    totalPrice(booking) {
      return this.rentalDays(booking) * booking.dailyPrice;
    }
  }
};
</script>
<style>
.list-md { 
    background : transparent;
    padding-top: 0 !important;
}
ion-item{
    margin-top: 0 !important;
}
</style>

<style scoped>

.list-md { 
    --background : transparent;
}
.pending-orders-content {
  --background: #f5f5f5; /* light gray page background */
}

.booking-card {
  background: #fff; /* white cards */
  border-radius: 14px;
  margin: 10px 0;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.booking-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.order-summary {
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 15px;
}

.highlight {
  font-weight: 600;
  color: #000;
}

.payment-badge {
  background-color: #f0f3ff;
  color: #2c7be5;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.show-items-btn {
  margin-top: 8px;
  font-weight: 500;
}
</style>
