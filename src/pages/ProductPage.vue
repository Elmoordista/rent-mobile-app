<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Car Details</ion-title>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col size="12">
            <ion-card class="list-card-item" @click="handleClickItem(items)">
              <!-- Swiper Slider -->
              <div class="image-container">
                <swiper
                  :slides-per-view="1"
                  :loop="true"
                  pagination
                  navigation
                  class="mySwiper"
                >
                  <swiper-slide v-for="(img, index) in items.images" :key="index">
                    <img :src="img" alt="Car Image" class="img" />
                  </swiper-slide>
                </swiper>
              </div>

              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">{{ items.name }}</span>
                  <span class="item-description">
                    The Toyota Wigo offers reliability and efficiency — perfect for city driving and road trips.
                  </span>

                  <div class="item-meta">
                    <div class="item-rating">
                      <ion-icon :icon="starIcon" class="star-icon" />
                      <span class="rating-value">5.0</span>
                    </div>

                    <span class="item-price">₱{{ items.price }}/day</span>
                  </div>
                </div>

                <ion-button color="dark" shape="round" expand="block" class="book-button" @click="handleClickItem(items)">
                  Book Now
                  <ion-icon :icon="arrowIcon" slot="end" />
                </ion-button>
              </div>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { star, arrowForward, arrowBack } from 'ionicons/icons'
import { IonPage, IonHeader, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton } from '@ionic/vue'

// Import Swiper Vue.js components and modules


export default {
  name: 'ProductPage',
  components: {
    IonPage,
    IonHeader,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonButton,
  },
  data() {
    return {
      starIcon: star,
      arrowIcon: arrowForward,
      arrowBackIcon: arrowBack,
      items: {
        name: 'Toyota Wigo',
        price: 5000,
        images: [
          'https://purepng.com/public/uploads/large/purepng.com-toyota-land-cruiser-white-carcarvehicletransporttoyota-961524668359oxuc6.png',
        ]
      }
    }
  },
  methods: {
    handleBack() {
      this.$router.push('/cars');
    },
    handleClickItem(item) {
      this.$router.push('/page-indicator')
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}

.list-card-item {
  margin: 10px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
  cursor: pointer;
}

.list-card-item:hover {
  transform: translateY(-4px);
}

.image-container {
  background-color: #f9f9f9;
  padding: 0;
}

/* Swiper styles */
.mySwiper {
  width: 100%;
  height: 220px;
}

.mySwiper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 20px;
  font-weight: 600;
  color: #222;
}

.item-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f39c12;
}

.star-icon {
  font-size: 18px;
}

.rating-value {
  font-size: 14px;
  color: #444;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.book-button {
  margin-top: 8px;
}
</style>
