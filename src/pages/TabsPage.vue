<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/cars">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="radio" href="/booking">
          <ion-icon :icon="car" />
          <ion-label>Booking</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="person" href="/profile">
          <ion-icon :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue'

  import { home, car, person} from 'ionicons/icons';

  export default {
    components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon },
    data() {
      return {
          home,
          car,
          person,
      };
    },
  };
</script>

<style scoped>
  ion-tab-bar {
    color: #000;
  }

  ion-tab-button {
     background-color: gray;
    --color-selected: #fff;
  }
  ion-icon {
    font-size: 24px;
  }
  ion-label {
    font-size: 12px;
  }
  ion-tab-button {
    --color: #a5a3a3;
  }
  ion-tab-button[aria-selected="true"] {
    --color: #3880ff;
  }
  ion-tab-button[aria-selected="false"] {
    --color: #000;
  }
  ion-tab-bar {
    --background: #fff;
    --color: #000;
  }
  ion-tab-bar[slot="bottom"] {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  ion-tab-bar ion-tab-button {
    flex: 1;
    text-align: center;
  }
  ion-tab-bar ion-tab-button ion-icon {
    font-size: 24px;
  }
  ion-tab-bar ion-tab-button ion-label {
    font-size: 12px;
  }
  ion-tab-bar ion-tab-button[aria-selected="true"] {
    color: #3880ff;
  }
  ion-tab-bar ion-tab-button[aria-selected="false"] {
    color: #000;
  }
  ion-tab-bar ion-tab-button[aria-selected="true"] ion-icon {
    color: #3880ff;
  }
  ion-tab-bar ion-tab-button[aria-selected="false"] ion-icon {
    color: #000;
  }
  ion-tab-bar ion-tab-button[aria-selected="true"] ion-label {
    color: #3880ff;
  }
  ion-tab-bar ion-tab-button[aria-selected="false"] ion-label {
    color: #000;
  }
</style>