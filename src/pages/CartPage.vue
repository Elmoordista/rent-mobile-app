<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Cart Page</ion-title>
    </ion-header>

    <ion-content >
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
          <ion-checkbox slot="start" v-model="item.selected" @ionChange="handleCheckboxChange(item)"></ion-checkbox>

          <ion-thumbnail slot="start">
            <img :src="item.image || placeholder" :alt="item.name" class="cart-thumb" />
            <!-- <img :src="handleGetImages(item) || placeholder" :alt="item.name" class="cart-thumb" /> -->
          </ion-thumbnail>

          <ion-label>
            <h3>{{ item.name }}</h3>
            <p>₱{{ formatCurrency(item.pricePerDay) }} / day</p>
            <template v-if="item.variation_id">
              <p>Size : <b class="badge">{{ item.variation?.size }}</b></p>
              <p>Color : <b class="badge">{{ item.variation?.color }}</b></p>
            </template>
            <p>Available : {{ item.variation_id ? item.variation?.available_quantity  : item.available_quantity }}</p>
            <!-- Quantity controls -->
            <div class="flex items-center mt-2" style="display: flex; align-items: center; gap: 8px;">
              <ion-button size="small" color="dark" @click="decreaseQty(item)" :disabled="item.qty <= 1">-</ion-button>
              <span class="mx-2">{{ item.qty }}</span>
              <ion-button size="small" color="dark" @click="increaseQty(item)" :disabled="item.qty >= (item.variation_id ? item.variation?.available_quantity : item.available_quantity)">+</ion-button>
            </div>

            <p class="mt-1">Subtotal: ₱{{ formatCurrency(itemSubtotal(item)) }}</p>
          </ion-label>

          <ion-button color="danger" size="small" fill="clear" @click="removeItem(item.id)">
            Remove
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-toast
      :is-open="showToast"
      :message="message"
      duration="2000"
      color="success"
      position="top"
      style="color: #fff;"
      @did-dismiss="showToast = false"
    ></ion-toast>

    <ion-loading
      :is-open="submitLoading"
      message="Processing..."
      spinner="crescent"
    ></ion-loading>

     <ion-loading
      :is-open="loading_item"
      message="Loading..."
      spinner="crescent"
    ></ion-loading>

    <!-- Fixed Checkout Footer -->
    <ion-footer v-if="selectedItems.length">
      <ion-toolbar>
        <div class="checkout-footer">
          <div class="total-info">
            <p class="subtotal-label">Total:</p>
            <p class="subtotal-amount">₱{{ formatCurrency(selectedSubtotal) }}</p>
          </div>
          <ion-button expand="block" color="dark" @click="handleCheckout">
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
  IonLoading,
  IonToast, IonButtons, IonIcon, IonFooter,
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
    IonLoading,
    IonCheckbox,
    IonToast, IonButtons, IonIcon, IonFooter,
  },
  data() {
    return {
      placeholder: '',
      arrowBackIcon: arrowBackOutline,
      showToast: false,
      submitLoading: false,
      loading_item: false,
      message: '',
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
    item_to_rent() {
      return this.$store.state.item_to_rent;
    },
    cartItems() {
      return this.$store.getters.getCart.map((item)=>{
        return {
          id: item.id,
          item_id: item.item.id,
          variation_id: item.variation_id,
          variation: item.variation,
          name: item.item.name,
          available_quantity: item.item.available_quantity,
          need_driver_license: item.item.need_driver_license,
          pricePerDay: item.item.price_per_day,
          qty: item.quantity,
          image: this.handleGetImages(item.item, item.variation_id),
          // image: item.item.has_sizes_color_options ? item.item.variation[0]?.image_url : item.item.images[0]?.image_url,
          // image: item.item.images.length ? item.item.images[0].image_url :'',
          // variations: item.item.variations.length ? item.item.variations[0].image_url : '',
          selected: false, // Default to not selected
          updateTimeouts: {}
        }
      });  // Access cart from Vuex store
    },
  },

  

  mounted() {
    this.items = this.cartItems;
    if(this.item_to_rent && this.item_to_rent.length){
      // If there are items to rent, mark them as selected in the cart
      this.items.forEach(cartItem => {
        if (this.item_to_rent.some(rentItem => rentItem.id === cartItem.id)) {
          cartItem.selected = true;
        }
      });
    }
    this.getCart();
  },
  
  methods: {
    getCart() {
      this.loading_item = true;
      this.axios.get('/cart').then((res) => {
        if(res.data.success) {
          this.$store.commit('setCart', res.data.data); // Update Vuex store with fetched cart data
          this.items = this.cartItems; // Update local items with the latest cart data
          if(this.item_to_rent && this.item_to_rent.length){
            // If there are items to rent, mark them as selected in the cart
            this.items.forEach(cartItem => {
              if (this.item_to_rent.some(rentItem => rentItem.id === cartItem.id)) {
                cartItem.selected = true;
              }
            });
          }
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading_item = false;
      })
    },
    handleGetImages(items, variation_id = null) {
      if (items && items.images && items.images.length > 0 && !items.has_sizes_color_options && !variation_id) {
        return items.images[0]?.image_url;
      } else {
        if(items.variations){
          if(variation_id){
            const variation = items.variations.find(v => v.id === variation_id);
            return variation ? variation.image_url : 'https://via.placeholder.com/150';
          }
          return items.variations[0]?.image_url;
        }
      }
    },
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
      this.handleRemove(idx);
    },
    handleRemove(cart_id) {
      this.submitLoading = true;
      this.axios.delete(`/cart/${cart_id}`).then((res) => {
        if(res.data.success) {
          const find_index = this.items.findIndex(item => item.id === cart_id);
          if (find_index !== -1) {
            this.items.splice(find_index, 1)
          }
          this.showToast = true;
          this.message = 'Item Removed from cart, Successfully!';
          this.$store.dispatch('getCart'); // Refresh cart in Vuex store
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.submitLoading = false;
      })
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    // increaseQty(item) {
    //   item.qty++
    //   this.handleUpdateCartQty(item.id, item.qty);
    // },
    // decreaseQty(item) {
    //   if (item.qty > 1) {
    //     item.qty--
    //     this.handleUpdateCartQty(item.id, item.qty);
    //   }
    // },
     increaseQty(item) {
        item.qty++;
        this.queueUpdate(item.id, item.qty);
      },
      decreaseQty(item) {
        if (item.qty > 1) {
          item.qty--;
          this.queueUpdate(item.id, item.qty);
        }
      },
      queueUpdate(itemId, qty) {
        if (!this.updateTimeouts) {
          this.updateTimeouts = {};
        }

        if (this.updateTimeouts[itemId]) {
          clearTimeout(this.updateTimeouts[itemId]);
        }

        this.updateTimeouts[itemId] = setTimeout(() => {
          this.handleUpdateCartQty(itemId, qty);
          delete this.updateTimeouts[itemId];
        }, 300);
      },
    // if uncheck remove always from item_to_rent
    // if check add to item_to_rent
    handleCheckboxChange(item) {
      if(!item.selected){
        this.$store.commit('removeItemToRent', item.id);
        return;
      }
    },
    handleCheckout() {
      // Proceed to checkout with selected items
      const itemsToRent = this.selectedItems.map(item => ({
        cart_id: item.id,
        item_id: item.item_id,
        name: item.name,
        pricePerDay: item.pricePerDay,
        qty: item.qty,
        image: item.image,
        variation_id: item.variation_id,
        need_driver_license: item.need_driver_license,
      }));
      // Store selected items in Vuex store
      itemsToRent.forEach(item => {
        this.$store.commit('setItemToRent', item);
      });
      this.$router.push('/page-indicator');
    },
    handleUpdateCartQty(cart_id, qty) {
      this.axios.put(`/cart/${cart_id}`, { quantity: qty }).then((res) => {
        if(res.data.success) {
          this.$store.dispatch('getCart'); // Refresh cart in Vuex store
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.submitLoading = false;
      })
    },
  },
}
</script>

<style scoped>
ion-content {
  --background: #f9f9f9;
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


