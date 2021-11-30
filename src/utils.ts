// Utils to be used anywhere, in .vue files or Vuex actions, or wherever.

export function signOutUtil(): void {
  if (localStorage.getItem("token")) {
    console.log("sign out");
    localStorage.removeItem("token");

    // a `beforeEach` global navigation guard in the router handles redirection
    location.reload();
  }
}
