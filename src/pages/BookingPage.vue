<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Booking</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>Book your ride here.</p>

      <h2>Booking History</h2>
      <ion-list>
        <ion-item v-for="booking in bookings" :key="booking.id" lines="full">
          <ion-label>
            <h3>{{ booking.destination }}</h3>
            <p>{{ formatDate(booking.date) }}</p>
            <p>Status: <strong>{{ booking.status }}</strong></p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue'
import { ref } from 'vue'

const bookings = ref([
  {
    id: 1,
    destination: 'Airport',
    date: '2025-05-20T10:00:00',
    status: 'Completed',
  },
  {
    id: 2,
    destination: 'Downtown Mall',
    date: '2025-05-22T15:30:00',
    status: 'Cancelled',
  },
  {
    id: 3,
    destination: 'Train Station',
    date: '2025-06-01T08:45:00',
    status: 'Upcoming',
  },
])

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateStr).toLocaleString(undefined, options)
}
</script>
