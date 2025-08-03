<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Enter Payment Details</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Cardholder Name</ion-label>
            <ion-input v-model="payment.name" type="text" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Card Number</ion-label>
            <ion-input
              v-model="payment.cardNumber"
              type="text"
              maxlength="16"
              minlength="16"
              inputmode="numeric"
              required
              @input="formatCardNumber"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Expiry Date (MM/YY)</ion-label>
            <ion-input
              v-model="payment.expiry"
              type="text"
              maxlength="5"
              placeholder="MM/YY"
              required
              @input="formatExpiry"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">CVV</ion-label>
            <ion-input
              v-model="payment.cvv"
              type="password"
              maxlength="3"
              minlength="3"
              inputmode="numeric"
              required
            ></ion-input>
          </ion-item>

          <ion-button expand="block" color="primary" class="ion-margin-top" @click="submitPayment" :disabled="!isFormValid">
            Pay Now
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      payment: {
        name: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
      },
    }
  },
  computed: {
    isFormValid() {
      return (
        this.payment.name.trim() !== '' &&
        /^\d{16}$/.test(this.payment.cardNumber.replace(/\s/g, '')) &&
        /^\d{2}\/\d{2}$/.test(this.payment.expiry) &&
        /^\d{3}$/.test(this.payment.cvv)
      )
    },
  },
  methods: {
    formatCardNumber() {
      // Add spaces every 4 digits for readability
      let val = this.payment.cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
      let parts = []
      for (let i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4))
      }
      this.payment.cardNumber = parts.join(' ')
    },
    formatExpiry() {
      // Format as MM/YY
      let val = this.payment.expiry.replace(/[^0-9]/g, '')
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4)
      }
      this.payment.expiry = val
    },
    submitPayment() {
      if (!this.isFormValid) {
        alert('Please fill in valid payment details.')
        return
      }
      // Simulate payment processing
      alert('Payment successful! Thank you.')
      // Reset form
      this.payment = { name: '', cardNumber: '', expiry: '', cvv: '' }
    },
  },
}
</script>

<style scoped>
ion-card {
  max-width: 400px;
  margin: auto;
}
</style>
