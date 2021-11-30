<template>
  <!-- This component is displayed in BoardModal.vue -->
  <!-- The `id` attr matches `aria-labelledby` in BoardModal.vue -->
  <h3 id="modal-title" class="title is-4">Update Task</h3>
  <form v-if="task" @submit.prevent="submitUpdateTask">
    <div class="field mt-4">
      <label class="label" for="task-name-input">Name</label>
      <div class="control mb-0">
        <input id="task-name-input" type="text" class="input" v-model="updateTask.name" required />
      </div>
    </div>
    <div class="field mt-4">
      <label class="label" for="task-description-input">Description</label>
      <div class="control mb-0">
        <input id="task-description-input" type="text" class="input" v-model="updateTask.description" />
      </div>
    </div>
    <button class="button is-primary mr-4" type="submit">Update</button>
    <button class="button" type="button" @click="deleteTask">Delete</button>
  </form>
  <div v-else>Task not found.</div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { Task, ActionPayloadUpdateTask, ActionPayloadDeleteTask } from "@/types";

export default defineComponent({
  name: "Task",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { getStringFromParam } = useRouterParams;

    const boardId = getStringFromParam(route.params.boardId);
    const boardIndex = store.getters.boardIndex(boardId);
    const columnId = getStringFromParam(route.params.columnId);
    const taskId = getStringFromParam(route.params.taskId);

    const task: ComputedRef<Task | undefined> = computed(() => {
      return store.state.boards[boardIndex].columns[columnId].tasks[taskId];
    });

    const updateTask: ComputedRef<Task> = computed(() => {
      return Object.assign({ id: "", name: "", description: "" }, task.value);
    });

    const submitUpdateTask: () => Promise<void> = async () => {
      await store.dispatch("updateTask", {
        boardId,
        columnId,
        updateTask: updateTask.value,
      } as ActionPayloadUpdateTask);
      router.push({ name: "board" });
    };

    const deleteTask: () => Promise<void> = async () => {
      if (window.confirm("You sure you want to delete this task?")) {
        await store.dispatch("deleteTask", {
          boardId,
          columnId,
          taskId,
        } as ActionPayloadDeleteTask);
        router.push({ name: "board" });
      }
    };

    return { task, updateTask, submitUpdateTask, deleteTask };
  },
});
</script>

<style scoped lang="scss"></style>
