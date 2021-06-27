import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import Axios from "axios";
Axios.defaults.baseURL = "//" + location.host + "/api";
const app = createApp(App);
installElementPlus(app);

import "./wallet";
import ImageUploader from "./components/image-uploader.vue";
import CollectionCard from "./components/collection-card.vue";

app
  .use(store)
  .use(router)
  .directive("image-uploader", ImageUploader)
  .directive("collection-card", CollectionCard)
  .mount("#app");
