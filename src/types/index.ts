import { Table } from "@mostlytyped/rethinkid-js-sdk/dist/types/table";

export type State = {
  loaded: boolean;
  authenticated: boolean;
  user: User;
  boards: Board[];
  boardsTable: Table;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Board = {
  id: string;
  name: string;
  columns: Column[];
};

export type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

export type Task = {
  id: string;
  name: string;
  description: string;
};

// Action payloads
export type ActionPayloadCreateColumn = {
  boardId: string;
  columnName: string;
};

export type ActionPayloadUpdateColumn = {
  boardId: string;
  updateColumn: Column;
};

export type ActionPayloadDeleteColumn = {
  boardId: string;
  columnId: string;
};

export type ActionPayloadMoveColumn = {
  boardId: string;
  fromColumnId: string;
  toColumnId: string;
};

export type ActionPayloadCreateTask = {
  boardId: string;
  columnId: string;
  taskName: string;
};

export type ActionPayloadUpdateTask = {
  boardId: string;
  columnId: string;
  updateTask: Task;
};

export type ActionPayloadDeleteTask = {
  boardId: string;
  columnId: string;
  taskId: string;
};

export type ActionPayloadMoveTask = {
  boardId: string;
  fromColumnId: string;
  fromTaskId: string;
  toColumnId: string;
  toTaskId?: string;
};

export type SignUpIn = {
  email: string;
  password: string;
};
