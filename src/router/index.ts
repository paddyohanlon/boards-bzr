import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Boards from "../views/Boards.vue";
import Board from "../views/Board.vue";
import BoardUpdate from "../views/BoardUpdate.vue";
import ColumnUpdate from "../views/ColumnUpdate.vue";
import TaskUpdate from "../views/TaskUpdate.vue";
import NotFound from "../views/NotFound.vue";
import Callback from "../views/Callback.vue";

import { rid } from "@/rethinkid";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/callback",
    name: "callback",
    component: Callback,
    meta: { requiresAuth: false },
  },
  {
    path: "/board/:boardId",
    name: "board",
    component: Board,
    children: [
      {
        path: "update",
        name: "boardUpdate",
        component: BoardUpdate,
        meta: { isDisplayedInModal: true },
      },
      {
        path: "column/:columnId",
        name: "columnUpdate",
        component: ColumnUpdate,
        meta: { isDisplayedInModal: true },
      },
      {
        path: "column/:columnId/task/:taskId",
        name: "task",
        component: TaskUpdate,
        meta: { isDisplayedInModal: true },
      },
    ],
  },
  {
    path: "/",
    name: "home",
    component: Boards,
    meta: { requiresAuth: false },
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
    name: "notFound",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // If route requires auth
  if (to.matched.some((record) => record.meta.requiresAuth !== false)) {
    if (!rid.isLoggedIn()) {
      // Redirect to the sign in view if no token found and route requires auth
      next({ name: "home" });
      return;
    }
  }

  next();
});

export default router;
