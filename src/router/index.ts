import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BoardsView from "../views/BoardsView.vue";
import BoardView from "../views/BoardView.vue";
import BoardUpdate from "../views/BoardUpdate.vue";
import ColumnUpdate from "../views/ColumnUpdate.vue";
import TaskUpdate from "../views/TaskUpdate.vue";
import NotFound from "../views/NotFound.vue";

import { bzr } from "@/bzr";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/board/:boardId",
    name: "board",
    component: BoardView,
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
    component: BoardsView,
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
    if (!bzr.isLoggedIn()) {
      // Redirect to the sign in view if no token found and route requires auth
      next({ name: "home" });
      return;
    }
  }

  next();
});

export default router;
