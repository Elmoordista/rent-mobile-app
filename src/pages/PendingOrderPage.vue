<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Pending Orders</ion-title>
    </ion-header>

    <ion-segment  v-model="selectedTab" scrollable>
      <ion-segment-button value="pending" @click="handleFilterOrders('pending')">Pending</ion-segment-button>
      <ion-segment-button value="confirmed" @click="handleFilterOrders('confirmed')">Confirmed</ion-segment-button>
      <ion-segment-button value="completed" @click="handleFilterOrders('completed')">Completed</ion-segment-button>
      <ion-segment-button value="cancelled" @click="handleFilterOrders('cancelled')">Cancelled</ion-segment-button>
    </ion-segment>

    <!-- Orders List -->
    <ion-content class="ion-padding pending-orders-content" v-if="!loading">
      <ion-list style="background-color: transparent;">
        <ion-item
          v-for="(booking, id) in orders"
          :key="id"
          class="booking-card"
        >
          <ion-label>
            <div class="order-summary">
              <div class="summary-row">
                <span>Order id:</span>
                <span class="highlight" style="border-radius: 5px; background-color: #000; color: #fff; padding: 2px 3px">{{ booking.id }}</span>
              </div>
              <div class="summary-row">
                <span>Total Price:</span>
                <span class="highlight">₱{{ priceAddComma(booking.total_price) }}</span>
              </div>
              <div class="summary-row">
                <span>Rent Time:</span>
                <span class="highlight">{{ rentalDays(booking) }} days</span>
              </div>
              <div class="summary-row">
                <span>Payment:</span>
                <span class="payment-badge" style="text-transform: capitalize;">{{ booking.paymentType }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery:</span>
                <span class="order-delivery" style="text-transform: capitalize;">{{ booking.delivery_type }}</span>
              </div>
              <div class="summary-row">
                <span>Status:</span> 
                <span class="order-status" style="text-transform: capitalize;">{{ booking.status }}</span>
              </div>
              
              <div class="summary-row" v-if="booking.paymentType =='gcash'">
                <span>Proof of payment:</span> 
                <span class="order-status" style="text-transform: capitalize; background: #000;">{{ booking.payments ? 'Uploaded' : 'Not Uploaded' }}</span>
              </div>
            </div>
              <ion-button v-if="booking.paymentType =='gcash' && booking.status == 'pending'"
                expand="full"
                fill="solid"
                color="primary"
                shape="round"
                class="show-items-btn"
                style="color: #000;"
                @click="openUploadModal(booking)"
              >
                {{booking.payments ? 'Update Proof of Payment' : 'Upload Proof of Payment'}}
              </ion-button>
              <ion-button
                expand="full"
                fill="solid"
                color="dark"
                shape="round"
                class="show-items-btn"
                @click="openItemsModal(booking)"
              >
                Show All Items
              </ion-button>
              <ion-button v-if="booking.status == 'pending'"
                expand="full"
                fill="solid"
                color="danger"
                shape="round"
                class="show-items-btn"
                @click="handleCancelOrder(booking.id)"
              >
                Cancel Order
              </ion-button>
          </ion-label>
          <ion-input ref="fileInput" type="file" style="display: none;" />
        </ion-item>

        <ion-item v-if="!Object.keys(orders).length">
          <ion-label>No pending orders found.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

    <!-- Loading State -->
    <ion-content v-if="loading">
      <div style="display: flex; align-items: center; justify-content: center; margin-top: 20px; color: #888;">
        <ion-spinner name="crescent" slot="start"></ion-spinner>
        loading...
      </div>
    </ion-content>

    <!-- Items Modal -->
    <ion-modal :is-open="showModal" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Order Items</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding item-details-wrapper">
        <ion-list>
          <ion-item v-for="(item, idx) in selectedBooking" :key="idx" class="item-card">
            <!-- Car Image -->
            <ion-thumbnail slot="start">
              <img :src="item.item.images[0].image_url || '/default-car.png'" alt="Car Image" class="item-image" />
            </ion-thumbnail>

            <!-- Car Details -->
            <ion-label>
              <h2 class="item-name">{{ item.item.name }}</h2>
              <p class="item-price">Qty Ordered : {{ item.quantity }}</p>
              <p class="item-price">₱{{ priceAddComma(item.item.price_per_day) }} / day</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
    <ion-modal :is-open="showUploadModal" @didDismiss="closeUploadModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Upload Proof of Payment</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeUploadModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div style="text-align: center; margin-top: 20px;">
          <input
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            style="margin-bottom: 20px;"
          />

          <div v-if="previewImage" style="margin-bottom: 20px;">
            <img :src="previewImage" class="img-preview" alt="Preview" style="max-width: 100%; border-radius: 8px;" />
          </div>

          <ion-button expand="block" color="primary" shape="round" @click="savePaymentProof" :disabled="!selectedFile">
            Save
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
    <ion-loading :is-open="loading_items" message="Please wait..."></ion-loading>
    <ion-toast :is-open="showProofToast" message="Proof of payment uploaded successfully!" position="top" duration="2000" color="success" style="color: #fff;"></ion-toast>
  </ion-page>
</template>

<script>
import { alertController } from '@ionic/vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { arrowBackOutline } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonModal,
  IonLoading,
  IonToolbar,
  IonInput,
  IonToast,
  IonThumbnail,
  IonButtons
} from "@ionic/vue";

export default {
  name: "PendingOrders",
  components: {
    IonPage,
    IonHeader,
    IonToast,
    IonInput,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonButton,
    IonModal,
    IonToolbar,
    IonLoading,
    IonThumbnail,
    IonButtons
  },
  data() {
    return {
      loading: true,
      selectedTab: 'pending',
      selectedFile: null,
      previewImage: null,
      selectedBookingId: null,
      showUploadModal: false,
      selectedFileBase64: null,
      showProofToast: false,
      arrowBackIcon: arrowBackOutline,
      orders: [],
      showModal: false,
      loading_items: false,
      selectedBooking: []
    };
  },
  ionViewWillEnter() {
    this.loading = true;
    this.handleGetPending();
  },
  methods: {
    handleFilterOrders(status) {
      this.handleGetPending(status)
    },
    handleCancelOrder(bookingId) {
      alertController.create({
        header: 'Confirm Cancellation',
        message: 'Are you sure you want to cancel this order?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: async () => {
              try {
                this.loading_items = true;
                await this.axios.put('/order/cancel-order/' + bookingId);
                this.handleGetPending(this.selectedTab); // Refresh orders
              } catch (error) {
                console.error('Error cancelling order:', error);
              } finally {
                this.loading_items = false;
              }
            }
          }
        ]
      }).then(alert => alert.present());
    },
    openUploadModal(booking) {
      this.selectedBookingId = booking.id;
      this.showUploadModal = true;
      if(booking.payments) {
        this.previewImage = booking.payments.proof_of_payment_url;
      }
    },
    closeUploadModal() {
      this.showUploadModal = false;
      this.selectedFile = null;
      this.previewImage = null;
    },
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        this.selectedFile = file;

        // Preview
        this.previewImage = URL.createObjectURL(file);

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          this.selectedFileBase64 = event.target.result; // <-- base64 string
        };
        reader.readAsDataURL(file);
      }
    },
    async savePaymentProof() {
      if (!this.selectedFile) return;

      try {
        this.loading_items = true;
        await this.axios.post(`/booking/upload-proof-of-payment`, {
          booking_id: this.selectedBookingId,
          payment_proof: this.selectedFileBase64
        }, {
          headers: { "Content-Type": "multipart/form-data" }
        });
       
        this.showProofToast = true;
        this.closeUploadModal();
        this.handleGetPending(); // refresh orders
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_items = false;
      }
    },
    priceAddComma(price) {
      const total_price = parseInt(price);
      return total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    handleGetPending(status = 'pending') {
      this.loading_items = true;
      this.axios.get('/order/get-pending?status=' + status).then((res) => {
        if(res.data.data?.length) {
          this.orders = res.data.data.map((item) => {
            return {
              id: item.id,
              total_price: item.total_price,
              pickupDate: item.start_date,
              returnDate: item.end_date,
              paymentType: item.payment_type ? item.payment_type : 'Cash on Delivery',
              status: item.status ? item.status : 'Pending',
              delivery_type: item.delivery_option ? item.delivery_option : 'Pickup',
              items: item.items || [], // include items array
              payments: item.payments ? item.payments : false // include payments array
            }
          });
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading = false;
        this.loading_items = false;
      });
    },
    handleBack() {
      this.$router.back();
    },
    openItemsModal(booking) {
      this.showModal = true;
      this.loading_items = true;
      this.axios.get(`/order/get-booking-details/${booking.id}`).then((res) => {
        if(res.data.data?.length) {
          this.selectedBooking = res.data.data;
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading_items = false;
      });
    },
    closeModal() {
      this.showModal = false;
      this.selectedBooking = [];
    },
    rentalDays(booking) {
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
};
</script>

<style scoped>
.img-preview{
    max-width: 100%;
    border-radius: 8px;
    border: solid 1px #000;
    padding: 5px;
}
ion-content.item-details-wrapper{
  --background: #f3f3f3;
}
.pending-orders-content {
  --background: #f5f5f5;
}

.booking-card {
  background: #fff;
  border-radius: 14px;
  margin: 10px 0;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.order-summary {
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 15px;
}

.highlight {
  font-weight: 600;
  color: #000;
}

.payment-badge {
  background-color: #f0f3ff;
  color: #2c7be5;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
}
.order-status {
  background-color: red;
  color: #fff;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.order-delivery {
  background-color: #d4edda;
  color: #155724;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.show-items-btn {
  margin-top: 8px;
  font-weight: 500;
}
.item-image{
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
</style>
