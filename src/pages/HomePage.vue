<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" >
      <ion-title>Home Page</ion-title>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="list-wrapper">

        <!-- Search Bar -->
        <div class="search-container">
          <ion-searchbar
            v-model="searchText"
            placeholder="Search"
            shape="round"
            debounce="250"
          ></ion-searchbar>
        </div>

        <!-- Categories -->
        <div class="categories-wrapper">
          <ion-segment value="all" scrollable class="category-segment">
            <ion-segment-button v-for="category in categories" :key="category" :value="category">
              <small>{{ category }}</small>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Scrollable Grid of Items -->
        <div class="items-scrollable">
          <ion-grid>
            <ion-row>
              <ion-col size="6" v-for="(item, index) in items" :key="index">
                <ion-card class="list-card-item" @click="handleClickItem(item)">
                  <div class="image-container">
                    <img :src="item.image" alt="item image" class="img" />
                  </div>
                  <div class="item-details">
                    <span class="item-name">{{ item.name }}</span>
                    <div class="item-rating">
                      <span>5.0</span>
                      <ion-icon :icon="starIcon" class="star-icon" />
                    </div>
                    <div class="price-book">
                      <span class="item-price">₱ {{ item.price }}/day</span>
                      <ion-button size="small" color="primary" shape="round" fill="outline">
                        Book
                      </ion-button>
                    </div>
                  </div>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

      </div>
    </ion-content>

  </ion-page>
</template>

<script>
import { star } from 'ionicons/icons'
import { IonPage, IonHeader, IonTitle, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton } from '@ionic/vue';
export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonTitle,
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
      starIcon: star,
      searchText: '',
      categories: ['All', 'Sedan', 'SUV', 'Van', 'Fullsize', 'Furniture Truck'],
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
  methods: {
    handleClickItem(item) {
      console.log('Item clicked:', item);
      this.$router.push(`/product/${1}`);
    }
  }
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
  background-color: #f7f7f7;
  padding: 10px;
  display: flex;
  justify-content: center;
}

.image-container img {
  width: 90%;
  height: auto;
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
</style>
