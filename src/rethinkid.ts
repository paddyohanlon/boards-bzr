import { RethinkID } from "@mostlytyped/rethinkid-js-sdk";

const config = {
  appId: process.env.VUE_APP_APP_ID,
  signUpRedirectUri: process.env.VUE_APP_SIGN_UP_REDIRECT_URI,
  logInRedirectUri: process.env.VUE_APP_LOG_IN_REDIRECT_URI,
};

export const rid = new RethinkID(config);
