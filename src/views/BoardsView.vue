<template>
  <div class="board">
    <div v-if="!authenticated">
      <button class="button is-primary" @click="bzr.login">Sign in or create an account</button>
    </div>
    <template v-else>
      <div class="columns-grid" aria-live="polite">
        <div
          v-for="board in boards"
          :key="board.id"
          class="card is-clickable"
          role="button"
          @click="goToBoard(board.id)"
        >
          <div class="card-content">
            <h2 class="title is-4">{{ board.name }}</h2>
          </div>
        </div>
        <BoardCreate />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BoardCreate from "@/components/BoardCreate.vue";
import { bzr } from "@/bzr";

export default defineComponent({
  name: "BoardsView",
  components: {
    BoardCreate,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const authenticated = computed(() => store.state.authenticated);
    const boards = computed(() => store.state.boards);

    function goToBoard(boardId: string): void {
      router.push({ name: "board", params: { boardId } });
    }

    return { authenticated, boards, goToBoard, bzr };
  },
});
</script>

<style scoped lang="scss">
.board {
  padding: 1em;
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
@/bzr