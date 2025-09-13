<template>
  <ion-page style="display: block;">
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Edit Profile</ion-title>
    </ion-header>

      <form @submit.prevent="submitForm" class="profile-form">
        <div class="profile-pic-container">
          <img :src="preview_image ? preview_image : 'https://i.pravatar.cc/150?img=3'" alt="Profile Picture" class="profile-pic" style="border-radius: 50%; width: 100px; height: 100px; object-fit: contain;"/>
          <ion-button expand="block" @click="changePicture" size="small">Change Picture</ion-button>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display:none"
            @change="onFileChange"
          />
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <ion-input v-model="profile.first_name" label-placement="stacked" placeholder="First Name"/>
          <ion-input v-model="profile.last_name" label-placement="stacked" placeholder="Last Name"/>
          <ion-input v-model="profile.address" label-placement="stacked" placeholder="Address"/>
          <ion-input v-model="profile.phone" label-placement="stacked" placeholder="Phone Number"/>
          <ion-input v-model="profile.email" label-placement="stacked" placeholder="Email" type="email"/>
        </div>
        <ion-button 
              color="dark" 
              shape="round" 
              expand="block" 
              size="default" 
              class="book-button" 
              @click="submitForm" 
              style="display: flex; align-items: center; height: 40px;">
                Update
            </ion-button>
      </form>
        <ion-toast
          :is-open="submit_success"
          message="Profile updated successfully!"
          duration="2000"
          color="success"
          position="top"
          style="color: #fff;"
        ></ion-toast>
        <ion-loading :is-open="loading" message="Please wait..."></ion-loading>
  </ion-page>
</template>

<script>
import { arrowBack, heartOutline, listOutline, chevronForwardOutline, logOutOutline, pencilSharp } from 'ionicons/icons'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonToast,
  IonLoading,
  IonButton
} from '@ionic/vue'

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonLoading,
    IonToast
  },
  data() {
    return {
      profile: {
        image: '',
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        phone: '',
        profile_url: '',
      },
      preview_image : null,
      submit_success: false,
      loading: false,
      arrowBackIcon: arrowBack,
      heartOutlineIcon: heartOutline,
      listOutlineIcon: listOutline,
      logOutOutlineIcon: logOutOutline,
      pencilOutlineIcon: pencilSharp,
      arrowForwardIcon: chevronForwardOutline
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    if (this.user) {
      this.profile.first_name = this.user.first_name || '';
      this.profile.last_name = this.user.last_name || '';
      this.profile.email = this.user.email || '';
      this.profile.address = this.user.address || '';
      this.profile.phone = this.user.phone || '';
      this.profile.profile_url = this.user.profile_url || '';
      this.preview_image = this.user.profile_url || null;
    }
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    submitForm() {
      // Handle form submission logic here
      this.loading = true;
      this.axios.post('/user/update-profile', this.profile)
        .then((response) => {
          // Optionally, update the user in Vuex store
          console.log(response.data.data,' response.data.data');
          this.$store.commit('setUser', response.data.data);
          // Navigate back or show a success message
          this.submit_success = true;
          this.$router.back();
        })
        .catch((error) => {
          alert('Error updating profile: ' + (error.response?.data?.message || error.message));
          // Handle error (e.g., show an error message)
        }).finally(() => {
          this.loading = false;
        });
    },
    changePicture() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profile.image = e.target.result;
          this.preview_image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  }
};
  
</script>

<style scoped>
ion-input {
  min-height: 40px !important;
    --background: #fff;
  --color: #000;
  --placeholder-color: #666;
  --padding-start: 12px;
  --border-radius: 12px;
  border: 1px solid #bdbcbc;
  border-radius: 12px;
  text-align: start;
}
.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}
.profile-form {
  margin-top: 25px;
  max-width: 480px;
  padding: 0 20px;
}

.profile-pic-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
}

.submit-btn {
  margin-top: 24px;
}
</style>
