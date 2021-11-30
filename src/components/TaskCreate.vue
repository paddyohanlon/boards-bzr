<template>
  <form @submit.prevent="submitCreateTask">
    <div class="field mt-4">
      <label class="label is-sr-only" :for="`add-task-input-column-${columnId}`">+ Add a task</label>
      <div class="control mb-0">
        <input
          :id="`add-task-input-column-${columnId}`"
          type="text"
          v-model="taskName"
          class="input"
          placeholder="+ Add a task"
          required
          autocomplete="off"
        />
      </div>
    </div>
    <button class="button is-sr-only" type="submit">Add a task</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { ActionPayloadCreateTask } from "@/types";

export default defineComponent({
  name: "TaskCreate",
  props: {
    columnId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();

    const { getStringFromParam } = useRouterParams;

    const boardId = getStringFromParam(route.params.boardId);

    const taskName = ref("");

    const submitCreateTask: () => Promise<void> = async () => {
      await store.dispatch("createTask", {
        boardId,
        columnId: props.columnId,
        taskName: taskName.value,
      } as ActionPayloadCreateTask);
      taskName.value = "";
    };

    return { taskName, submitCreateTask };
  },
});
</script>

<style scoped lang="scss"></style>
