<template>
  <div class="small-container">
    <h1 class="title is-1">Sign in</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
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
import { oauthClient, generateRandomString, pkceChallengeFromVerifier } from "@/oauth";

export default defineComponent({
  name: "SignIn",
  setup() {
    const clientUri = ref("");

    if (!clientUri.value) {
      (async () => {
        // Create and store a random "state" value
        const state = generateRandomString();
        console.log("state", state);
        localStorage.setItem("pkce_state", state);

        // Create and store a new PKCE code_verifier (the plaintext random secret)
        const codeVerifier = generateRandomString();
        localStorage.setItem("pkce_code_verifier", codeVerifier);

        // Hash and base64-urlencode the secret to use as the challenge
        const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

        clientUri.value = oauthClient.code.getUri({
          state: state,
          query: {
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
          },
        });
      })();
    }

    return { clientUri };
  },
});
</script>

<style scoped lang="scss"></style>
