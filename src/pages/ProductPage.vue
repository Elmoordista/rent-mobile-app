<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Item Details</ion-title>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col size="12">
            <ion-loading :is-open="loading_item" message="Please wait..." />
            <ion-card v-if="!loading_item" class="list-card-item" >
              <!-- Swiper Slider -->
              <div class="image-container">
                <!-- <swiper
                  :slides-per-view="1"
                  :loop="true"
                  pagination
                  navigation
                  class="mySwiper"
                >
                  <swiper-slide v-for="(img, index) in items.images" :key="index">
                    <img :src="img.image_url" alt="Car Image" class="img" />
                  </swiper-slide>
                </swiper> -->
               <Carousel 
                  :per-page="1" 
                  :loop="true" 
                  :navigation-enabled="false"
                  class="mySwiper" 
                  style="height: 220px;"
                >
                  <Slide v-for="(img, index) in items.images" :key="index">
                    <img :src="img.image_url" alt="Car Image" class="img" />
                  </Slide>
                  <template #addons v-if="items.images.length > 1">
                    <Navigation />
                    <Pagination />
                  </template>
                </Carousel>
              </div>

              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">{{ items.name }}</span>
                  <span class="item-description">
                    The Toyota Wigo offers reliability and efficiency — perfect for city driving and road trips.
                  </span>

                  <div class="item-meta" style="margin-top: 10px;">
                    <div class="item-rating">
                      <ion-icon :icon="starIcon" class="star-icon" />
                      <span class="rating-value">5.0</span>
                    </div>

                    <span class="item-price">₱{{ items.price_per_day }}/day</span>
                  </div>
                </div>
              </div>
              <div class="item-details review-wrapper" style="margin-top: 10px;">
                <div class="item-info">
                 <div style="display: flex; justify-content: space-between;">
                  <span style="color: #000; font-weight: bold;">Reviews (155)</span>
                  <span style="color: #007bff; font-weight: bold;" @click="handleShowReviews">See all</span>
                 </div>
                 <div class="carousel-wrapper">
                   <Carousel
                     :items-to-show="1"
                     :wrap-around="true"
                     :snap-align="'start'"
                     class="myCarousel"
                    >
                      <Slide v-for="(review, index) in reviews" :key="index">
                        <div class="review-item">
                          <div style="display: flex; justify-content: space-between;">
                            <!-- avatar -->
                             <div style="display: flex; align-items: center; gap: 5px;">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6th-oTbkDMbDOPGU_kkRMM55lfvRYgM8JA&s" alt="Avatar" class="avatar" height="20" style="border-radius: 50px;" />
                                <span style="color: #000;">{{ review.author }}</span>
                             </div>
                            <div class="item-rating">
                              <ion-icon :icon="starIcon" class="star-icon" />
                              <span class="rating-value" style="color: #000;">5.0</span>
                            </div>
                          </div>
                          <p>{{ review.comment }}</p>
                        </div>
                      </Slide>
                    </Carousel>
                  </div>
                </div>
              </div>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-footer class="ion-no-border" style="display: flex; gap: 5px; justify-content: space-around;">
        <ion-button color="dark" shape="round" expand="block" class="book-button" @click="handleClickItem(items)" style="display: flex; align-items: center;">
          <ion-icon :icon="cartIcon" slot="start" />
          Add to cart
        </ion-button>
        <ion-button color="dark" shape="round" expand="block" class="book-button" @click="handleClickItem(items)">
          Book Now
          <ion-icon :icon="arrowIcon" slot="end" />
        </ion-button>
    </ion-footer>
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
    this.handleGetItem();
  },
  methods: {
    handleShowReviews() {
      this.$router.push(`/reviews/${this.$route.params.id}`);
    },
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

.mySwiper .carousel__arrow {
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

.mySwiper .carousel__dots {
  bottom: 10px;
}
.review-item{
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}
</style>
<style>
.carousel-review .carousel__viewport{
  height: 100px !important;
}
.carousel-review .carousel__viewport ol{
  gap: 10px;
}

.carousel-wrapper .carousel {
  padding-right: 20px; /* add space to show peek of next slide */
}

.review-item {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

</style>
