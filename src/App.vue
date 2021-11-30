<template>
  <AppNav />
  <router-view v-if="loaded" :aria-hidden="isModalOpen" />
  <div v-else>Loading...</div>
  <AppServiceWorkerNotification />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import jwt_decode from "jwt-decode";
import useModals from "@/composables/modals";
import AppNav from "@/components/AppNav.vue";
import AppServiceWorkerNotification from "@/components/AppServiceWorkerNotification.vue";

export default defineComponent({
  name: "App",
  components: {
    AppNav,
    AppServiceWorkerNotification,
  },
  setup() {
    const store = useStore();

    const loaded = ref(false);

    // auto sign in
    (async () => {
      console.log("Auto sign-in:");
      const token = localStorage.getItem("token");
      const idToken = localStorage.getItem("idToken");

      if (token && idToken) {
        try {
          const tokenDecoded: { sub: string } = jwt_decode(token);
          const idTokenDecoded: { sub: string; email: string; name: string } = jwt_decode(idToken);
          console.log("- tokenDecoded", tokenDecoded);
          console.log("- idTokenDecoded", idTokenDecoded);
          store.dispatch("autoSignIn", idTokenDecoded);
          store.dispatch("fetchBoards");
          loaded.value = true;
        } catch (error) {
          console.log("token decode error:", error);
          localStorage.removeItem("token");
          loaded.value = true;
        }
      } else {
        loaded.value = true;
      }
    })();

    const { isModalOpen } = useModals;

    return { isModalOpen, loaded };
  },
});
</script>

<style lang="scss">
@import "~normalize.css/normalize.css";
@import "~bulma/bulma.sass";

// apply a natural box layout model to all elements, but allowing components to change
html {
  background: $background;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.small-container {
  margin: 0 auto;
  max-width: 440px;
}
</style>
