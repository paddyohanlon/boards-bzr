<template>
  <div class="board">
    <div class="columns-grid" aria-live="polite">
      <div v-for="board in boards" :key="board.id" class="card is-clickable" role="button" @click="goToBoard(board.id)">
        <div class="card-content">
          <h2 class="title is-4">{{ board.name }}</h2>
        </div>
      </div>
      <BoardCreate />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import BoardCreate from "@/components/BoardCreate.vue";

export default defineComponent({
  name: "Boards",
  components: {
    BoardCreate,
  },
  computed: {
    ...mapState(["boards"]),
  },
  methods: {
    goToBoard(boardId: string): void {
      this.$router.push({ name: "board", params: { boardId } });
    },
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
