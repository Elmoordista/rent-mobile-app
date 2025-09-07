<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-buttons slot="start" @click="handleBack">
        <ion-icon :icon="arrowBackIcon" slot="end" />
      </ion-buttons>
      <ion-title>Edit Profile</ion-title>
    </ion-header>


    <ion-content class="ion-padding">
      <form @submit.prevent="submitForm" class="profile-form">
        <div class="profile-pic-container">
          <img :src="profile.image" alt="Profile Picture" class="profile-pic" />
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
          <ion-input label-placement="stacked" placeholder="First Name"/>
          <ion-input label-placement="stacked" placeholder="Last Name"/>
          <ion-input label-placement="stacked" placeholder="Address"/>
          <ion-input label-placement="stacked" placeholder="Phone Number"/>
          <ion-input label-placement="stacked" placeholder="Email" type="email"/>
        </div>
        <ion-button 
              color="dark" 
              shape="round" 
              expand="block" 
              size="default" 
              class="book-button" 
              @click="handleLogin" 
              style="display: flex; align-items: center; height: 40px;">
                Update
            </ion-button>
      </form>
    </ion-content>
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
    IonButton
  },
  data() {
    return {
      profile: {
        image: 'https://i.pravatar.cc/150?img=3',
        name: 'Benjamin Jack',
        email: '',
        bio: '',
        address: '',
        phone: '',
        gender: '',
        age: null,
        birthday: ''
      },
      arrowBackIcon: arrowBack,
      heartOutlineIcon: heartOutline,
      listOutlineIcon: listOutline,
      logOutOutlineIcon: logOutOutline,
      pencilOutlineIcon: pencilSharp,
      arrowForwardIcon: chevronForwardOutline
    }
  },
  methods: {
    handleBack() {
      this.$router.back();
    }
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
  max-width: 480px;
  margin: 0 auto;
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
