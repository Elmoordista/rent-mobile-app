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
                    <span class="rating-value" style="color: #000;">{{items?.reviews_avg_rating ? `${parseInt(items?.reviews_avg_rating)}.0` : 0}}</span>
                </div>
                <span>Reviews ({{items?.reviews_count ? parseInt(items?.reviews_count) : 0}})</span>
            </div>
            <div class="search-wrapper" style="position: relative; display: flex; align-items: center;">

                <ion-input
                  v-model="searchQuery"
                  placeholder="Search Comment"
                  clear-input
                  @ionClear="handleClear"
                  @change="handleSearch"
                  style="--padding-start: 20px; width: 100%; --background: #fff; border-radius: 20px;"
                ></ion-input>

                <!-- Clear X (optional if you want custom button) -->
                <!-- <ion-button
                  v-if="searchQuery"
                  fill="clear"
                  size="small"
                  @click="alert('xx')"
                  style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%);"
                >
                  <ion-icon :icon="closeIcon" />
                </ion-button> -->
              </div>

            <div class="reviews-container" v-if="reviews.length">
                <ion-card v-for="(review, index) in reviews" :key="index"  class="list-card-item" style="padding: 10px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                         <div style="display: flex; align-items: center; gap: 5px;">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6th-oTbkDMbDOPGU_kkRMM55lfvRYgM8JA&s" alt="Avatar" class="avatar" height="20" style="border-radius: 50px;" />
                            <span style="color: #000;">{{ review.author }}</span>
                        </div>
                       <span>{{ handleGetTimeDiff(review.created_at)}}</span>
                    </div>
                    <div class="item-rating">
                        <ion-icon v-for="n in review.rating" :key="n" :icon="starIcon" class="star-icon" />
                    </div>
                    <p>{{ review.comment }}</p>
                </ion-card>
            </div>
            <div v-if="!reviews.length" style="text-align: center; color: #666; margin-top: 20px;">
                No reviews available.
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { star, arrowForward, arrowBack, cart, search, close, alert } from 'ionicons/icons'
import { IonPage, IonLoading, IonHeader, IonTitle, IonButton, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon } from '@ionic/vue'
import 'vue3-carousel/carousel.css'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import moment from 'moment'
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
      searchIcon: search,
      closeIcon: close,
      searchQuery: '',
      reviews: [],
      items: null,
    }
  },
  mounted(){
    this.handleGetItem();
  },
  methods: {
    handleGetTimeDiff(time) {
      return moment(time).fromNow();
    },
    handleInput(event) {
      console.log(event, 'input event');
      if (this.searchQuery === '') {
        alert('cleared');
        // Handle clear logic here
      } 
    },
    handleClear() {
      this.searchQuery = '';
      this.handleGetItem();
    },
    handleSearch(event) {
      this.searchQuery = event.target.value;
      this.handleGetItem();
    },
    handleGetItem() {
      this.loading_item = true;
      this.axios.get(`/items/get-reviews/${this.$route.params.id}?search=${this.searchQuery}`).then((res) => {
        if(res.data.data) {
          this.items = res.data.item;
          this.reviews = res.data.data.map((review)=>{
            return {
              created_at: review.created_at,
              comment: review.comment,
              author: review.user.full_name,
              rating: review.rating
            };
          });
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
  },
}
</script>

<style scoped>
.search-icon {
  position: absolute;
  left: 8px;
  font-size: 20px;
  color: #999;
}
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