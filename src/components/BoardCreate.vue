<template>
  <form @submit.prevent="submitCreateBoard">
    <div class="field mt-4">
      <label class="label is-sr-only" for="add-board-input">+ Add a board</label>
      <div class="control mb-0">
        <input
          id="add-board-input"
          type="text"
          v-model="boardName"
          class="input"
          placeholder="+ Add a board"
          required
          autocomplete="off"
        />
      </div>
    </div>
    <button class="button is-sr-only" type="submit">Add a board</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BoardCreate",
  data() {
    return {
      boardName: "",
    };
  },
  methods: {
    async submitCreateBoard(): Promise<void> {
      await this.$store.dispatch("createBoard", this.boardName);
      this.boardName = "";
    },
  },
});
</script>

<style scoped lang="scss"></style>
