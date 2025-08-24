<template>
  <ion-page class="review-page">
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Reviews</ion-title>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col size="12" style="padding: 10px;">
            <ion-loading :is-open="loading_item" message="Please wait..." />
            <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
                <div class="item-rating">
                    <ion-icon :icon="starIcon" class="star-icon" />
                    <span class="rating-value" style="color: #000;">5.0</span>
                </div>
                <span>Reviews (155)</span>
            </div>
            <ion-searchbar
                class="ion-no-padding"
                placeholder="Search"
                shape="round"
                debounce="250"
                style="--background: #fff; --placeholder-color: #000"
            ></ion-searchbar>
            <div class="reviews-container" >
                <ion-card v-for="(review, index) in reviews" :key="index"  class="list-card-item" style="padding: 10px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                         <div style="display: flex; align-items: center; gap: 5px;">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6th-oTbkDMbDOPGU_kkRMM55lfvRYgM8JA&s" alt="Avatar" class="avatar" height="20" style="border-radius: 50px;" />
                            <span style="color: #000;">{{ review.author }}</span>
                        </div>
                       <span>Yesterday</span>
                    </div>
                    <div class="item-rating">
                        <ion-icon :icon="starIcon" class="star-icon" />
                        <ion-icon :icon="starIcon" class="star-icon" />
                        <ion-icon :icon="starIcon" class="star-icon" />
                        <ion-icon :icon="starIcon" class="star-icon" />
                        <ion-icon :icon="starIcon" class="star-icon" />
                    </div>
                    <p>{{ review.comment }}</p>
                </ion-card>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { star, arrowForward, arrowBack, cart } from 'ionicons/icons'
import { IonPage, IonLoading, IonHeader, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton } from '@ionic/vue'
import 'vue3-carousel/carousel.css'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'ProductPage',
  components: {
    IonPage,
    IonLoading,
    IonHeader,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonButton,
    Carousel,
    Pagination,
    Navigation,
    Slide
  },
  data() {
    return {
      loading_item: false,
      starIcon: star,
      arrowIcon: arrowForward,
      arrowBackIcon: arrowBack,
      cartIcon: cart,
      reviews: [
          { comment: 'Great car for city driving!', author: 'John Doe', rating: 5 },
          { comment: 'Very comfortable and fuel-efficient.', author: 'Jane Smith', rating: 4.5 },
          { comment: 'Loved the ride quality!', author: 'Alice Johnson', rating: 5 },
            { comment: 'Great car for city driving!', author: 'John Doe', rating: 5 },
          { comment: 'Very comfortable and fuel-efficient.', author: 'Jane Smith', rating: 4.5 },
          { comment: 'Loved the ride quality!', author: 'Alice Johnson', rating: 5 }
      ],
      items: {
        name: 'Toyota Wigo',
        price_per_day: 5000,
        images: [
          { image_url: 'https://purepng.com/public/uploads/large/purepng.com-toyota-land-cruiser-white-carcarvehicletransporttoyota-961524668359oxuc6.png' },
          { image_url: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-Transparent-File.png' },
          { image_url: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-Transparent-File.png' },
        ]
      }
    }
  },
  mounted(){
    // this.handleGetItem();
  },
  methods: {
    handleGetItem() {
      this.loading_item = true;
      this.axios.get(`/items/${this.$route.params.id}`).then((res) => {
        if(res.data.status) {
          this.items = res.data.data;
        this.loading_item = false;

        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading_item = false;
      })
    },
    handleBack() {
      this.$router.back();
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
  background-color: #f9f9f9;
}
.item-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f39c12;
}
.reviews-container{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}
.list-card-item{
    background-color: #fff !important;
    margin: 0 !important;
    padding: 10px;
    border-radius: 10px;
    box-shadow: none;
    border: solid 2px #f5f5f5;
}
ion-searchbar {
  --box-shadow: none;
  --background: #f5f5f5; /* optional: custom bg */
  --border-radius: 12px; /* optional */
  box-shadow: none !important;
}
</style>

<style >

.review-page{
    --ion-background-color: #f9f9f9;
}
</style>