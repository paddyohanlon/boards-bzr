import { createStore } from "vuex";
import { v4 as uuidv4 } from "uuid";
import {
  State,
  User,
  Board,
  Column,
  Columns,
  Task,
  Tasks,
  ActionPayloadCreateColumn,
  ActionPayloadUpdateColumn,
  ActionPayloadDeleteColumn,
  ActionPayloadMoveColumn,
  ActionPayloadCreateTask,
  ActionPayloadUpdateTask,
  ActionPayloadDeleteTask,
  ActionPayloadMoveTask,
} from "@/types";
import { rid } from "@/rethinkid";

const initialBoards: Board[] = [];

const BOARDS_TABLE_NAME = "boards";

const state: State = {
  loaded: false,
  authenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
  },
  boards: initialBoards,
  boardsTable: rid.table(BOARDS_TABLE_NAME, {}),
};

export default createStore({
  state,
  mutations: {
    SET_LOADED: (state, loaded: boolean) => {
      state.loaded = loaded;
    },
    SIGN_IN: (state, user: User) => {
      state.authenticated = true;
      state.user = user;
    },
    SET_BOARDS(state, boards: Board[]) {
      state.boards = boards;
    },
    CREATE_BOARD(state, board: Board) {
      state.boards.push(board);
    },
    UPDATE_BOARD(state, { board, boardIndex }: { board: Board; boardIndex: number }) {
      state.boards[boardIndex] = board;
    },
    DELETE_BOARD(state, boardIndex: number) {
      state.boards.splice(boardIndex, 1);
    },
  },
  actions: {
    async autoSignIn({ commit, dispatch }) {
      if (rid.isLoggedIn()) {
        try {
          const user = rid.userInfo();
          console.log("user", user);
          commit("SIGN_IN", user);

          await dispatch("fetchBoards");

          commit("SET_LOADED", true);
        } catch (e: any) {
          console.error("tableRead error", e);
        }
      } else {
        commit("SET_LOADED", true);
      }
    },
    async fetchBoards({ commit, state }): Promise<void> {
      try {
        console.log("fetchBoards");
        // Get all from 'boards' table
        const readResponse = await state.boardsTable.read();
        commit("SET_BOARDS", readResponse.data);
        console.log("readResponse", readResponse);
      } catch (e: any) {
        console.log("fetchBoards error", e);
        // Assume table doesn't exist
        const createResponse = await rid.tablesCreate(BOARDS_TABLE_NAME);
        console.log("createResponse", createResponse);
      }
    },
    async createBoard({ commit }, boardName: string): Promise<void> {
      const board: Board = {
        id: uuidv4(),
        name: boardName,
        columns: {},
      };

      const response = await state.boardsTable.insert(board);
      console.log("table:insert response", response);
      commit("CREATE_BOARD", board);
    },
    async updateBoard({ commit, getters }, board: Board): Promise<void> {
      const response = await state.boardsTable.replace(board);
      console.log("table:replace response", response);
      if (response.message) {
        commit("UPDATE_BOARD", { board: board, boardIndex: getters.boardIndex(board.id) });
      }
    },
    async deleteBoard({ commit, getters }, board: Board): Promise<void> {
      const response = await state.boardsTable.delete({ rowId: board.id });
      console.log("table:delete response", response);
      if (response.message) {
        commit("DELETE_BOARD", { boardIndex: getters.boardIndex(board.id) });
      }
    },
    createColumn({ dispatch, state, getters }, { boardId, columnName }: ActionPayloadCreateColumn): void {
      const columnId = uuidv4();
      const column: Column = {
        id: columnId,
        name: columnName,
        tasks: {},
      };

      const boardIndex = getters.boardIndex(boardId);

      const board = state.boards[boardIndex];
      board.columns[columnId] = column;

      dispatch("updateBoard", board as Board);
    },
    updateColumn({ dispatch, state, getters }, { boardId, updateColumn }: ActionPayloadUpdateColumn): void {
      const boardIndex = getters.boardIndex(boardId);
      const board = state.boards[boardIndex];
      board.columns[updateColumn.id] = updateColumn;

      dispatch("updateBoard", board as Board);
    },
    deleteColumn({ dispatch, state, getters }, { boardId, columnId }: ActionPayloadDeleteColumn): void {
      const boardIndex = getters.boardIndex(boardId);

      const board = state.boards[boardIndex];
      delete board.columns[columnId];

      dispatch("updateBoard", board as Board);
    },
    moveColumn({ dispatch, state, getters }, { boardId, fromColumnId, toColumnId }: ActionPayloadMoveColumn): void {
      // Do not move to the same place
      if (fromColumnId === toColumnId) {
        return;
      }

      const boardIndex = getters.boardIndex(boardId);

      const columns = state.boards[boardIndex].columns;

      // Create a new columns object with the desired order
      const columnsReordered: Columns = {};

      // Determine whether column should be moved before or after the 'to column'
      let fromColumnIsBeforeTo = false;

      for (const columnId in columns) {
        if (columnId === fromColumnId) {
          // Found the `from column`
          fromColumnIsBeforeTo = true;
          continue;
        }

        if (columnId === toColumnId) {
          // Found the `to column`
          if (fromColumnIsBeforeTo) {
            // If before, move after
            columnsReordered[columnId] = columns[columnId];
            columnsReordered[fromColumnId] = columns[fromColumnId];
          } else {
            // If after, move before
            columnsReordered[fromColumnId] = columns[fromColumnId];
            columnsReordered[columnId] = columns[columnId];
          }
          continue;
        }

        // Otherwise put column in the same place
        columnsReordered[columnId] = columns[columnId];
      }

      const board = state.boards[boardIndex];
      board.columns = columnsReordered;

      dispatch("updateBoard", board as Board);
    },
    createTask({ dispatch, state, getters }, { boardId, columnId, taskName }: ActionPayloadCreateTask): void {
      const taskId = uuidv4();
      const task: Task = {
        id: taskId,
        name: taskName,
        description: "",
      };

      const boardIndex = getters.boardIndex(boardId);

      const board = state.boards[boardIndex];
      board.columns[columnId].tasks[taskId] = task;

      dispatch("updateBoard", board as Board);
    },
    updateTask({ dispatch, state, getters }, { boardId, columnId, updateTask }: ActionPayloadUpdateTask): void {
      const boardIndex = getters.boardIndex(boardId);
      const board = state.boards[boardIndex];
      board.columns[columnId].tasks[updateTask.id] = updateTask;

      dispatch("updateBoard", board as Board);
    },
    deleteTask({ dispatch, state, getters }, { boardId, columnId, taskId }: ActionPayloadDeleteTask): void {
      const boardIndex = getters.boardIndex(boardId);
      const board = state.boards[boardIndex];
      delete board.columns[columnId].tasks[taskId];

      dispatch("updateBoard", board as Board);
    },
    moveTask(
      { dispatch, state, getters },
      { boardId, fromColumnId, fromTaskId, toColumnId, toTaskId }: ActionPayloadMoveTask,
    ): void {
      // Do not move to the same place
      if (fromTaskId === toTaskId) {
        return;
      }

      const boardIndex = getters.boardIndex(boardId);

      const fromTasks = state.boards[boardIndex].columns[fromColumnId].tasks;
      const fromTask = state.boards[boardIndex].columns[fromColumnId].tasks[fromTaskId];

      const toTasks = state.boards[boardIndex].columns[toColumnId].tasks;

      // Create a new tasks object with the desired order
      const updatedToTasks: Tasks = {};

      // Determine whether task should be moved before or after another
      let fromTaskIsBeforeTo = false;

      for (const taskId in toTasks) {
        if (taskId === fromTaskId) {
          // Found the `from task`
          fromTaskIsBeforeTo = true;
          continue;
        }

        if (taskId === toTaskId) {
          // Found the `to task`
          if (fromTaskIsBeforeTo) {
            // If before, move after
            updatedToTasks[taskId] = toTasks[taskId];
            updatedToTasks[fromTaskId] = fromTasks[fromTaskId];
          } else {
            // If after, move before
            updatedToTasks[fromTaskId] = fromTasks[fromTaskId];
            updatedToTasks[taskId] = toTasks[taskId];
          }
          continue;
        }

        // Otherwise put task in the same place
        updatedToTasks[taskId] = toTasks[taskId];
      }

      // If no ID is present, we are dropping a task on a column, so add task to the end of the list
      if (!toTaskId) {
        updatedToTasks[fromTaskId] = fromTask;
      }

      const board = state.boards[boardIndex];
      board.columns[toColumnId].tasks = updatedToTasks;

      // delete from task after moving to different column
      if (fromColumnId !== toColumnId) {
        delete board.columns[fromColumnId].tasks[fromTaskId];
      }

      dispatch("updateBoard", board as Board);
    },
  },
  getters: {
    boardIndex: (state) => (boardId: string) => {
      return state.boards.findIndex((board) => board.id === boardId);
    },
  },
  modules: {},
});
