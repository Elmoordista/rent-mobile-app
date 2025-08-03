<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Payment Methods</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Booking #{{ booking.id }}</ion-card-title>
          <ion-card-subtitle>{{ booking.status }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-label>
                <h3>Guest Name</h3>
                <p>{{ booking.guestName }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Check-In</h3>
                <p>{{ booking.checkIn }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Check-Out</h3>
                <p>{{ booking.checkOut }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Room Type</h3>
                <p>{{ booking.roomType }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Total Price</h3>
                <p>${{ booking.price.toFixed(2) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>

        <ion-footer class="ion-padding">
          <ion-button expand="block" color="primary" @click="handleCancel">
            Cancel Booking
          </ion-button>
        </ion-footer>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      booking: {
        id: 'A12345',
        status: 'Confirmed',
        guestName: 'John Doe',
        checkIn: '2025-08-10',
        checkOut: '2025-08-15',
        roomType: 'Deluxe Suite',
        price: 1250.0,
      },
    };
  },
  methods: {
    handleCancel() {
      alert('Booking cancelled.');
    },
  },
};
</script>
