<template>
  <div class="ConnectWallet padded flex-center text-center">
    <br /><br /><br />
    <div>
      <img src="/assets/mm-logo.svg" width="320" alt="" />
    </div>
    <br /><br />
    <div v-if="wallet">
      <h3>Кошелек подключен</h3>
      <h4>Адрес кошелька:</h4>
      <h4><a :href="`https://rinkeby.etherscan.io/address/${wallet}`" target="_blank">{{ wallet }}</a></h4>
    </div>

    <div v-else-if="metamaskDetected">
      <p style="color:lightgreen">
        <b> MetaMask обнаружен, подключите кошелек</b>
      </p>
      <el-button @click="$store.dispatch('walletAuth')" type="success"> подключить кошелек MetaMask </el-button>
      <br />
      <br />
      <p style="color:red">в MetaMask используйте сеть <b>Тестовая сеть Rinkeby</b></p>
    </div>
    <div v-else>
      <h3><b>Подключите MetaMask</b> <br />используя раcширение для Chrome или Firefox</h3>
      <br />
      <a
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        target="_blank"
      >
        <el-button type="primary"> <i class="fab fa-chrome"></i>&nbsp; MetaMask для Chrome </el-button></a
      >&nbsp;
      <a
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        target="_blank"
      >
        <el-button type="warning"> <i class="fab fa-firefox"></i>&nbsp; MetaMask для FireFox </el-button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "ConnectWallet",
  setup() {
    const store = useStore();
    const metamaskDetected = computed(() => typeof window.ethereum !== "undefined");
    const wallet = computed(() => store.state.wallet);
    return { metamaskDetected, wallet };
  },
});
</script>

<style scoped lang="scss">
.ConnectWallet {
}
</style>
