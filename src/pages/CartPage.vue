<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Cart Page</ion-title>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card v-if="!items.length">
        <ion-card-header>
          <ion-card-title>Your cart is empty</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Add items to rent and they'll appear here.
        </ion-card-content>
      </ion-card>

      <ion-list v-else>
        <ion-item v-for="(item, idx) in items" :key="item.id" lines="full">
          <!-- Selection checkbox -->
          <ion-checkbox slot="start" v-model="item.selected"></ion-checkbox>

          <ion-thumbnail slot="start">
            <img :src="item.image || placeholder" :alt="item.name" class="cart-thumb" />
          </ion-thumbnail>

          <ion-label>
            <h3>{{ item.name }}</h3>
            <p>₱{{ formatCurrency(item.pricePerDay) }} / day</p>

            <!-- Quantity controls -->
            <div class="flex items-center mt-2" style="display: flex; align-items: center; gap: 8px;">
              <ion-button size="small" color="dark" @click="decreaseQty(item)" :disabled="item.qty <= 1">-</ion-button>
              <span class="mx-2">{{ item.qty }}</span>
              <ion-button size="small" color="dark" @click="increaseQty(item)">+</ion-button>
            </div>

            <p class="mt-1">Subtotal: ₱{{ formatCurrency(itemSubtotal(item)) }}</p>
          </ion-label>

          <ion-button slot="end" color="danger" size="small" fill="clear" @click="removeItem(idx)">
            Remove
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>

    <!-- Fixed Checkout Footer -->
    <ion-footer v-if="selectedItems.length">
      <ion-toolbar>
        <div class="checkout-footer">
          <div class="total-info">
            <p class="subtotal-label">Total:</p>
            <p class="subtotal-amount">₱{{ formatCurrency(selectedSubtotal) }}</p>
          </div>
          <ion-button expand="block" color="dark">
            Checkout ({{ selectedItems.length }})
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonNote,
  IonCheckbox,
} from '@ionic/vue'

import { arrowBackOutline } from 'ionicons/icons'

export default {
  name: 'CartPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButton,
    IonNote,
    IonCheckbox,
  },
  data() {
    return {
      placeholder: 'https://via.placeholder.com/128x128.png?text=Item',
      arrowBackIcon: arrowBackOutline,
      items: [
        { id: 1, name: 'Mirrorless Camera', pricePerDay: 800, qty: 1, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png', selected: true },
        { id: 2, name: 'Carbon Tripod', pricePerDay: 150, qty: 2, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png', selected: false },
        { id: 3, name: 'Carbon Tripod', pricePerDay: 150, qty: 2, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png', selected: false },
        { id: 4, name: 'Carbon Tripod', pricePerDay: 150, qty: 2, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png', selected: false },
      ],
    }
  },
  computed: {
    selectedItems() {
      return this.items.filter(item => item.selected)
    },
    selectedSubtotal() {
      return this.selectedItems.reduce((sum, item) => sum + this.itemSubtotal(item), 0)
    },
  },
  methods: {
    handleBack() {
      this.$router.back()
    },
    itemSubtotal(item) {
      return item.pricePerDay * item.qty
    },
    formatCurrency(n) {
      return n.toLocaleString('en-PH', { maximumFractionDigits: 0 })
    },
    removeItem(idx) {
      this.items.splice(idx, 1)
    },
    increaseQty(item) {
      item.qty++
    },
    decreaseQty(item) {
      if (item.qty > 1) {
        item.qty--
      }
    },
  },
}
</script>

<style scoped>
ion-content {
  ---background: #f9f9f9;
}

ion-thumbnail {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.cart-thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.checkout-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  gap: 12px;
}

.total-info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.subtotal-label {
  margin: 0;
  font-weight: 500;
  color: #666;
}

.subtotal-amount {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #000;
}
</style>


