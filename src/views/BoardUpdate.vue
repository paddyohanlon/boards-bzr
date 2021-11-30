<template>
  <!-- This component is displayed in a BoardModal.vue -->
  <!-- The `id` attr matches `aria-labelledby` in BoardModal.vue -->
  <h3 id="modal-title" class="title is-4">Update Board</h3>
  <form v-if="board" @submit.prevent="submitUpdateBoard">
    <div class="field mt-4">
      <label class="label is-sr-only" for="add-board-input">Update board name</label>
      <div class="control mb-0">
        <input
          id="add-board-input"
          type="text"
          v-model="updateBoard.name"
          class="input"
          placeholder="Update board name"
          required
        />
      </div>
    </div>
    <button class="button is-primary mr-4" type="submit">Update</button>
    <button class="button" type="button" @click="deleteBoard">Delete</button>
  </form>
  <div v-else>Board not found.</div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { Board } from "@/types";

export default defineComponent({
  name: "BoardUpdate",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { getStringFromParam } = useRouterParams;

    const board: ComputedRef<Board | undefined> = computed(() => {
      const boardId = getStringFromParam(route.params.boardId);
      const boardIndex = store.getters.boardIndex(boardId);
      return store.state.boards[boardIndex];
    });

    const updateBoard: ComputedRef<Board> = computed(() => {
      return Object.assign({ id: 0, name: "", columns: [] }, board.value);
    });

    const submitUpdateBoard: () => Promise<void> = async () => {
      await store.dispatch("updateBoard", updateBoard.value);
      router.push({ name: "board" });
    };

    const deleteBoard: () => Promise<void> = async () => {
      if (window.confirm("You sure you want to delete this board and all of its columns and tasks?")) {
        await store.dispatch("deleteBoard", board.value as Board);
        router.push({ name: "home" });
      }
    };

    return { board, updateBoard, submitUpdateBoard, deleteBoard };
  },
});
</script>

<style scoped lang="scss"></style>
