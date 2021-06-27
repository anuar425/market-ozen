import router from "./router";

import store from "./store";

export function authRequired() {
  console.log("authRequired");

  if (!store.state.user) {
    router.push("/login");
  }
}
