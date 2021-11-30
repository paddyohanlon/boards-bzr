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
import { oauthClient } from "@/oauth";
import jwt_decode from "jwt-decode";

export default defineComponent({
  name: "Callback",
  setup() {
    const store = useStore();
    const router = useRouter();

    const params = new URLSearchParams(window.location.search);

    // Check if the auth server returned an error string
    const error = ref(params.get("error") || "");
    const errorDescription = ref(params.get("error_description") || "");

    (async () => {
      // Make sure the auth server returned a code
      const code = params.get("code");
      if (!code) {
        error.value = "No query param code";
        return;
      }

      console.log(`localStorage.getItem("pkce_state")`, localStorage.getItem("pkce_state"));
      console.log(`params.get("state")`, params.get("state"));

      // Verify state matches what we set at the beginning
      if (localStorage.getItem("pkce_state") !== params.get("state")) {
        console.log("pkce states don't match");
        error.value = "State did not match. Possible CSRF attack";
      }

      let getTokenResponse;
      try {
        getTokenResponse = await oauthClient.code.getToken(window.location.href, {
          body: {
            code_verifier: localStorage.getItem("pkce_code_verifier") || "",
          },
        });
        console.log("getTokenResponse", getTokenResponse);
      } catch (error) {
        console.log("error", error);
      }

      if (!getTokenResponse) {
        error.value = "could not get token response";
        return;
      }

      // Clean these up since we don't need them anymore
      localStorage.removeItem("pkce_state");
      localStorage.removeItem("pkce_code_verifier");

      // Store tokens and sign user in locally
      const token: string = getTokenResponse.data.access_token;
      const idToken: string = getTokenResponse.data.id_token;

      localStorage.setItem("token", token);
      localStorage.setItem("idToken", idToken);

      try {
        const tokenDecoded: { sub: string } = jwt_decode(token);
        const idTokenDecoded = jwt_decode(idToken);
        console.log("tokenDecoded", tokenDecoded);
        console.log("idTokenDecoded", idTokenDecoded);
        await store.dispatch("autoSignIn", idTokenDecoded);
        store.dispatch("fetchBoards");
        await router.push({ name: "home" });
        location.reload();
      } catch (error) {
        console.log("token decode error:", error);
      }
    })();

    return { error, errorDescription };
  },
});
</script>

<style scoped lang="scss"></style>
