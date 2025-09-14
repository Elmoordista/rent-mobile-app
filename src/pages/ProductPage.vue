<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Item Details</ion-title>
      <div class="icon-with-badge" @click="handleOpenCart">
        <ion-icon :icon="cartIcon" size="large" />
        <ion-badge color="danger" v-if="cartCount.length > 0">{{ cartCount.length }}</ion-badge>
      </div>
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
                  <Slide v-for="(img, index) in handleGetImages()" :key="index">
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
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span class="item-name">{{ items.name }}</span>
                    <ion-icon style="color: red; font-size:25px;"  :icon="items.is_favorite ? heartIcon : heartOutlineIcon" @click="toggleFavorite" />
                  </div>
                  <span class="item-description">
                    {{items.description || 'No description available.'}}
                  </span>

                  <div class="item-meta" style="margin-top: 10px;">
                    <div class="item-rating">
                      <ion-icon :icon="starIcon" class="star-icon" />
                      <span class="rating-value">{{items.reviews_avg_rating ? items.reviews_avg_rating : '0'}}</span>
                    </div>

                    <span class="item-price">₱{{ items.price_per_day }}/day</span>
                  </div>
                  <ion-item-divider></ion-item-divider>
                  <div class="item-meta" style="margin-top: 5px;">
                    <span class="item-price">Available : {{ available}}</span>
                  </div>
                  <div  v-if="items.has_sizes_color_options" class="item-variations">
                      <!-- Size Select -->
                      <div class="option-group">
                        <span class="option-label" style="color: #000; white-space: nowrap;">Size : </span>
                        <ion-select
                          interface="popover"
                          placeholder="Select Size"
                          class="custom-select"
                          @ionChange="handleCheckAvailability"
                          v-model="selectedSize"
                        >
                          <ion-select-option
                            v-for="(variation, index) in items.variations"
                            :key="'size-' + index"
                            :value="variation.size"
                          >
                            {{ variation.size }}
                          </ion-select-option>
                        </ion-select>
                      </div>

                      <!-- Color Select -->
                      <div class="option-group">
                        <span class="option-label" style="color: #000; white-space: nowrap;">Color : </span>
                        <ion-select
                          interface="popover"
                          placeholder="Select Color"
                          class="custom-select"
                          @ionChange="handleCheckAvailability"
                          v-model="selectedColor"
                        >
                          <ion-select-option
                            v-for="(variation, index) in items.variations"
                            :key="'color-' + index"
                            :value="variation.color"
                          >
                            <span class="color-box" :style="{ backgroundColor: variation.color }"></span>
                            {{ variation.color }}
                          </ion-select-option>
                        </ion-select>
                      </div>
                    </div>
                </div>
              </div>
              <div class="quantity-wrapper">
                <ion-button fill="outline"  color="dark" size="small" @click="decreaseQuantity">
                  <span>-</span>
                </ion-button>
                <span class="quantity">{{ quantity }}</span>
                <ion-button fill="outline" color="dark" size="small" @click="increaseQuantity">
                  <span>+</span>
                </ion-button>
              </div>
              <div class="item-details review-wrapper" style="margin-top: 10px;">
                <div class="item-info">
                 <div style="display: flex; justify-content: space-between;">
                  <span style="color: #000; font-weight: bold;">Reviews ({{items.reviews_count||0}})</span>
                  <span style="color: #007bff; font-weight: bold;" @click="handleShowReviews">See all</span>
                 </div>
                 <div class="carousel-wrapper">
                   <Carousel
                    
                     :items-to-show="1"
                     :loop="false"
                     :snap-align="'start'"
                     class="myCarousel"
                     v-if="items.reviews && items.reviews.length > 0"
                    >
                      <Slide v-for="(review, index) in items.reviews" :key="index">
                        <div class="review-item">
                          <div style="display: flex; justify-content: space-between;">
                            <!-- avatar -->
                             <div style="display: flex; align-items: center; gap: 5px;">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6th-oTbkDMbDOPGU_kkRMM55lfvRYgM8JA&s" alt="Avatar" class="avatar" height="20" style="border-radius: 50px;" />
                                <span style="color: #000;">{{ review.user.full_name }}</span>
                             </div>
                            <div class="item-rating">
                              <ion-icon :icon="starIcon" class="star-icon" />
                              <span class="rating-value" style="color: #000;">{{review.rating}}.0</span>
                            </div>
                          </div>
                          <p>{{ review.comment }}</p>
                        </div>
                      </Slide>
                    </Carousel>
                    <div v-if="!items.reviews || items.reviews.length === 0" style="text-align: center; color: #666; margin-top: 10px; padding: 10px; border: 1px solid #eee; border-radius: 10px;">
                      No reviews available.
                    </div>
                  </div>
                </div>
              </div>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-toast
      :is-open="showToast"
      :message="message"
      duration="2000"
      color="success"
      position="top"
      style="color: #fff;"
      @didDismiss="showToast = false"
    />  

    <ion-footer class="ion-no-border" 
      style="display: flex; gap: 5px; justify-content: space-around; padding:5px; padding-bottom: 20px;"
    >
      <!-- Add to Cart -->
      <ion-button v-if="!items.need_driver_license"
        color="dark" 
        shape="round" 
        expand="block" 
        class="book-button" 
        :disabled="submitLoading || available === 0" 
        @click="handleAddToCart(items)"
      >
        <template v-if="submitLoading">
          <ion-spinner name="crescent" slot="start"></ion-spinner>
          loading...
        </template>
        <template v-else>
          <ion-icon :icon="cartIcon" slot="start" />
          Add to cart
        </template>
      </ion-button>

      <!-- Book Now -->
      <ion-button 
        color="dark" 
        shape="round" 
        expand="block" 
        class="book-button" 
        :disabled="submitLoading || available === 0" 
        @click="handleClickItem(items)"
      >
        <template v-if="submitLoading">
          <ion-spinner name="crescent" slot="start"></ion-spinner>
          loading...
        </template>
        <template v-else>
          Book Now
          <ion-icon :icon="arrowIcon" slot="end" />
        </template>
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script>
import { star, arrowForward, arrowBack, cart, heart, heartOutline } from 'ionicons/icons'
import { IonPage, IonFooter, IonSpinner, IonToast, IonLoading, IonHeader, IonTitle, IonSelect, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton } from '@ionic/vue'
import 'vue3-carousel/carousel.css'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'ProductPage',
  components: {
    IonPage,
    IonLoading,
    IonSpinner,
    IonToast,
    IonSelect,
    IonHeader,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonButton,
    IonFooter,
    Carousel,
    Pagination,
    Navigation,
    Slide
  },
  data() {
    return {
      loading_item: false,
      starIcon: star,
      heartOutlineIcon: heartOutline,
      heartIcon: heart,
      quantity: 1,
      selectedSize: null,
      selectedColor: null,
      available: 0,
      submitLoading: false,
      arrowIcon: arrowForward,
      arrowBackIcon: arrowBack,
      showToast: false,
      message: 'Added to cart, Successfully!',
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
  computed: {
    // Access the cart from Vuex store
    cartCount() {
      return this.$store.getters.getCart;
    }
  },
  mounted(){
    this.handleGetItem();
  },
  methods: {
    handleCheckAvailability() {
      if (this.selectedSize && this.selectedColor) {
        const variation = this.items.variations.find(v =>
          v.size.toLowerCase() === this.selectedSize.toLowerCase() &&
          v.color.toLowerCase() === this.selectedColor.toLowerCase()
        );
        if (variation) {
          this.available = variation.quantity;
        } else {
          this.available = 0; // No matching variation found
        }
      } else {
        this.available = this.items.available_quantity; // Default available quantity
      }
    },
    handleGetImages() {

      if (this.items && this.items.images && this.items.images.length > 0 && !this.items.has_sizes_color_options) {
        return this.items.images;
      } else {
        if(this.items.variations){
            return this.items.variations.map((item)=>{
              return {
                image_url: item.image_url || 'https://via.placeholder.com/150'
              }
            })
        }
      }
    },
    handleOpenCart() {
      this.$router.push('/cart');
    },
    increaseQuantity() {
      this.quantity++
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--
    },
    handleShowReviews() {
      this.$router.push(`/reviews/${this.$route.params.id}`);
    },
    toggleFavorite() {
      // Toggle the favorite status
      this.items.is_favorite = !this.items.is_favorite;
      this.axios.post(`/item/add-to-favorite`, { ...this.items }).then(() => {
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.submitLoading = false;
      })
    },
    handleAddToCart(items) {
      if(this.available < this.quantity){
        alert('Selected quantity exceeds available stock.');
        return;
      }
      this.submitLoading = true;
      var variation_id = null;

      if(this.items.has_sizes_color_options && this.selectedSize && this.selectedColor){
        const item_variation_selected = this.items.variations.find(v =>
          v.size.toLowerCase() === this.selectedSize.toLowerCase() &&
          v.color.toLowerCase() === this.selectedColor.toLowerCase()
        );
        if(item_variation_selected){
          variation_id = item_variation_selected.id;
        }
      }
      this.axios.post(`/cart`, { ...items, quantity:this.quantity, variation_id : variation_id }).then((res) => {
        if(res.data.success) {
          this.showToast = true;
          this.message = 'Added to cart, Successfully!';
          this.$store.dispatch('getCart'); // Refresh cart in Vuex store
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.submitLoading = false;
      })
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
      if(this.available < this.quantity){
        alert('Selected quantity exceeds available stock.');
        return;
      }
      // this.$router.push('/page-indicator')
      var variation_id = null;
      if(item.has_sizes_color_options && this.selectedSize && this.selectedColor){
        variation_id = item.variations.find(v =>
          v.size.toLowerCase() === this.selectedSize.toLowerCase() &&
          v.color.toLowerCase() === this.selectedColor.toLowerCase()
        )?.id;
      }
      const item_to_rent = {
        item_id: item.id,
        name: item.name,
        pricePerDay: item.price_per_day,
        qty: this.quantity,
        need_driver_license: item.need_driver_license,
        image: item.images[0]?.image_url || '',
        variation: variation_id,
        variation_id: item.variation_id,
      }
      // // Store selected items in Vuex store
      this.$store.commit('setItemToRent', item_to_rent);
      setTimeout(() => {
        this.$router.push('/page-indicator');
      }, 200);
    }
  },
  watch: {
    // Watch for changes in cart and update the cart count
    items(newVal) {
      //selected default size and color and available quantity
      if(newVal.variations && newVal.variations.length > 0){
        this.selectedSize = newVal.variations[0].size;
        this.selectedColor = newVal.variations[0].color;
        this.available = newVal.variations[0].quantity;
      }
      else{
        this.available = newVal.available_quantity;
      }
    }
  }
}
</script>

<style scoped>
.item-variations{
  display: flex;
  justify-content: space-between;
}
.option-group{
  align-items: center;
  display: flex;
  gap: 12px;
  width: 50%;
}
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
  width: 100%;
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
.quantity-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.quantity-wrapper span{
  font-size: 16px;
  font-weight: bold;
  color: #000;
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
