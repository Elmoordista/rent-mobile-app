<template>
  <ion-page>
    <!-- <ion-header class="ion-no-border ion-padding ion-text-center header" >
      <ion-title>Home Page</ion-title>
    </ion-header> -->
    <ion-content :fullscreen="true">
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
                    <span class="item-name">{{ item.name }}</span>
                    <div class="item-rating">
                      <span>5.0</span>
                      <ion-icon :icon="starIcon" class="star-icon" />
                    </div>
                    <div class="price-book">
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
import { star, cart } from 'ionicons/icons'
import { alertController } from '@ionic/vue'

import { IonPage, IonBadge, IonHeader, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton, IonLoading  } from '@ionic/vue';
export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonBadge,
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
      cartCount : 10,
      starIcon: star,
      cartIcon: cart,
      loading_item: false,
      searchText: '',
      categories: [{
        id: 0,
        text: 'All'
      },],
      categorySelected: 0,
      items: [
        { name: 'Toyota Wigo', price: 5000, image: 'https://purepng.com/public/uploads/large/purepng.com-toyota-land-cruiser-white-carcarvehicletransporttoyota-961524668359oxuc6.png' },
        { name: 'Toyota Rush', price: 6000, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-No-Background.png' },
        { name: 'Toyota Fortuner', price: 7000, image: 'https://www.pngplay.com/wp-content/uploads/13/Toyota-Land-Cruiser-Prado-Transparent-File.png' },
        { name: 'Mitsubishi Montero', price: 7200, image: 'https://www.pngplay.com/wp-content/uploads/8/White-Toyota-Car-Background-PNG-Image.png' },
        { name: 'Suzuki Ertiga', price: 5300, image: 'https://purepng.com/public/uploads/large/purepng.com-toyota-land-cruiser-white-carcarvehicletransporttoyota-961524668359oxuc6.png' },
        { name: 'Hyundai Stargazer', price: 5800, image: 'https://purepng.com/public/uploads/large/purepng.com-blue-toyota-rav4-hybrid-carcarvehicletransporttoyota-961524645526athex.png' },
        { name: 'Ford Everest', price: 7500, image: 'https://www.transparentpng.com/thumb/toyota/b5xANO-toyota-background.png' },
      ]
    }
  },
  mounted(){
    this.handleGetCatoregories();
    this.handleGetItems();
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
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
              return {
                id:item.id,
                name:item.name,
                price:item.price,
                image:item.images[0]?.image_url || 'https://via.placeholder.com/150' // Default image if none
              }
            });
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
  align-items: center;
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
