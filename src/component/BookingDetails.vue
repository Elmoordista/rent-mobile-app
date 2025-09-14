<template>
  <ion-page class="ion-page-wrapper booking-details-wrapper">
    <ion-card v-if="item_to_rent && item_to_rent[0].need_driver_license" class="booking-details"  style="margin-top: 0 !important;">
      <div class="book-driver" >
        <span>Book With Driver</span>
        <span>Don't have a driver, book a driver.</span>
      </div>
      <ion-toggle v-model="booking_details.book_with_driver"></ion-toggle>
    </ion-card>
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Delivery Option</ion-label>
      </ion-item>
      <ion-radio-group :value="booking_details.deliveryOption" v-model="booking_details.deliveryOption">
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

      <ion-radio-group :value="booking_details.paymentType" v-model="booking_details.paymentType">
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
          <ion-radio slot="start" value="gcash"></ion-radio>
        </ion-item>
      </ion-radio-group>
      <div v-if="booking_details.paymentType === 'cod'" style="font-size: 12px; color: #666; margin-left: -5px; margin-top: 10px; color: red;">
        <span>Note: Cash on Delivery may include an extra service fee.</span>
      </div>
    </ion-card>
    <!-- Customer Info -->
    <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">
      <ion-input v-model="booking_details.full_name" type="text"  placeholder="Full name">
        <ion-icon slot="start" :icon="person" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input v-model="booking_details.email" type="text" placeholder="Email address">
        <ion-icon slot="start" :icon="mail" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input v-model="booking_details.phone"  @keydown="isNumber($event)" type="text" placeholder="Phone number">
        <ion-icon slot="start" :icon="call" aria-hidden="true"></ion-icon>
      </ion-input>
      <ion-input v-model="booking_details.address" type="text" placeholder="Address">
        <ion-icon slot="start" :icon="location" aria-hidden="true"></ion-icon>
      </ion-input>
    </div>
    
    <!-- Requirements -->

    <div v-if="item_to_rent && item_to_rent[0].need_driver_license && !booking_details.book_with_driver" class="div-wrapper">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Driver Licence :</span>
        <ion-button v-if="booking_details.selectedFileBase64" size="small" color="dark" @click="$refs.fileInput.click()" style="margin-bottom: 10px;">
          Upload File Again
        </ion-button>
      </div>
      <!-- <div>
        <ion-input id="driver-license"  placeholder="Enter your requirements" type="file"></ion-input>
      </div> -->
      <div style="text-align: center;">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleFileSelect"
            :style="`margin-bottom: 20px; display: ${!booking_details.selectedFileBase64 ? 'block' : 'none'};`"
          />

          <div v-if="booking_details.selectedFileBase64" class="license-preview">
            <img :src="booking_details.selectedFileBase64" class="img-preview" alt="Preview" style="max-width: 50%; border-radius: 8px;" />
          </div>
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
            <ion-note slot="end">{{ formatDate(booking_details.pickupDate) }}</ion-note>

        </div>

        <div lines="none" class="date-item" button @click="openPicker('return')">
            <ion-label>Return Date</ion-label>
            <ion-note slot="end">{{ formatDate(booking_details.returnDate) }}</ion-note>
        </div>
      </div>
    </div>
    <ion-modal 
        :is-open="showPicker" 
        @didDismiss="showPicker = false" 
        id="example-modal" 
        ref="modal" 
      >
        <div class="wrapper">
          <ion-datetime
            v-model="tempDate"
            presentation="date"
            :min="datePickerMode === 'return' ? booking_details.pickupDate || minDate : minDate"
            :max="datePickerMode === 'pickup' ? booking_details.returnDate || maxDate : maxDate"
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
import { IonCard, IonText, IonRadioGroup, IonInput, IonToggle, IonDatetime, IonModal, IonItem, IonLabel, IonNote, IonButton } from '@ionic/vue';
import { personOutline, mailOutline, callOutline, locationOutline } from 'ionicons/icons'

export default {
  components: {
    IonCard,
    IonToggle,
    IonText,
    IonDatetime,
    IonModal,
    IonItem,
    IonLabel,
    IonNote,
    IonRadioGroup,
    IonInput,
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
      tempDate: new Date().toISOString(),
      minDate: new Date().toISOString(),
      maxDate: new Date(Date.now() + 2592000000).toISOString(), // plus 1 month
      showPicker: false,
      activeField: null,
      validationError: '',
      item_to_rent: null,
      booking_details: {
          book_with_driver: false,
          deliveryOption: 'pickup',
          paymentType: 'cod',
          pickupDate: new Date().toISOString(),
          returnDate: new Date(Date.now() + 86400000).toISOString(), // now + 1 day
          selectedFileBase64: null,
          email: '',
          phone: '',
          address: '',
          full_name: '',
      },
      errors: {
        full_name: '',
        email: '',
        phone: '',
        address: '',
      }
    }
  },
  computed: {
    bookingDetails() {
      return this.$store.state.booking_details;
    },
    rent_item() {
      return this.$store.state.item_to_rent;
    },
  },
  mounted() {
    // console.log(this.bookingDetails,'xxxx')
    if(this.bookingDetails){
      this.booking_details = { ...this.bookingDetails};
    }
    if(this.rent_item){
      this.item_to_rent = this.rent_item;
    }
    this.getLatestOrderInfo();
    // const existingDetails = this.$store.state.booking_details;
    // if (existingDetails && Object.keys(existingDetails).length) {
    //   this.booking_details = { ...this.booking_details, ...existingDetails };
    // }
  },
  methods: {
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          this.booking_details.selectedFileBase64 = event.target.result; // <-- base64 string
        };
        reader.readAsDataURL(file);
      }
    },
    isNumber(e){
        const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
        const keyPressed = e.key;

        if (!keysAllowed.includes(keyPressed)) {
            e.preventDefault()
        }
    },

    getLatestOrderInfo() {
      this.axios.get(`/user/latest-order`).then((res) => {
        if(res.data.success && res.data.data){
          const booking = JSON.parse(res.data.data.notes);
          this.booking_details.full_name = booking.full_name || '';
          this.booking_details.email = booking.email || '';
          this.booking_details.phone = booking.phone || '';
          this.booking_details.address = booking.address || '';
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
      })
    },
    emitBooking() {
      this.$emit('setBookingDetails', { ...this.booking_details });
    },
    openPicker(type) {
      this.activeField = type
      this.tempDate = type === 'pickup' ? this.pickupDate : this.returnDate
      this.showPicker = true
    },
    confirmDate() {
      if (this.activeField === 'pickup') {
        this.booking_details.pickupDate = this.tempDate
      } else {
        this.booking_details.returnDate = this.tempDate
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

  watch: {
    booking_details: {
      handler(oldVal, newVal) {
        if(newVal != undefined){
          this.$store.commit('setBookingDetails', this.booking_details);
        }
      },
      deep: true,
      immediate: true,
    },
  }
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
.license-preview{
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    margin: 0 10px;
    padding: 10px 0;
}

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
