import { createSSRApp } from "vue";
import App from "./App.vue";

import "@/api";
import { Pinia, piniaPluginPersistedstate } from "@/plugins";
export function createApp() {
  const app = createSSRApp(App);
  // 注册routers
  app.use(Pinia.createPinia().use(piniaPluginPersistedstate));

  return {
    app,
    Pinia, // 此处必须将 Pinia 返回
  };
}
