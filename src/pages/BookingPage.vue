<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-title>Rental History</ion-title>
    </ion-header>

    <ion-content >
      <!-- Filters -->
      <ion-segment v-model="selectedFilter" scrollable style="background-color: #fff;">
        <ion-segment-button value="all">All</ion-segment-button>
        <ion-segment-button value="active">Active</ion-segment-button>
        <ion-segment-button value="completed">Completed</ion-segment-button>
        <ion-segment-button value="cancelled">Cancelled</ion-segment-button>
      </ion-segment>

      <ion-list v-if="filteredBookings.length" style="background: transparent; max-height: 420px; overflow-y: auto; padding: 0 10px;">
        <ion-item v-for="booking in filteredBookings" :key="booking.id" class="booking-card" @click="handleGoToReview(booking.id)" lines="none">
          <ion-thumbnail slot="start">
            <img :src="booking.image" :alt="booking.carModel" class="car-thumb" />
          </ion-thumbnail>
          <ion-label>
            <!-- <h3>{{ booking.carModel }}</h3> -->
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
      </ion-list>
      <div v-else style="text-align: center; margin-top: 50px; color: #000;">
        No bookings found for the selected filter.
      </div>
    </ion-content>
    <ion-loading :is-open="loading" message="Please wait..."></ion-loading>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSegment, IonSegmentButton, IonThumbnail, IonLoading } from '@ionic/vue'

export default {
  name: 'BookingHistory',
  components: { IonPage, IonHeader, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSegment, IonSegmentButton, IonThumbnail, IonLoading },
  data() {
    return {
      selectedFilter: 'all',
      loading: false,
      bookings: []
    }
  },
  computed: {
    filteredBookings() {
      switch (this.selectedFilter) {
        case 'active': return this.bookings.filter(b => b.status === 'confirmed')
        case 'completed': return this.bookings.filter(b => b.status === 'completed')
        case 'cancelled': return this.bookings.filter(b => b.status === 'cancelled')
        default: return this.bookings
      }
    }
  },
  mounted() {
    this.handleGetConfirmedBookings();
  },
  methods: {
    handleGoToReview(bookingId) {
      this.$router.push('/add-review/' + bookingId);
    },
    handleGetConfirmedBookings() {
      this.loading = true;
      this.axios.get(`/order/get-confirmed-bookings?status=${this.selectedFilter}`)
        .then((res) => {
          if (res.data && res.data.data) {
           const bookingsData = res.data.data.map((item)=>{
              return { 
                id: item.item.id,
                carModel: 'null',
                image: item.item.images[0].image_url || '',
                pickupDate: item.booking.start_date,
                returnDate: item.booking.end_date,
                paymentType: item.booking.payment_type,
                dailyPrice: item.item.price_per_day,
                status: item.booking.status,
              }
           });
           this.bookings = bookingsData;
          }
        })
        .catch((error) => {
          console.error('Error fetching bookings:', error);
        }).finally(() => {
          this.loading = false;
        });
    },
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

<style>
.inner-scroll{
  padding: 0 !important;
}
</style>
<style scoped>

ion-content{
  --background: #f3f3f3 !important;
}

.booking-card { background-color: #fff; border-radius: 12px; margin: 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.car-thumb { width: 100%; height: 100%; object-fit: contain; border-radius: 6px; }
.status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #fff; }
.status-badge.active { background-color: #28a745; }
.status-badge.confirmed { background-color: #28a745; }
.status-badge.completed { background-color: #007bff; }
.status-badge.cancelled { background-color: #dc3545; }
.status-badge.cancelled { background-color: #dc3545; }
</style>
