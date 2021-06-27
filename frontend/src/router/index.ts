import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Landing,
  },
  {
    path: "/connect-wallet",
    name: "connect wallet",
    component: () => import(/* webpackChunkName: "wallet" */ "../views/ConnectWallet.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/token/:id",
    name: "NFT view",
    component: () => import(/* webpackChunkName: "nft-page" */ "../views/NftPage.vue"),
  },
  {
    path: "/collection/:id",
    name: "Collection",
    component: () => import(/* webpackChunkName: "collection" */ "../views/Collection.vue"),
  },
  {
    path: "/stats",
    name: "Stats",
    component: () => import(/* webpackChunkName: "stats" */ "../views/Stats.vue"),
  },
  {
    path: "/collections",
    name: "Collections",
    component: () => import(/* webpackChunkName: "mycollecti" */ "../views/MyCollections.vue"),
  },
  {
    path: "/marketplace/:type",
    alias: "/marketplace",
    name: "Marketplace",
    component: () => import(/* webpackChunkName: "about" */ "../views/Marketplace.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 });
      }, 100);
    });
  },
});

export default router;
