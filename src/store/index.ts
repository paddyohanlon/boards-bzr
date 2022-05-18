import { createStore } from "vuex";
import { v4 as uuidv4 } from "uuid";
import {
  State,
  User,
  Board,
  Column,
  Task,
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
        columns: [],
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
    createColumn({ dispatch, getters }, { boardId, columnName }: ActionPayloadCreateColumn): void {
      const columnId = uuidv4();
      const initialTasks = [] as Task[];
      const column: Column = {
        id: columnId,
        name: columnName,
        tasks: initialTasks,
      };

      const board = getters.boardById(boardId);
      board.columns.push(column);

      dispatch("updateBoard", board as Board);
    },
    updateColumn({ dispatch, getters }, { boardId, updateColumn }: ActionPayloadUpdateColumn): void {
      const board = getters.boardById(boardId);
      const columnIndex = getters.indexById(board.columns, updateColumn.id);
      board.columns.splice(columnIndex, 1, updateColumn);

      dispatch("updateBoard", board as Board);
    },
    deleteColumn({ dispatch, getters }, { boardId, columnId }: ActionPayloadDeleteColumn): void {
      const board = getters.boardById(boardId);
      const columnIndex = getters.indexById(board.columns, columnId);
      board.columns.splice(columnIndex, 1);

      dispatch("updateBoard", board as Board);
    },
    moveColumn({ dispatch, getters }, { boardId, fromColumnId, toColumnId }: ActionPayloadMoveColumn): void {
      // Do not move to the same place
      if (fromColumnId === toColumnId) {
        return;
      }

      const board = getters.boardById(boardId);
      const columns = board.columns as Column[];

      const fromColumnIndex = getters.indexById(columns, fromColumnId);
      const toColumnIndex = getters.indexById(columns, toColumnId);

      const columnToMove = columns[fromColumnIndex];
      columns.splice(fromColumnIndex, 1);
      columns.splice(toColumnIndex, 0, columnToMove);

      dispatch("updateBoard", board as Board);
    },
    createTask({ dispatch, getters }, { boardId, columnId, taskName }: ActionPayloadCreateTask): void {
      const taskId = uuidv4();
      const task: Task = {
        id: taskId,
        name: taskName,
        description: "",
      };

      const board = getters.boardById(boardId);
      const columnIndex = getters.indexById(board.columns, columnId);
      board.columns[columnIndex].tasks.push(task);

      dispatch("updateBoard", board as Board);
    },
    updateTask({ dispatch, getters }, { boardId, columnId, updateTask }: ActionPayloadUpdateTask): void {
      const board = getters.boardById(boardId);
      const columnIndex = getters.indexById(board.columns, columnId);
      const tasks = board.columns[columnIndex].tasks;
      const taskIndex = getters.indexById(tasks, updateTask.id);
      tasks.splice(taskIndex, 1, updateTask);

      dispatch("updateBoard", board as Board);
    },
    deleteTask({ dispatch, getters }, { boardId, columnId, taskId }: ActionPayloadDeleteTask): void {
      const board = getters.boardById(boardId);
      const columnIndex = getters.indexById(board.columns, columnId);
      const tasks = board.columns[columnIndex].tasks;
      const taskIndex = getters.indexById(tasks, taskId);
      tasks.splice(taskIndex, 1);

      dispatch("updateBoard", board as Board);
    },
    moveTask(
      { dispatch, getters },
      { boardId, fromColumnId, fromTaskId, toColumnId, toTaskId }: ActionPayloadMoveTask,
    ): void {
      // Do not move to the same place
      if (fromTaskId === toTaskId) {
        return;
      }

      const board = getters.boardById(boardId);

      const fromColumnIndex = getters.indexById(board.columns, fromColumnId);
      const fromTasks = board.columns[fromColumnIndex].tasks;
      const fromTaskIndex = getters.indexById(fromTasks, fromTaskId);

      const toColumnIndex = getters.indexById(board.columns, toColumnId);
      const toTasks = board.columns[toColumnIndex].tasks;
      const toTaskIndex = getters.indexById(toTasks, toTaskId);

      // TODO function arraymove(arr, fromIndex, toIndex)
      const taskToMove = fromTasks[fromTaskIndex];
      fromTasks.splice(fromTaskIndex, 1);
      toTasks.splice(toTaskIndex, 0, taskToMove);

      dispatch("updateBoard", board as Board);
    },
  },
  getters: {
    boardIndex: (state) => (boardId: string) => {
      return state.boards.findIndex((board) => board.id === boardId);
    },
    // For all non-board indexes
    indexById: () => (array: { id: string }[], id: string) => {
      return array.findIndex((item) => item.id === id);
    },
    boardById: (state, getters) => (boardId: string) => {
      const index = getters.indexById(state.boards, boardId);
      return state.boards[index];
    },
  },
  modules: {},
});
