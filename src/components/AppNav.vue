<template>
  <nav class="navbar mb-4" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ name: 'home' }"
        ><img src="../assets/logo.png" width="112" height="28" alt="Logo"
      /></router-link>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="nav">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="nav" class="navbar-menu">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="authenticated">
              <div class="button">{{ openIdConnect.email }}</div>
              <button class="button" @click="signOut">Sign out</button>
            </template>
            <template v-else>
              <router-link :to="{ name: 'signUp' }" class="button is-primary">Sign up</router-link>
              <router-link :to="{ name: 'signIn' }" class="button is-light">Sign in</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { signOutUtil } from "@/utils";

export default defineComponent({
  name: "AppNav",
  setup() {
    const store = useStore();

    const authenticated = computed(() => store.state.authenticated);
    const openIdConnect = computed(() => store.state.openIdConnect);

    function signOut(): void {
      signOutUtil();
    }

    return { authenticated, openIdConnect, signOut };
  },
});
</script>

<style scoped lang="scss"></style>
