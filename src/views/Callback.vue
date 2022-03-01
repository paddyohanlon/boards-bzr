<template>
  <div class="small-container">
    <h1 class="title is-1">Authenticating...</h1>
    <div v-if="error" class="notification is-danger">
      <h2>{{ error }}</h2>
      <p>{{ errorDescription }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { rid } from "@/rethinkid";

export default defineComponent({
  name: "Callback",
  setup() {
    const store = useStore();
    const router = useRouter();

    // Check if the auth server returned an error string
    const error = ref("");
    const errorDescription = ref("");

    (async () => {
      const decodedTokens = await rid.getTokens();

      if (decodedTokens.error) {
        error.value = decodedTokens.error;
        errorDescription.value = decodedTokens.errorDescription || "";
        return;
      }

      await store.dispatch("autoSignIn", decodedTokens.idTokenDecoded);
      store.dispatch("fetchBoards");
      await router.push({ name: "home" });
    })();

    return { error, errorDescription };
  },
});
</script>

<style scoped lang="scss"></style>
