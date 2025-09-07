<template>
  <ion-page class="ion-page-wrapper confirmation-wrapper">
    <!-- Booking Preview -->
    <ion-card class="booking-details">
      <div class="book-driver">
        <span>Confirm Your Booking</span>
        <span>Please review the details below before placing your order.</span>
      </div>
    </ion-card>

    <!-- Delivery Option -->
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Delivery Option</ion-label>
      </ion-item>

      <ion-radio-group :value="booking.deliveryOption" v-model="booking.deliveryOption" disabled>
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

    <!-- Payment Type -->
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Payment Type</ion-label>
      </ion-item>

      <ion-radio-group :value="booking.paymentType" v-model="booking.paymentType" disabled>
        <ion-item>
          <ion-label>Cash on Delivery</ion-label>
          <ion-radio slot="start" value="cod"></ion-radio>
        </ion-item>
        <ion-item>
          <ion-label>Gcash / E-Wallet</ion-label>
          <ion-radio slot="start" value="gcash"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-card>

    <!-- Customer Info -->
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Customer Info</ion-label>
      </ion-item>
      <ion-list lines="none">
        <ion-item>
          <ion-label>Full Name: {{ booking.full_name }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Email: {{ booking.email }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Phone: {{ booking.phone }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Address: {{ booking.address }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-card>

    <!-- Rental Date -->
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Rental Date</ion-label>
      </ion-item>

      <div class="date-inputs">
        <div class="date-item">
          <ion-label>Pick up Date</ion-label>
          <ion-note style="color:#000">{{ formatDate(booking.pickupDate) }}</ion-note>
        </div>
        <div class="date-item">
          <ion-label>Return Date</ion-label>
          <ion-note style="color:#000">{{ formatDate(booking.returnDate) }}</ion-note>
        </div>
      </div>
    </ion-card>
    <!-- Total -->
    <ion-card class="delivery-option">
      <ion-item>
        <ion-label>Total Price: ₱{{ booking.totalPrice ? priceAddComma(booking.totalPrice) : 0 }}</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Total Days: {{ total_days }} day(s)</ion-label>
      </ion-item>
    </ion-card>

    <!-- Place Order Button -->
  </ion-page>
</template>

<script>

export default {
  data() {
    return {
      total_days: 1,
      booking: {
        book_with_driver: false,
        deliveryOption: 'pickup',
        paymentType: 'cod',
        pickupDate: new Date().toISOString(),
        returnDate: new Date(Date.now() + 86400000).toISOString(), // now + 1 day
        email: '',
        phone: '',
        address: '',
        full_name: '',
      },
    }
  },
  computed: {
    bookingDetails() {
      return this.$store.state.booking_details;
    },
    item_to_rent() {
      return this.$store.state.item_to_rent;
    },
  },
  mounted() {
    if(this.bookingDetails){
      this.booking = { ...this.bookingDetails};
      const pickup = new Date(this.booking.pickupDate);
      const returnD = new Date(this.booking.returnDate);
      const diffTime = Math.abs(returnD - pickup);
      this.total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Include both pickup and return days
      if(this.total_days < 1) this.total_days = 1;
    }
    if(this.item_to_rent && this.item_to_rent.length){
      const total = this.item_to_rent.filter(item => item.qty).reduce((sum, item) => sum + (item.pricePerDay * item.qty), 0);
      this.booking.totalPrice = total * this.total_days;
    }
  },
  methods: {
    priceAddComma(price){
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    },
    placeOrder() {
      // Here you can call API to create order
      alert('Your booking has been placed!');
    }
  }
}
</script>

<style scoped>
ion-item{
  --background : #fff !important;
}
.delivery-option {
  background-color: #fff !important;
  margin: 0;
  padding: 10px;
  margin-top: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: none;
}

.booking-details {
  background-color: #d1ecf1 !important; /* light blue for preview */
  margin: 0;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  flex-direction: column;
  text-align: center;
}

.book-driver span:first-child {
  color: #0c5460;
  font-weight: bold;
  font-size: 16px;
}

.book-driver span:last-child {
  color: #0c5460;
  font-size: 14px;
}

.date-inputs {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.date-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #ebebeb;
  color: #000;
  padding: 10px;
  border-radius: 12px;
}
</style>
