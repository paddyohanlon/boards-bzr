import {BazaarApp, BazaarOptions} from "@bzr/bazaar"
import { Board } from "./types";

console.log("process.env.VUE_APP_APP_ID", process.env.VUE_APP_APP_ID);
console.log("process.env.VUE_APP_REDIRECT_URI", process.env.VUE_APP_REDIRECT_URI);

const config: BazaarOptions = {
  appId: process.env.VUE_APP_APP_ID,
  loginRedirectUri: process.env.VUE_APP_REDIRECT_URI,
  onApiConnectError: async function (bzr) {
    // @ts-ignore
    bzr.logOut();
  },
};

export const bzr = new BazaarApp(config);

export const boardsCollection = bzr.collection<Board>("boards");
