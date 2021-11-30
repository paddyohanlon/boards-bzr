<template>
  <div
    v-if="task"
    class="card is-clickable"
    role="button"
    @click="goToTask()"
    draggable="true"
    @dragstart="dragstartTask($event, columnId, task.id)"
    @drop.stop="dropTaskOrColumn($event, $route.params.boardId, columnId, task.id)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="card-content">
      <h3 class="title is-6">{{ task.name }}</h3>
      <div v-if="task.description">{{ task.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";
import useDragAndDrop from "@/composables/drag-and-drop";
import { Task, Tasks } from "@/types";

export default defineComponent({
  name: "TaskItem",
  props: {
    tasks: {
      type: Object as PropType<Tasks>,
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const { dragstartTask, dropTaskOrColumn } = useDragAndDrop;

    function goToTask(): void {
      router.push({
        name: "task",
        params: { columnId: props.columnId, taskId: props.task.id },
      });
    }

    return { dragstartTask, dropTaskOrColumn, goToTask };
  },
});
</script>

<style scoped lang="scss"></style>
