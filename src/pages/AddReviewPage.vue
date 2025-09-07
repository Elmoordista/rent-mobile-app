<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
       <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Add Review</ion-title>
    </ion-header>

    <div class="ion-padding" v-if="!loading_item" style="max-height: calc(100vh - 56px); overflow-y: auto;">
      <!-- Item Card -->
          <div class="item-card">
            <img :src="item.image || '/default-car.png'" alt="Item Image" class="item-main-image" />
            <div class="item-info">
              <h2 class="item-title">{{ item.title }}</h2>
              <p class="item-subtitle">₱{{ priceAddComma(item.price_per_day) }} / day</p>
            </div>
          </div>

          <!-- Star Rating -->
          <div class="star-rating">
            <ion-icon
              v-for="star in 5"
              :key="star"
              :icon="star <= rating ? starIcon : starOutlineIcon"
              class="star"
              @click="setRating(star)"
            />
          </div>

          <!-- Comment Input -->
          <ion-item lines="none" class="comment-box">
            <ion-textarea
              v-model="comment"
              placeholder="Write your experience..."
              auto-grow
            ></ion-textarea>
          </ion-item>

      <!-- Submit Button -->
      <ion-button
        expand="block"
        shape="round"
        :disabled="submitLoading"
        @click="submitReview"
        class="submit-btn"
      >
        <ion-spinner v-if="submitLoading" name="crescent"></ion-spinner>
        <span v-else>✨ Submit Review</span>
      </ion-button>

    </div>
    <ion-loading :is-open="submitLoading" message="Submitting your review..."></ion-loading>
    <ion-loading :is-open="loading_item" message="Loading item details..."></ion-loading>
    <ion-toast :is-open="showToast" message="Review submitted successfully!" color="success" duration="2000" position="tio" style="color: #fff;"></ion-toast>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonTextarea,
  IonItem,
  IonButton,
  IonSpinner,
  IonLoading,
  IonToast,
  IonIcon,
} from "@ionic/vue";
import { star, starOutline, arrowBack } from "ionicons/icons";

export default {
  name: "AddReview",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonToast,
    IonButtons,
    IonBackButton,
    IonTextarea,
    IonItem,
    IonButton,
    IonSpinner,
    IonLoading,
    IonIcon,
  },
  data() {
    return {
      rating: 0,
      comment: "",
      submitLoading: false,
      loading_item: false,
      starIcon: star,
      starOutlineIcon: starOutline,
      arrowBackIcon: arrowBack,
      showToast: false,
      item: {
        id: null,
        title: '',
        image: '',
        price_per_day: 0,
      },
    };
  },
  mounted(){
    this.handleGetItem();
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
     handleGetItem() {
      this.loading_item = true;
      this.axios.get(`/items/${this.$route.params.id}`).then((res) => {
        if(res.data && res.data.data) {
          this.item = {
            id: res.data.data.id,
            title: res.data.data.name,
            image: res.data.data.images[0]?.image_url || '/default-car.png',
            price_per_day: res.data.data.price_per_day,
          };
        }

      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading_item = false;
      })
    },
    setRating(star) {
      this.rating = star;
    },
    priceAddComma(price) {
      return parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async submitReview() {
      if (!this.rating || !this.comment.trim()) {
        alert("Please provide both rating and comment.");
        return;
      }
      this.submitLoading = true;

      try {
        await this.axios.post(`/item/add-review/${this.item.id}`, {
          item_id: this.item.id,
          rating: this.rating,
          comment: this.comment,
        });

        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.$router.back();
        }, 100);
      } catch (error) {
        console.error(error);
        alert("Failed to submit review. Please try again.");
      } finally {
        this.submitLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Item Card */
.item-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  padding: 16px;
  text-align: center;
  margin-bottom: 24px;
}
.item-main-image {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}
.item-info {
  margin-top: 8px;
}
.item-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.item-subtitle {
  font-size: 14px;
  color: #777;
}

/* Star Rating */
.star-rating {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}
.star {
  font-size: 36px;
  color: #fbbf24; /* Amber/Gold */
  cursor: pointer;
  transition: transform 0.2s;
}
.star:hover {
  transform: scale(1.2);
}

/* Comment Box */
.comment-box {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 6px 10px;
  background: #fafafa;
}

/* Submit Button */
.submit-btn {
  margin-top: 20px;
  --background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --border-radius: 50px;
  font-weight: 600;
}
</style>
