import RethinkID from "@mostlytyped/rethinkid-js-sdk";

const baseURL = window.location.origin;

const config = {
  appId: process.env.VUE_APP_APP_ID,
  loginRedirectUri: `${baseURL}/callback`,
  dataAPIConnectErrorCallback: function () {
    // this = RethinkID
    // @ts-ignore
    this.logOut();
  },
};

export const rid = new RethinkID(config);
