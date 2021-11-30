<template>
  <form @submit.prevent="submitCreateColumn">
    <div class="field mt-4">
      <label class="label is-sr-only" for="add-column-input">+ Add a column</label>
      <div class="control mb-0">
        <input
          id="add-column-input"
          type="text"
          v-model="columnName"
          class="input"
          placeholder="+ Add a column"
          required
          autocomplete="off"
        />
      </div>
    </div>
    <button class="button is-sr-only" type="submit">Add a column</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { ActionPayloadCreateColumn } from "@/types";

export default defineComponent({
  name: "ColumnCreate",
  setup() {
    const store = useStore();
    const route = useRoute();

    const { getStringFromParam } = useRouterParams;

    const columnName = ref("");

    const submitCreateColumn: () => Promise<void> = async () => {
      const boardId = getStringFromParam(route.params.boardId);
      await store.dispatch("createColumn", {
        boardId,
        columnName: columnName.value,
      } as ActionPayloadCreateColumn);
      columnName.value = "";
    };

    return {
      columnName,
      submitCreateColumn,
    };
  },
});
</script>

<style scoped lang="scss"></style>
