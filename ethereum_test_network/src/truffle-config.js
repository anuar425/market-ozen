module.exports = {
  networks: {
    development: {
      host: "192.168.0.157",
      port: 8545,
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
};
