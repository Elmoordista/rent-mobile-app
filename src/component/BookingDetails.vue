<template>
  <ion-page class="ion-page-wrapper booking-details-wrapper">
    <ion-card class="booking-details">
      <div class="book-driver">
        <span>Book With Driver</span>
        <span>Don't have a driver, book a driver.</span>
      </div>
      <ion-toggle></ion-toggle>
    </ion-card>
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Delivery Option</ion-label>
      </ion-item>

      <ion-radio-group v-model="deliveryOption">
        <ion-item>
          <ion-label>Pickup</ion-label>
          <ion-radio slot="start" value="pickup"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Delivery</ion-label>
          <ion-radio slot="start" value="delivery"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-card>
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Payment Type</ion-label>
      </ion-item>

      <ion-radio-group v-model="paymentType">
        <ion-item>
          <ion-label>Cash on Delivery</ion-label>
          <ion-radio slot="start" value="cod"></ion-radio>
        </ion-item>

        <!-- <ion-item>
          <ion-label>Credit/Debit Card</ion-label>
          <ion-radio slot="start" value="card"></ion-radio>
        </ion-item> -->

        <ion-item>
          <ion-label>Gcash / E-Wallet</ion-label>
          <ion-radio slot="start" value="ewallet"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-card>
    <!-- Customer Info -->
    <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">
      <ion-input label-placement="stacked" placeholder="Full name">
        <ion-icon slot="start" :icon="person" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input label-placement="stacked" placeholder="Email address">
        <ion-icon slot="start" :icon="mail" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input label-placement="stacked" placeholder="Phone number">
        <ion-icon slot="start" :icon="call" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input label-placement="stacked" placeholder="Address">
        <ion-icon slot="start" :icon="location" aria-hidden="true"></ion-icon>
      </ion-input>
    </div>
    
    <!-- Requirements -->

    <div class="div-wrapper">
      <span>Driver Licence :</span>
      <div>
        <ion-input id="driver-license" label-placement="stacked" placeholder="Enter your requirements" type="file"></ion-input>
      </div>
    </div>

    <!-- Rental Date & Time -->
    <div class="rental-datetime">
      <span>Rental Date</span>

      <!-- Rental options -->
      <!-- <div class="rental-options">
        <span
          v-for="option in options"
          :key="option"
          :class="{ active: selectedOption === option }"
          @click="selectedOption = option"
        >
          {{ option }}
        </span>
      </div> -->

      <!-- Date Inputs -->
      <div class="date-inputs">
        <div lines="none" class="date-item" button @click="openPicker('pickup')">
            <ion-label>Pick up Date</ion-label>
            <ion-note slot="end">{{ formatDate(pickupDate) }}</ion-note>

        </div>

        <div lines="none" class="date-item" button @click="openPicker('return')">
            <ion-label>Return Date</ion-label>
            <ion-note slot="end">{{ formatDate(returnDate) }}</ion-note>
        </div>
      </div>
    </div>
    <ion-modal 
        :is-open="showPicker" 
        @didDismiss="showPicker = false" 
        id="example-modal" 
        ref="modal" 
        trigger="open-custom-dialog"
      >
        <div class="wrapper">
          <ion-datetime
            v-model="tempDate"
            presentation="date"
            :min="datePickerMode === 'return' ? pickupDate || minDate : minDate"
            :max="datePickerMode === 'pickup' ? returnDate || maxDate : maxDate"
          ></ion-datetime>
        </div>

        <!-- Optional validation message -->
        <ion-text color="danger" v-if="validationError" style="padding: 0 16px;">
          <p>{{ validationError }}</p>
        </ion-text>

        <div style="display: flex; justify-content: flex-end; padding: 10px;">
          <ion-button fill="clear" @click="showPicker = false">Cancel</ion-button>
          <ion-button @click="confirmDate">OK</ion-button>
        </div>
      </ion-modal>
  </ion-page>
</template>

<script>
import { IonCard, IonToggle, IonDatetime, IonModal, IonItem, IonLabel, IonNote, IonContent, IonButton } from '@ionic/vue';
import { personOutline, mailOutline, callOutline, locationOutline } from 'ionicons/icons'

export default {
  components: {
    IonCard,
    IonToggle,
    IonDatetime,
    IonModal,
    IonItem,
    IonLabel,
    IonNote,
    IonContent,
    IonButton
  },
  data() {
    return {
      person: personOutline,
      mail: mailOutline,
      call: callOutline,
      location: locationOutline,
      options: ['Day'],
      // options: ['Hour', 'Day', 'Week', 'Month'],
      selectedOption: 'Day',

      // date state
      pickupDate: '2024-01-19',
      returnDate: '2024-01-22',
      tempDate: new Date().toISOString(),
      minDate: '2024-01-01',
      maxDate: '2030-12-31',
      showPicker: false,
      activeField: null,
    }
  },
  methods: {
    openPicker(type) {
      this.activeField = type
      this.tempDate = type === 'pickup' ? this.pickupDate : this.returnDate
      this.showPicker = true
    },
    confirmDate() {
      if (this.activeField === 'pickup') {
        this.pickupDate = this.tempDate
      } else {
        this.returnDate = this.tempDate
      }
      this.showPicker = false
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  },
}
</script>

<style>
  ion-modal#example-modal {
    --width: fit-content;
    --min-width: 250px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  }


</style>

<style scoped>

.delivery-option{
  background-color: #fff !important;
  margin: 0;
  padding: 10px;
  margin-top: 15px;
  border-radius: 10px;
  box-shadow: none;
  border: solid 1px #bdbcbc;
}

.delivery-option ion-item{
  --background: #fff;
  font-size: 14px;
}



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

/* Rental DateTime Section */
.rental-datetime {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
  text-align: start;
}

.div-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
  text-align: start;
}

.rental-options {
  display: flex;
  justify-content: space-between;
  text-align: start;
  margin-top: 5px;
}

.rental-options span {
  border: solid 1px #bdbcbc;
  background-color: #fff;
  padding: 6px 15px;
  border-radius: 14px;
  font-size: 13px;
  cursor: pointer;
}

.rental-options span.active {
  background-color: #000;
  color: #fff;
}

/* Pick up / Return Inputs */
.date-inputs {
  display: flex;
  border: 1px solid #bdbcbc;
  border-radius: 50px;
  overflow: hidden;
  margin-top: 10px;
}

.date-item {
  flex: 1;
  text-align: center;
  border-right: 1px solid #bdbcbc;
  background-color: #fff;
  padding: 10px;
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
}

.date-item ion-label{
  font-size: 14px;
}
.date-item ion-note{
  font-size: 12px;
}

.date-item:last-child {
  border-right: none;
}

</style>

<style>

.booking-details {
  background-color: #fff !important;
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: none;
  border: solid 1px #bdbcbc;
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-driver {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-driver span {
  font-size: 14px;
  text-align: start;
}

.book-driver span:first-child {
  color: #000;
}
</style>
