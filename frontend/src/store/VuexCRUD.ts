import { ActionContext, ActionHandler, Module } from "vuex";
import Axios from "axios";

type Item = {
  _id: string;
};

export type CRUDState<T extends Item> = {
  list: T[];
  fetched: boolean;
  total: number;
};

export default function makeVuexCRUD<T extends Item, RootStoreState>(endpoint: string) {
  function fetch(ctx: ActionContext<CRUDState<T>, RootStoreState>): Promise<T[]>;
  function fetch(ctx: ActionContext<CRUDState<T>, RootStoreState>, itemId?: string): Promise<T>;

  async function fetch(ctx: ActionContext<CRUDState<T>, RootStoreState>, itemId?: string) {
    if (itemId) {
      const res = await Axios.get<T>(`${endpoint}/${itemId}`);
      ctx.commit(`patch`, res.data);
      return res.data;
    } else {
      const res = await Axios.get<T[]>(endpoint);
      if (res.data.length) ctx.commit(`load`, { list: res.data, total: res.headers.total || res.data.length });
      return res.data;
    }
  }

  const module: Module<CRUDState<T>, RootStoreState> = {
    namespaced: true,
    state: {
      fetched: false,
      list: [],
      total: 0,
    },
    getters: {
      lib(state) {
        return state.list.reduce((ns, v) => {
          ns[v._id] = v;
          return ns;
        }, {} as { [key: string]: any });
      },
    },
    actions: {
      fetch,
      async save(ctx, item: T) {
        const res = await Axios[item._id ? "put" : "post"]<T>(endpoint, item);
        ctx.commit(`patch`, res.data);
        if (!item._id) ctx.state.total++;
        return res.data;
      },
      async delete(ctx, itemId: string) {
        await Axios.delete(`${endpoint}/${itemId}`);
        ctx.state.total--;
        ctx.commit(`remove`, itemId);
      },
    },
    mutations: {
      patch(state, item) {
        const foundIndex = state.list.findIndex((p: T) => p._id === item._id);
        if (foundIndex != -1) {
          state.list[foundIndex] = item;
        } else {
          state.list.push(item);
        }
      },
      load(state, payload: { list: T[]; total: number }) {
        state.fetched = true;
        state.total = payload.total;
        state.list = [...state.list, ...payload.list];
      },
      remove(state, _id) {
        state.list = state.list.filter((f) => f._id !== _id);
      },
    },
  };
  return module;
}
