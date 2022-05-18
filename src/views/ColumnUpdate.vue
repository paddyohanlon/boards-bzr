<template>
  <!-- This component is displayed in a BoardModal.vue -->
  <!-- The `id` attr matches `aria-labelledby` in BoardModal.vue -->
  <h3 id="modal-title" class="title is-4">Update Column</h3>
  <form v-if="column" @submit.prevent="submitUpdateColumn">
    <div class="field mt-4">
      <label class="label is-sr-only" for="add-column-input">Update column name</label>
      <div class="control mb-0">
        <input
          id="add-column-input"
          type="text"
          v-model="updateColumn.name"
          class="input"
          placeholder="Update column name"
          required
        />
      </div>
    </div>
    <button class="button is-primary mr-4" type="submit">Update</button>
    <button class="button" type="button" @click="deleteColumn">Delete</button>
  </form>
  <div v-else>Column not found.</div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { Column, ActionPayloadUpdateColumn, ActionPayloadDeleteColumn } from "@/types";

export default defineComponent({
  name: "ColumnUpdate",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { getStringFromParam } = useRouterParams;

    const boardId = getStringFromParam(route.params.boardId);
    const columnId = getStringFromParam(route.params.columnId);

    const board = store.getters.boardById(boardId);
    const columnIndex = store.getters.indexById(board.columns, columnId);

    const column: ComputedRef<Column | undefined> = computed(() => {
      return board.columns[columnIndex];
    });

    const updateColumn: ComputedRef<Column> = computed(() => {
      return Object.assign({ id: "", name: "", tasks: {} }, column.value);
    });

    const submitUpdateColumn: () => Promise<void> = async () => {
      await store.dispatch("updateColumn", {
        boardId,
        updateColumn: updateColumn.value,
      } as ActionPayloadUpdateColumn);
      router.push({ name: "board" });
    };

    const deleteColumn: () => Promise<void> = async () => {
      if (window.confirm("You sure you want to delete this column and all of its tasks?")) {
        await store.dispatch("deleteColumn", {
          boardId,
          columnId,
        } as ActionPayloadDeleteColumn);
        router.push({ name: "board" });
      }
    };

    return { column, updateColumn, submitUpdateColumn, deleteColumn };
  },
});
</script>

<style scoped lang="scss"></style>
