import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Boards from "../views/Boards.vue";
import Board from "../views/Board.vue";
import BoardUpdate from "../views/BoardUpdate.vue";
import ColumnUpdate from "../views/ColumnUpdate.vue";
import TaskUpdate from "../views/TaskUpdate.vue";
import NotFound from "../views/NotFound.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Callback from "../views/Callback.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/sign-up",
    name: "signUp",
    component: SignUp,
    meta: { requiresAuth: false },
  },
  {
    path: "/sign-in",
    name: "signIn",
    component: SignIn,
    meta: { requiresAuth: false },
  },
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
    if (!localStorage.getItem("token")) {
      // Redirect to the sign in view if no token found and route requires auth
      next({ name: "signIn" });
      return;
    }
  }

  next();
});

export default router;
