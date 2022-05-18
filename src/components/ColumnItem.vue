<template>
  <div
    draggable="true"
    @dragstart.self="dragstartColumn($event, column.id)"
    @drop="dropTaskOrColumn($event, boardId, column.id)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="card column-card">
      <div class="card-content">
        <div class="column-header">
          <h2 class="title is-4">{{ column.name }}</h2>
          <button class="button is-small is-rounded is-outlined" @click="goToColumnUpdate()">
            &middot;&middot;&middot;
          </button>
        </div>

        <div class="column-tasks" aria-live="polite">
          <TaskItem
            v-for="task in column.tasks"
            :key="task.id"
            :task="task"
            :tasks="column.tasks"
            :columnId="column.id"
          />
        </div>
        <TaskCreate :columnId="column.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useRoute, useRouter } from "vue-router";
import useDragAndDrop from "@/composables/drag-and-drop";
import useRouterParams from "@/composables/router-params";
import { Column } from "@/types";
import TaskItem from "@/components/TaskItem.vue";
import TaskCreate from "@/components/TaskCreate.vue";

export default defineComponent({
  name: "ColumnItem",
  components: {
    TaskItem,
    TaskCreate,
  },
  props: {
    column: {
      type: Object as PropType<Column>,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const { dragstartColumn, dropTaskOrColumn } = useDragAndDrop;
    const { getStringFromParam } = useRouterParams;

    const boardId = getStringFromParam(route.params.boardId);

    function goToColumnUpdate(): void {
      router.push({
        name: "columnUpdate",
        params: { columnId: props.column.id },
      });
    }

    return {
      boardId,
      dragstartColumn,
      dropTaskOrColumn,
      goToColumnUpdate,
    };
  },
});
</script>

<style scoped lang="scss">
.column-card {
  background: #ccc;
}

.column-header {
  display: flex;
  justify-content: space-between;
}

.column-tasks {
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr;
}
</style>
