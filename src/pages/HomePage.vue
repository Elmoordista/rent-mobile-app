<template>
  <ion-page>
    <!-- <ion-header class="ion-no-border ion-padding ion-text-center header" >
      <ion-title>Home Page</ion-title>
    </ion-header> -->
    <ion-content :fullscreen="true">
      <!-- <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content
          pulling-text="Pull to refresh"
          refreshing-text="Refreshing..."
        />
      </ion-refresher> -->
      <div class="list-wrapper">

        <!-- Search Bar -->
        <div class="search-container" style="display: flex; align-items: center; gap: 10px;">
          <ion-searchbar
            v-model="searchText"
            class="ion-no-padding"
            placeholder="Search"
            shape="round"
            @change="handleSearchChange"
            debounce="250"
          ></ion-searchbar>
          <div class="icon-with-badge" @click="handleOpenCart">
            <ion-icon :icon="cartIcon" size="large" />
            <ion-badge color="danger" v-if="cartCount > 0">{{ cartCount }}</ion-badge>
          </div>
        </div>

        <!-- Categories -->
        <div class="categories-wrapper">
          <ion-segment value="all" scrollable class="category-segment" v-model="categorySelected">
            <ion-segment-button v-for="category in categories" :key="category.id" :value="category.id" @click="handleFetchItemsByCategory(category.id)">
              <small>{{ category.text }}</small>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Scrollable Grid of Items -->
        <div class="items-scrollable">
          <ion-loading :is-open="loading_item" message="Please wait..." />
          <ion-grid v-if="items.length > 0">
            <ion-row>
              <ion-col size="6" v-for="(item, index) in items" :key="index">
                <ion-card class="list-card-item" @click="handleClickItem(item)">
                  <div class="image-container">
                    <img :src="item.image" alt="item image" class="img" />
                  </div>
                  <hr style="background-color: #f5f5f5; margin: 0;"/>
                  <div class="item-details">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span class="item-name">{{ item.name }}</span>
                      <ion-icon v-if="item.is_favorite" :icon="heartOutlineIcon" size="small" style="color: red;"/>
                    </div>
                    <div class="item-rating">
                      <span>{{ item.reviews_avg_rating ? parseInt(item.reviews_avg_rating) : 0 }}</span>
                      <ion-icon :icon="starIcon" class="star-icon" />
                    </div>
                    <div class="price-book">
                      <span class="item-price">Available : {{ item.available_quantity}}</span>
                      <span class="item-price">₱ {{ item.price }}/day</span>
                      <!-- <ion-button size="small" color="primary" shape="round" fill="outline">
                        Book
                      </ion-button> -->
                    </div>
                  </div>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
           <div v-if="items.length === 0">
              <!-- Display when no items found -->
              <ion-card>
                <ion-card-header>
                  <ion-card-title>No items found</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-text color="medium">Sorry, we couldn't find any items to display.</ion-text>
                </ion-card-content>
              </ion-card>
            </div>
        </div>

      </div>
    </ion-content>

  </ion-page>
</template>

<script>
import { star, cart, heart } from 'ionicons/icons'
import { alertController,  } from '@ionic/vue'

import { IonPage, IonRefresherContent, IonBadge, IonHeader, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton, IonLoading  } from '@ionic/vue';
export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonBadge,
    IonRefresherContent,
    IonTitle,
    IonLoading,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonButton
  },
  data() {
    return {
      // user: this.$store.getters.getUser,
      starIcon: star,
      cartIcon: cart,
      heartOutlineIcon: heart,
      loading_item: false,
      searchText: '',
      categories: [{
        id: 0,
        text: 'All'
      },],
      categorySelected: 0,
      items: []
    }
  },
  mounted(){
    this.handleGetCatoregories();
    this.handleGetItems();
    //clear booking details and item to rent
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    cartCount() {
      return this.$store.getters.getCart.length;
    }
  },
  
  methods: {
    doRefresh(event) {
      alert('Refreshing data...');
    },
    async confirmation() {
      const alert = await alertController.create({
        header: 'Are you sure?',
        message: 'This action cannot be undone.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('User canceled')
            }
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              console.log('User confirmed delete')
              // Perform delete action here
            }
          }
        ]
      })

      await alert.present()
    },
    handleOpenCart() {
      this.$router.push('/cart');
    },
    handleFetchItemsByCategory(categoryId) {
      this.categorySelected = categoryId;
      this.handleGetItems();
    },
    handleSearchChange() {
      this.handleGetItems();
    },
    handleClickItem(item) {
      this.$router.push(`/product/${item.id}`);
    },
    handleGetItems () {
      this.loading_item = true;
      this.axios.get(`/items/get-items/${this.categorySelected}?search=${this.searchText}`).then((res)=>{
          if(res.status){
            const allItems = res.data.data.map((item)=>{
              var current_image = '';
              if(item.has_sizes_color_options){
                current_image = item.variations[0].image_url;
              }
              else{
                current_image = item.images[0]?.image_url || 'https://via.placeholder.com/150'
              }
              return {
                id:item.id,
                reviews_avg_rating : item.reviews_avg_rating,
                is_favorite: item.is_favorite,
                name:item.name,
                price:item.price_per_day,
                available_quantity: item.available_quantity,
                image:current_image
              }
            });
            console.log(allItems,'allItems')
            this.items = [...allItems];
          }
          
      }).catch((error)=>{
          console.log(error,'error')
      }).finally(()=>{
          this.loading_item = false;
      })
    },
    handleGetCatoregories () {
      this.loading_item = true;
      this.axios.get(`/category?all=true`).then((res)=>{
          if(res.status){
            const allCategories = res.data.data.map((item)=>{
              return {
                id:item.id,
                text:item.name
              }
            });
            this.categories = [...this.categories, ...allCategories];
          }
      }).catch((error)=>{
          console.log(error,'error')
      }).finally(()=>{
          this.loading_item = false;
      })
    }
  },

  watch: {
    'searchText'(newValue) {
      if(!newValue){
        this.handleGetItems();
      }
    },
    'user'(newValue) {
      console.log(newValue,'user')
    }
  },
}
</script>

<style scoped>

ion-searchbar {
  --box-shadow: none;
  --background: #f5f5f5; /* optional: custom bg */
  --border-radius: 12px; /* optional */
  box-shadow: none !important;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.items-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 2px;
  margin-bottom: 55px;
}

.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}
.search-container {
  padding: 10px;
}

.categories-wrapper {
  padding: 0 10px;
  overflow-x: auto;
}

.category-segment {
  --background: #f4f4f4;
  --indicator-color: #3880ff;
  white-space: nowrap;
}

ion-segment-button {
  padding: 6px 10px;
}

.list-card-item {
  margin: 0;
  border: solid 1px #dbd7d7;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.list-card-item:hover {
  transform: translateY(-3px);
}

.image-container {
  height: 100px; /* or any height you prefer */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-height: 100%;
  width: auto;
  object-fit: cover;
}

.item-details {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.star-icon {
  color: orange;
  font-size: 14px;
}

.price-book {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.item-price {
  font-size: 13px;
  font-weight: 500;
  color: #000;
}

.icon-with-badge {
  position: relative;
  display: inline-block;
}

ion-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  font-size: 10px;
  padding: 3px 6px;
  border-radius: 50%;
}

</style>
