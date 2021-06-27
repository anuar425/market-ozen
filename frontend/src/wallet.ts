declare global {
  interface Window {
    ethereum: any;
  }
}
/* 
window.onload = async function() {
  console.log("HI");
  console.log(window.ethereum);
  if (typeof window.ethereum !== "undefined") {
    console.log("metamask is installed!");

    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
  } else {
    console.log("eth no found!");
  }
};
*  */
export {};
