import store from "@/store";
import { ActionPayloadMoveColumn, ActionPayloadMoveTask } from "@/types";

const fromColumnIdDataName = "from-column-id";
const fromTaskIdDataName = "from-task-id";

function dragstartColumn(dragstartEvent: DragEvent, fromColumnId: string): void {
  const drag = dragstartEvent.dataTransfer;
  if (drag) {
    drag.effectAllowed = "move";
    drag.dropEffect = "move";
    drag.setData(fromColumnIdDataName, fromColumnId);
    drag.setData("type", "column");
  }
}

function dragstartTask(dragstartEvent: DragEvent, fromColumnId: string, fromTaskId: string): void {
  const drag = dragstartEvent.dataTransfer;
  if (drag) {
    drag.effectAllowed = "move";
    drag.dropEffect = "move";
    drag.setData(fromTaskIdDataName, fromTaskId);
    drag.setData(fromColumnIdDataName, fromColumnId);
    drag.setData("type", "task");
  }
}

function dropTaskOrColumn(dropEvent: DragEvent, boardId: string, toColumnId: string, toTaskId?: string): void {
  const drop = dropEvent.dataTransfer;
  if (drop) {
    const type = drop.getData("type");
    if (type === "task") {
      dropTask(dropEvent, boardId, toColumnId, toTaskId);
    } else {
      dropColumn(dropEvent, boardId, toColumnId);
    }
  }
}

function dropColumn(dropEvent: DragEvent, boardId: string, toColumnId: string): void {
  const drop = dropEvent.dataTransfer;
  if (drop) {
    const fromColumnId = drop.getData(fromColumnIdDataName);

    store.dispatch("moveColumn", {
      boardId,
      fromColumnId,
      toColumnId,
    } as ActionPayloadMoveColumn);
  }
}

function dropTask(dropEvent: DragEvent, boardId: string, toColumnId: string, toTaskId?: string): void {
  const drop = dropEvent.dataTransfer;
  if (drop) {
    const fromColumnId = drop.getData(fromColumnIdDataName);
    const fromTaskId = drop.getData(fromTaskIdDataName);

    // Do nothing if dropping a column on a task
    if (!fromTaskId) {
      return;
    }

    store.dispatch("moveTask", {
      boardId,
      fromColumnId,
      fromTaskId,
      toColumnId,
      toTaskId,
    } as ActionPayloadMoveTask);
  }
}

export default {
  dragstartColumn,
  dragstartTask,
  dropTaskOrColumn,
};
