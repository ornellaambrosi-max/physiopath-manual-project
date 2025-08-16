// craco.config.js
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (config) => {
      // Assicura la risoluzione di .jsx/.js senza estensione
      if (!config.resolve.extensions.includes(".jsx")) {
        config.resolve.extensions.push(".jsx");
      }
      if (!config.resolve.extensions.includes(".js")) {
        config.resolve.extensions.push(".js");
      }
      return config;
    },
  },
};
