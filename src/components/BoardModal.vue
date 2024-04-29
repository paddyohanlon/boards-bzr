<template>
  <teleport to="#modal-container">
    <div
      class="modal"
      :class="{ 'is-active': isModalOpen }"
      role="dialog"
      aria-labelledby="modal-title"
      :aria-hidden="!isModalOpen"
    >
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <!-- See router for child route components displayed here -->
            <router-view />
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import store from "@/store";
import { computed, defineComponent, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "BoardModal",
  setup() {
    const router = useRouter();
    const route = useRoute();

    function closeModal(): void {
      router.push({ name: "board" });
    }

    const isModalOpen = computed(() => store.state.isModalOpen);

    const escapeListener = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        closeModal();
      }
    };

    watch(
      () => route.meta.isDisplayedInModal,
      (isDisplayedInModal) => {
        if (isDisplayedInModal) {
          document.addEventListener("keydown", escapeListener);
        } else {
          document.removeEventListener("keydown", escapeListener);
        }
      },
    );

    return { closeModal, isModalOpen };
  },
});
</script>

<style scoped lang="scss"></style>
