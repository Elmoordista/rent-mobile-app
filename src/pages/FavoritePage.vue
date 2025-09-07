<template>
  <ion-page>
   <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Favorites</ion-title>
    </ion-header>

    <ion-content>
      <ion-list>
        <template v-if="favorites.length">
            <ion-item-sliding v-for="(item, index) in favorites" :key="index">
                <ion-item lines="full">
                    <!-- Car Thumbnail -->
                    <ion-thumbnail slot="start">
                    <img :src="item.image || '/default-car.png'" alt="Car Image" style="width: 80px; height: 60px; object-fit: contain; border-radius: 8px;" />
                    </ion-thumbnail>

                    <!-- Car Details -->
                    <ion-label>
                    <h2>{{ item.name }}</h2>
                    <p>₱{{ formatPrice(item.price_per_day) }} / day</p>
                    </ion-label>
                </ion-item>

                <!-- Swipe Options -->
                <ion-item-options side="end">
                    <ion-item-option color="danger" @click="removeFavorite(item, index)">
                    <ion-icon slot="icon-only" :icon="trashOutline" />
                    </ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
        </template>

        <ion-item v-if="!favorites.length">
          <ion-label>No favorites found.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-loading :is-open="loading" message="Please wait..." />
    <ion-toast :is-open="showToast" message="Favorite removed" position="top" duration="2000" color="success" style="color:#fff" />
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToast, IonTitle, IonContent, IonList, IonItem, IonLoading,  IonLabel, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from "@ionic/vue";
import { trashOutline, arrowBackOutline } from "ionicons/icons";

export default {
  name: "FavoritesPage",
  components: { IonPage,IonLoading, IonHeader, IonToast, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption, IonIcon },
  data() {
    return {
      trashOutline,
      arrowBackIcon: arrowBackOutline,
      favorites: [],
      loading: false,
      showToast: false
    };
  },
  mounted() {
    this.handleGetFavorites();
  },
  methods: {
    handleGetFavorites() {
       this.loading = true;
       this.axios.get('/user/favorites').then((res) => {
        if(res.data.favorites) {
          this.favorites = res.data.favorites.map((fav)=>{
            return {
              id: fav.item_id,
              name: fav.item.name,
              price_per_day: fav.item.price_per_day,
              image: fav.item.images[0]?.image_url || 'https://via.placeholder.com/150' // Default image if none
            }
          });
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading = false;
      });
    },
    handleBack() {
      this.$router.back();
    },
    formatPrice(price) {
      return parseInt(price).toLocaleString();
    },
    removeFavorite(item, index) {
        this.loading = true;
        this.axios.delete(`/user/favorites-remove/${item.id}`)
        .then((res) => {
           if(res.data.success) {
             this.favorites.splice(index, 1);
             this.showToast = true;
           }
        })
        .catch((error) => {
            console.error('Error removing favorite:', error);
        }).finally(() => {
            this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
ion-thumbnail img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
ion-item h2 {
  font-size: 16px;
  font-weight: 600;
}
ion-item p {
  font-size: 14px;
  color: #555;
}
</style>
