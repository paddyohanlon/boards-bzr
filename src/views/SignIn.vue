<template>
  <div class="small-container">
    <h1 class="title is-1">Sign in</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <div v-if="signUpEmail" class="notification is-success">Sign up with {{ signUpEmail }} successful!</div>
          <template v-if="clientUri">
            <a :href="clientUri">Sign in with RethinkID</a>
          </template>
          <template v-else>Loading...</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { rid } from "@/rethinkid";

export default defineComponent({
  name: "SignIn",
  setup() {
    const route = useRoute();

    const clientUri = ref("");
    const signUpEmail = ref("");

    const signUpEmailQueryParam = route.query["sign_up_email"];
    if (signUpEmailQueryParam && typeof signUpEmailQueryParam === "string") {
      signUpEmail.value = signUpEmailQueryParam;
    }

    if (!clientUri.value) {
      (async () => {
        clientUri.value = await rid.logInUri();
      })();
    }

    return { clientUri, signUpEmail };
  },
});
</script>

<style scoped lang="scss"></style>
