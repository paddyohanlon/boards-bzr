<template>
  <div class="board">
    <template v-if="board">
      <div class="board-header">
        <h1 class="title is-3 board-title">{{ board.name }}</h1>
        <button class="button is-small is-rounded is-outlined" @click="goToBoardUpdate()">
          &middot;&middot;&middot;
        </button>
      </div>
      <div class="columns-grid">
        <ColumnItem v-for="column in board.columns" :key="column.id" :column="column" />
        <ColumnCreate />
      </div>

      <BoardModal />
    </template>
    <div class="notification is-warning" v-else>Board not found.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import useRouterParams from "@/composables/router-params";
import { Board } from "@/types";
import ColumnItem from "@/components/ColumnItem.vue";
import ColumnCreate from "@/components/ColumnCreate.vue";
import BoardModal from "@/components/BoardModal.vue";

export default defineComponent({
  name: "BoardView",
  components: {
    ColumnItem,
    ColumnCreate,
    BoardModal,
  },
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

    const goToBoardUpdate: () => void = () => {
      if (board.value) {
        router.push({
          name: "boardUpdate",
          params: { boardId: board.value.id }, // toString?
        });
      }
    };

    return {
      board,
      goToBoardUpdate,
    };
  },
});
</script>

<style scoped lang="scss">
.board {
  padding: 1em;
}

.board-header {
  display: flex;
  justify-content: space-between;
}

.board-title {
  color: $white;
}

.columns-grid {
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  grid-auto-flow: column;
  grid-auto-columns: minmax(272px, 1fr);
  overflow-x: auto;
}
</style>
