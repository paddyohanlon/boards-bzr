<template>
  <AppNav />
  <router-view v-if="loaded" :aria-hidden="isModalOpen" />
  <div class="loading" v-else>Loading...</div>
  <AppServiceWorkerNotification />
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";
import { useStore } from "vuex";
import AppNav from "@/components/AppNav.vue";
import AppServiceWorkerNotification from "@/components/AppServiceWorkerNotification.vue";
import { bzr } from "./bzr";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "App",
  components: {
    AppNav,
    AppServiceWorkerNotification,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    watch(
      () => route.meta.isDisplayedInModal,
      (isDisplayedInModal) => {
        console.log("watch isDisplayedInModal", isDisplayedInModal);
        store.dispatch("setIsModalOpen", isDisplayedInModal || false)
      },
    );

    const loaded = computed(() => store.state.loaded);
    const isModalOpen = computed(() => store.state.isModalOpen);

    store.dispatch("autoSignIn");

    bzr.onLogin(async () => store.dispatch("autoSignIn"));

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

.loading {
  color: white;
  padding: 1em;
}
</style>
