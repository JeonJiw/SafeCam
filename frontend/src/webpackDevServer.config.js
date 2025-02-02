module.exports = function (proxy, allowedHost) {
  return {
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    webSocketServer: {
      options: {
        port: 0,
      },
    },
  };
};
