<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-title>Car Rental History</ion-title>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Filters -->
      <ion-segment v-model="selectedFilter" scrollable>
        <ion-segment-button value="all">All</ion-segment-button>
        <ion-segment-button value="active">Active</ion-segment-button>
        <ion-segment-button value="completed">Completed</ion-segment-button>
        <ion-segment-button value="cancelled">Cancelled</ion-segment-button>
      </ion-segment>

      <!-- Booking List -->
      <ion-list style="background: transparent;">
        <ion-item v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
          <ion-thumbnail slot="start">
            <img :src="booking.image" :alt="booking.carModel" class="car-thumb" />
          </ion-thumbnail>
          <ion-label>
            <h3>{{ booking.carModel }}</h3>
            <p>Pickup: {{ formatDate(booking.pickupDate) }}</p>
            <p>Return: {{ formatDate(booking.returnDate) }}</p>
            <p>Payment: <strong>{{ booking.paymentType }}</strong></p>
            <p>Total Days: {{ rentalDays(booking) }} days</p>
            <p>Total Price: <strong>₱{{ totalPrice(booking) }}</strong></p>
            <p>Status: 
              <span :class="['status-badge', booking.status.toLowerCase()]">{{ booking.status }}</span>
            </p>
          </ion-label>
        </ion-item>

        <ion-item v-if="!filteredBookings.length">
          <ion-label>No bookings found for this filter.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSegment, IonSegmentButton, IonThumbnail
} from '@ionic/vue'

export default {
  name: 'CarBookingHistory',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonSegment, IonSegmentButton, IonThumbnail
  },
  data() {
    return {
      selectedFilter: 'all',
      bookings: [
        {
          id: 1,
          carModel: 'Toyota Vios',
          image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png',
          pickupDate: '2025-09-05T09:00:00',
          returnDate: '2025-09-07T18:00:00',
          paymentType: 'Credit Card',
          dailyPrice: 2000,
          status: 'Completed',
        },
        {
          id: 2,
          carModel: 'Honda Civic',
          image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png',
          pickupDate: '2025-09-10T08:00:00',
          returnDate: '2025-09-12T20:00:00',
          paymentType: 'Cash',
          dailyPrice: 2500,
          status: 'Cancelled',
        },
        {
          id: 3,
          carModel: 'Mitsubishi Montero',
          image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png',
          pickupDate: '2025-09-15T07:30:00',
          returnDate: '2025-09-18T19:00:00',
          paymentType: 'Credit Card',
          dailyPrice: 3000,
          status: 'Active',
        },
      ],
    }
  },
  computed: {
    filteredBookings() {
      switch (this.selectedFilter) {
        case 'active':
          return this.bookings.filter(b => b.status === 'Active')
        case 'completed':
          return this.bookings.filter(b => b.status === 'Completed')
        case 'cancelled':
          return this.bookings.filter(b => b.status === 'Cancelled')
        default:
          return this.bookings
      }
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateStr).toLocaleString(undefined, options)
    },
    rentalDays(booking) {
      const start = new Date(booking.pickupDate)
      const end = new Date(booking.returnDate)
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    totalPrice(booking) {
      return this.rentalDays(booking) * booking.dailyPrice
    }
  }
}
</script>

<style scoped>
ion-content {
  --background: #f5f5f5; /* light gray */
}

.booking-card {
  background-color: #fff;
  border-radius: 12px;
  margin: 12px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.booking-card:hover {
  transform: translateY(-2px);
}

.car-thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.status-badge.active {
  background-color: #28a745;
}

.status-badge.completed {
  background-color: #007bff;
}

.status-badge.cancelled {
  background-color: #dc3545;
}
</style>
