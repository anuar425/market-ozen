import ganache from "ganache-core";
import path from "path";
//import Web3 from "web3";
const server = ganache.server({
  default_balance_ether: 1000000,
  db_path: path.resolve(__dirname, "../_blockchain/"),
  debug: true,
  logger: console,
  locked: false,
});
const provider = server.provider;
const port = process.env.PORT || 8545;
server.listen(port, () => {
  console.log(`blockchain test server started on port ${port}`);
   provider.send({ id: 1991, jsonrpc: "2.0", method: "eth_chainId", params: [] }, (err, result) => {
    console.log('cjaom',result);
  });
/*   provider.send(
    { id: 1991, jsonrpc: "2.0", method: "miner_start", params: [] },
    (err, result) => {
      console.log(result);
    }
  );  */
  provider.send(
    { id: 1991, jsonrpc: "2.0", method: "eth_accounts", params: [] },
    (err, result) => {
      console.log(result);
    }
  );
});



//const web3 = new Web3(provider);
