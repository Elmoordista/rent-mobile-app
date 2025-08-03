<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile Form</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="submitForm" class="profile-form">
        <div class="profile-pic-container">
          <img :src="profile.image" alt="Profile Picture" class="profile-pic" />
          <ion-button expand="block" @click="changePicture">Change Picture</ion-button>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display:none"
            @change="onFileChange"
          />
        </div>

        <ion-item>
          <ion-label position="floating">Name</ion-label>
          <ion-input v-model="profile.name" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" v-model="profile.email" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Bio</ion-label>
          <ion-textarea v-model="profile.bio"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Address</ion-label>
          <ion-input v-model="profile.address"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Phone Number</ion-label>
          <ion-input type="tel" v-model="profile.phone"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-select v-model="profile.gender" placeholder="Select Gender">
            <ion-select-option value="Female">Female</ion-select-option>
            <ion-select-option value="Male">Male</ion-select-option>
            <ion-select-option value="Other">Other</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Age</ion-label>
          <ion-input type="number" v-model.number="profile.age" min="0"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Birthday</ion-label>
          <ion-datetime
            v-model="profile.birthday"
            display-format="MMM DD, YYYY"
            picker-format="MMM DD YYYY"
          ></ion-datetime>
        </ion-item>

        <ion-button expand="block" type="submit" class="submit-btn">Save Profile</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
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
  IonButton,
} from '@ionic/vue'

import { ref } from 'vue'

const profile = ref({
  image: 'https://i.pravatar.cc/150?img=3',
  name: '',
  email: '',
  bio: '',
  address: '',
  phone: '',
  gender: '',
  age: null,
  birthday: ''
})

const fileInput = ref(null)

function changePicture() {
  fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      profile.value.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  console.log('Profile saved:', profile.value)
  alert('Profile saved! Check the console for data.')
}
</script>

<style scoped>
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
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
}

.submit-btn {
  margin-top: 24px;
}
</style>
