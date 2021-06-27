import axios from "axios";
import { createLogger, createStore } from "vuex";
import makeVuexCRUD from "./VuexCRUD";

const collections = makeVuexCRUD("collections");
const nft = makeVuexCRUD("nft");

export default createStore({
  modules: { collections, nft },
  state: {
    user: null,
    wallet: null,
  },
  mutations: {
    loadState(state, payload) {
      Object.assign(state, payload);
    },
  },
  actions: {
    async checkAuth({ commit }) {
      try {
        const res = await axios.post("auth/check");
        commit("loadState", { user: res.data });
      } catch (e) {}
    },
    async walletAuth({ state, commit }) {
      if (typeof window.ethereum !== "undefined" && state.wallet === null) {
        //console.log("metamask is installed!");
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts[0]) {
          commit("loadState", { wallet: accounts[0] });
        }

        console.log(accounts);
      } else {
        console.log("eth no found!");
      }
    },
    async init({ dispatch, commit }) {
      dispatch("checkAuth");
      dispatch("walletAuth");
      dispatch("collections/fetch");
      dispatch("nft/fetch");

      if (typeof window.ethereum !== "undefined") {
        window.ethereum.on("disconnect", () => {
          console.log("DISCONNECT");
          commit("loadState", { wallet: null });
        });
      }
    },
  },

  plugins: [createLogger()],
});
