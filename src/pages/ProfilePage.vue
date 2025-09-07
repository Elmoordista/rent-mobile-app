<template>
  <ion-page>
    <ion-header class="ion-no-border ion-padding ion-text-center header" style="display: flex; align-items: center; justify-content: center;">
      <ion-title>Profile</ion-title>
    </ion-header>


    <ion-content>
      <!-- Profile Info Section -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
          <ion-item lines="none">
            <ion-avatar slot="start">
              <img src="https://i.pravatar.cc/150?img=3" alt="Profile Picture" />
            </ion-avatar>
            <ion-label>
              <h2>{{ user?.full_name }}</h2>
              <p>{{ user?.email }}</p>
            </ion-label>
          </ion-item>
          <ion-item button lines="none" @click="handleEditProfile">
            <ion-label style="display: flex; align-items: center; flex-direction: column; gap: 5px;">
                <ion-icon :icon="pencilOutlineIcon" style="font-size: 15px;"/>
                <span style="font-size: 12px; white-space: nowrap;">Edit Profile</span>
            </ion-label>
          </ion-item>
        </div>

      <!-- General Section -->
      <ion-list style="margin-top: 10px;">
        <ion-label style="margin-left: 15px; font-weight: 600;">General</ion-label>
        <ion-item button @click="navigateToFavoriteCars" lines="none">
          <ion-icon :icon="heartOutlineIcon" slot="start" />
          <ion-label>Favorites <span v-if="profile.favorites > 0" class="badge favorite">{{ profile.favorites }}</span></ion-label>
         <ion-icon :icon="arrowForwardIcon" size="small" slot="end"/>
        </ion-item>
        <!-- <ion-item button @click="navigateToPreviousRant" lines="none">
          <ion-icon :icon="listOutlineIcon" slot="start" />
          <ion-label>Previous Rant</ion-label>
          <ion-icon :icon="arrowForwardIcon" size="small" slot="end"/>
        </ion-item> -->
        <ion-item button @click="navigateToPendingOrders" lines="none">
          <ion-icon :icon="cartOutlineIcon" slot="start" />
          <ion-label>Pending Orders  <span v-if="profile.pending_orders > 0" class="badge">{{ profile.pending_orders }}</span></ion-label>
          <ion-icon :icon="arrowForwardIcon" size="small" slot="end"/>
        </ion-item>
      </ion-list>
      <ion-list style="margin-top: 10px;">
         <ion-label style="margin-left: 15px; font-weight: 600;">Settings</ion-label>
        <ion-item button @click="handleLogout" lines="none">
          <ion-icon :icon="logOutOutlineIcon" slot="start" />
          <ion-label>Logout</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-loading :is-open="loading" message="Please wait..."></ion-loading>

  </ion-page>
</template>

<script>
import { onIonViewWillEnter } from '@ionic/vue';
import { arrowBack, heartOutline, listOutline, chevronForwardOutline, logOutOutline, pencilSharp, cartOutline } from 'ionicons/icons'
import { IonPage, IonHeader, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonTitle, IonLoading, IonBadge } from '@ionic/vue';
export default {
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonButtons,
    IonLoading,
    IonBadge,
    IonTitle
  },
  data() {
    return {
      loading: false,
      arrowBackIcon: arrowBack,
      heartOutlineIcon: heartOutline,
      cartOutlineIcon: cartOutline,
      listOutlineIcon: listOutline,
      logOutOutlineIcon: logOutOutline,
      pencilOutlineIcon: pencilSharp,
      arrowForwardIcon: chevronForwardOutline,
      profile : {
        pending_orders: 0,
        favorites: 0
      }
    }
  },
  ionViewWillEnter() {
    this.handleGetProfileSettings();
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    handleGetProfileSettings() {
      this.axios.get('/user/profile-settings').then((res) => {
        if(res.data.data) {
          this.profile = {
            pending_orders: res.data.pendingBookings,
            favorites: res.data.favorites
          }
        }
      }).catch((error) => {
        console.log(error, 'error')
      }).finally(() => {
        this.loading = false;
      });
    },
    handleEditProfile() {
      // Navigate to profile edit page
      this.$router.push('/profile/edit');
    },
    navigateToFavoriteCars() {
      // Navigate to Favorite Cars page
      this.$router.push('/favorites');
    },
    navigateToPendingOrders() {
      // Navigate to Pending Orders page
      this.$router.push('/pending-order');
    },
    navigateToPreviousRant() {
      // Navigate to Previous Rant page
      this.$router.push('/previous-rant');
    },
    toggleNotification() {
      // Toggle Notification setting (e.g., show/hide)
      console.log('Toggle notification');
    },
    navigateToQentPartnerships() {
      // Navigate to Connected QENT Partnerships page
      this.$router.push('/qent-partnerships');
    },
    navigateToSettings() {
      // Navigate to Settings page
      this.$router.push('/settings');
    },
    navigateToLanguages() {
      // Navigate to Languages page
      this.$router.push('/languages');
    },
    navigateToInviteFriends() {
      // Navigate to Invite Friends page
      this.$router.push('/invite-friends');
    },
    navigateToPrivacyPolicy() {
      // Navigate to Privacy Policy page
      this.$router.push('/privacy-policy');
    },
    navigateToHelpSupport() {
      // Navigate to Help Support page
      this.$router.push('/help-support');
    },
    handleLogout() {
      this.loading = true;
      this.$store.dispatch('logout');
    }
  }
};
</script>

<style scoped>
.badge {
  background-color: orange;
  color: #fff;
  font-size: 12px;
  min-width: 20px;   /* ensures enough space for numbers */
  height: 20px;
  line-height: 20px; /* vertically centers the text */
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  padding: 0 5px; /* allows wider circle if 2+ digits */
  box-sizing: border-box;
  margin-top: -10px;
}
.favorite {
  background-color: red;
}
.header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}
.profile-card {
  margin-bottom: 20px;
}
ion-item {
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
}
</style>
